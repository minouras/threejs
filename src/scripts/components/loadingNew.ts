/**
 * AdaptivePageLoader クラス
 * ============================================================
 * ページ読み込み速度に応じて適応的にローディング表示を制御
 *
 * 【動作フロー】
 * 1. ページ読み込み開始時、bodyのチラつき防止のため page-loading クラスを付与
 * 2. 初回訪問判定（sessionStorageベース）
 * 3. 読み込み速度を監視し、一定時間（250ms）以上かかる場合のみローディング表示
 * 4. 高速読み込み時はローディングを表示せず即座にコンテンツ表示
 * 5. ローディング表示した場合は最低表示時間（1000ms）を確保してUXを向上
 *
 * 【使い方】
 * - トップページのみ #js-loading-overlay を配置
 * - ファーストビューの重要画像に data-critical 属性を付与
 * - 初期化: new AdaptivePageLoader();
 * ============================================================
 */

export class AdaptivePageLoader {
  // ============================================================
  // 定数定義
  // ============================================================

  /** sessionStorageのキー名（初回訪問判定用） */
  private static readonly SESSION_KEY = 'page_loaded';

  /** ローディング表示判定の閾値（ms）
   * この時間以内に読み込みが完了すればローディングを表示しない */
  private static readonly DELAY_THRESHOLD = 250;

  /** ローディングの最低表示時間（ms）
   * 一度表示したらこの時間は必ず見せる（チラつき防止） */
  private static readonly MIN_DISPLAY_TIME = 1000;

  // ============================================================
  // プロパティ
  // ============================================================

  /** html要素への参照 */
  private root: HTMLElement;

  /** ローディングオーバーレイ要素 */
  private loadingOverlay: HTMLElement | null;

  /** クラス初期化時のタイムスタンプ */
  private startTime: number;

  /** セッション内での初回訪問フラグ */
  private isFirstVisit: boolean;

  /** ローディングを実際に表示したかどうかのフラグ */
  private shouldShowLoading: boolean = false;

  // ============================================================
  // コンストラクタ
  // ============================================================

  constructor() {
    this.root = document.documentElement;
    this.loadingOverlay = document.getElementById('js-loading-overlay');
    this.startTime = performance.now();
    this.isFirstVisit = !this.hasVisitedInSession();

    this.init();
  }

  // ============================================================
  // メインロジック
  // ============================================================

  /**
   * 初期化処理
   * ページ読み込みの制御フローを実行
   */
  private async init(): Promise<void> {
    // ------------------------------------------------------------
    // 1. チラつき防止クラスを付与（全ページ共通）
    // ------------------------------------------------------------
    this.root.classList.add('page-loading');

    // ------------------------------------------------------------
    // 2. 早期リターン条件のチェック
    // ------------------------------------------------------------
    // - 2回目以降の訪問（sessionStorageにフラグあり）
    // - ローディングオーバーレイ要素が存在しない（下層ページ等）
    if (!this.isFirstVisit || !this.loadingOverlay) {
      this.completeLoading(0); // 即座に完了状態へ
      return;
    }

    // ------------------------------------------------------------
    // 3. 初回訪問フラグを記録
    // ------------------------------------------------------------
    this.markAsVisited();

    // ------------------------------------------------------------
    // 4. ローディングオーバーレイの初期状態設定
    // ------------------------------------------------------------
    // 最初は非表示にしておき、必要に応じて後から表示
    if (this.loadingOverlay) {
      this.loadingOverlay.style.opacity = '0';
      this.loadingOverlay.style.display = 'flex';
    }

    // ------------------------------------------------------------
    // 5. 遅延表示タイマーの設定
    // ------------------------------------------------------------
    // DELAY_THRESHOLD（250ms）経過してもまだ読み込み中なら
    // ローディングオーバーレイをフェードイン表示
    const delayTimer = setTimeout(() => {
      if (this.loadingOverlay) {
        this.loadingOverlay.style.opacity = '1';
        this.shouldShowLoading = true; // 表示フラグを立てる
      }
    }, AdaptivePageLoader.DELAY_THRESHOLD);

    // ------------------------------------------------------------
    // 6. 実際の読み込み処理を実行
    // ------------------------------------------------------------
    const loadStartTime = performance.now();

    await Promise.all([
      this.loadCriticalImages(), // クリティカル画像の読み込み
      this.loadFonts(), // Webフォントの読み込み
    ]);

    const loadEndTime = performance.now();
    const loadDuration = loadEndTime - loadStartTime;

    // タイマーをクリア（既に表示済みの場合も含む）
    clearTimeout(delayTimer);

    // ------------------------------------------------------------
    // 7. ローディング表示の有無に応じた分岐処理
    // ------------------------------------------------------------
    if (this.shouldShowLoading) {
      // ケースA: ローディングを表示した場合
      // → 最低表示時間を確保してユーザー体験を向上

      const displayTime = loadEndTime - this.startTime;
      const remainingTime = AdaptivePageLoader.MIN_DISPLAY_TIME - displayTime;

      // まだ最低表示時間に達していない場合は待機
      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      this.completeLoading(400); // フェードアウトアニメーション付きで完了
    } else {
      // ケースB: 高速読み込みでローディング非表示のまま完了
      // → 即座にコンテンツを表示してスムーズな体験を提供

      if (this.loadingOverlay) {
        this.loadingOverlay.style.display = 'none';
      }
      this.completeLoading(0); // アニメーションなしで即座に完了
    }

    // ------------------------------------------------------------
    // 8. デバッグ情報の出力（開発時のみ有効化推奨）
    // ------------------------------------------------------------
    if (import.meta.env.DEV) {
      console.log(`[PageLoader] Load duration: ${loadDuration.toFixed(0)}ms`);
      console.log(`[PageLoader] Loading overlay: ${this.shouldShowLoading ? 'shown' : 'hidden'}`);
    }
  }

  // ============================================================
  // 画像読み込み処理
  // ============================================================

  /**
   * クリティカル画像の読み込み
   * data-critical属性を持つ画像要素の読み込みを監視し、
   * プログレスバーを更新する
   */
  private async loadCriticalImages(): Promise<void> {
    return new Promise((resolve) => {
      // ------------------------------------------------------------
      // 1. クリティカル画像要素を取得
      // ------------------------------------------------------------
      // - img[data-critical]: 通常の画像タグ
      // - [data-critical-bg]: CSS background-imageを持つ要素
      const criticalImages = document.querySelectorAll<HTMLImageElement>(
        'img[data-critical], [data-critical-bg]',
      );

      // 対象画像が存在しない場合は即座に完了
      if (criticalImages.length === 0) {
        resolve();
        return;
      }

      let loadedCount = 0;
      const totalImages = criticalImages.length;

      // ------------------------------------------------------------
      // 2. 進捗更新用の関数
      // ------------------------------------------------------------
      const updateProgress = () => {
        loadedCount++;
        const progress = (loadedCount / totalImages) * 100;

        // ローディングオーバーレイを表示している場合のみ
        // プログレスバーを更新（非表示時は不要な処理を省略）
        if (this.shouldShowLoading) {
          this.updateProgressBar(progress);
        }

        // 全画像の読み込みが完了したらPromiseをresolve
        if (loadedCount === totalImages) {
          resolve();
        }
      };

      // ------------------------------------------------------------
      // 3. 各画像要素の読み込み監視
      // ------------------------------------------------------------
      criticalImages.forEach((element) => {
        if (element.tagName === 'IMG') {
          // ケースA: 通常の<img>タグの場合
          const img = element as HTMLImageElement;

          // 既にキャッシュ済みで読み込み完了している場合
          if (img.complete) {
            updateProgress();
          } else {
            // 読み込み完了 or エラー時に進捗を更新
            img.addEventListener('load', updateProgress, { once: true });
            img.addEventListener('error', updateProgress, { once: true });
          }
        } else {
          // ケースB: CSS background-imageの場合
          // computed styleから画像URLを取得して読み込み
          const bgUrl = window.getComputedStyle(element).backgroundImage;
          const match = bgUrl.match(/url\(['"]?(.+?)['"]?\)/);

          if (match) {
            const img = new Image();
            img.src = match[1];
            img.addEventListener('load', updateProgress, { once: true });
            img.addEventListener('error', updateProgress, { once: true });
          } else {
            // URLが取得できない場合は完了扱い
            updateProgress();
          }
        }
      });
    });
  }

  // ============================================================
  // フォント読み込み処理
  // ============================================================

  /**
   * Webフォントの読み込み完了を待機
   * Font Loading APIを使用してフォントの準備完了を検知
   */
  private async loadFonts(): Promise<void> {
    // Font Loading APIが利用できない古いブラウザ対応
    if (!document.fonts) return;

    try {
      // 全てのフォントの読み込みが完了するまで待機
      await document.fonts.ready;
    } catch (error) {
      // フォント読み込みエラーは致命的ではないため
      // 警告のみ出力して処理を続行
      console.warn('[PageLoader] Font loading error:', error);
    }
  }

  // ============================================================
  // UI更新処理
  // ============================================================

  /**
   * プログレスバーの更新
   * @param progress - 進捗率（0-100）
   */
  private updateProgressBar(progress: number): void {
    const progressBar = document.getElementById('js-progress-bar');
    if (progressBar) {
      // scaleXを使用してスムーズなアニメーション
      progressBar.style.transform = `scaleX(${progress / 100})`;
    }
  }

  /**
   * ローディング完了処理
   * @param delay - フェードアウトのディレイ時間（ms）
   */
  private completeLoading(delay: number): void {
    setTimeout(() => {
      // ------------------------------------------------------------
      // 1. クラスの切り替え
      // ------------------------------------------------------------
      // page-loading を削除 → bodyのopacityが1になる
      // page-loaded を追加 → 追加のスタイル適用や他のスクリプトからの検知用
      this.root.classList.remove('page-loading');
      this.root.classList.add('page-loaded');

      // ------------------------------------------------------------
      // 2. ローディングオーバーレイのフェードアウト
      // ------------------------------------------------------------
      if (this.loadingOverlay) {
        this.loadingOverlay.style.opacity = '0';

        // フェードアウトアニメーション完了後にDOMから削除
        setTimeout(() => {
          this.loadingOverlay?.remove();

          // カスタムイベントを発火（GSAP等のアニメーション初期化用）
          window.dispatchEvent(new CustomEvent('pageReady'));
        }, 400);
      } else {
        // オーバーレイがない場合も同様にイベントを発火
        window.dispatchEvent(new CustomEvent('pageReady'));
      }
    }, delay);
  }

  // ============================================================
  // セッション管理
  // ============================================================

  /**
   * セッション内での訪問済みチェック
   * @returns 訪問済みの場合true
   */
  private hasVisitedInSession(): boolean {
    try {
      return sessionStorage.getItem(AdaptivePageLoader.SESSION_KEY) === 'true';
    } catch {
      // sessionStorageが利用できない環境では常に初回訪問として扱う
      // （プライベートブラウジングモード等）
      return false;
    }
  }

  /**
   * 訪問済みフラグをsessionStorageに記録
   */
  private markAsVisited(): void {
    try {
      sessionStorage.setItem(AdaptivePageLoader.SESSION_KEY, 'true');
    } catch {
      // sessionStorageが利用できない場合は無視
      // （エラーを出さずに処理を継続）
    }
  }
}
