/**
 * ModernPageLoader クラス
 * ------------------------------------------------------------
 * パフォーマンスとUXを両立させた段階的読み込み戦略
 *
 * 【戦略】
 * 1. Critical CSS + Font preload でFCP(First Contentful Paint)を最速化
 * 2. 画像は native lazy loading + blur placeholder で体感速度向上
 * 3. 初回のみ必要最小限のローディング演出
 * 4. 2回目以降はインスタント表示（bfcache活用）
 * 5. GSAPアニメーションとの協調動作
 * ------------------------------------------------------------
 */

export class ModernPageLoader {
  private static readonly SESSION_KEY = 'page_loaded';
  private static readonly MINIMUM_LOADING_TIME = 800; // 最低表示時間（UX的に自然な長さ）

  private root: HTMLElement;
  private loadingOverlay: HTMLElement | null;
  private startTime: number;
  private isFirstVisit: boolean;
  private criticalImagesLoaded: boolean = false;
  private fontsLoaded: boolean = false;

  constructor() {
    this.root = document.documentElement;
    this.loadingOverlay = document.getElementById('js-loading-overlay');
    this.startTime = performance.now();
    this.isFirstVisit = !this.hasVisitedInSession();

    this.init();
  }

  private async init(): Promise<void> {
    // 即座にチラつき防止のための基本クラスを付与
    this.root.classList.add('page-loading');

    // 初回訪問でない、またはローディングオーバーレイがない場合は即座に表示
    if (!this.isFirstVisit || !this.loadingOverlay) {
      this.completeLoading(0);
      return;
    }

    // 初回訪問フラグを立てる
    this.markAsVisited();

    // 並列で読み込み処理を実行
    await Promise.all([
      this.loadCriticalImages(),
      this.loadFonts(),
      this.ensureMinimumLoadingTime(),
    ]);

    this.completeLoading(300); // フェードアウトアニメーション時間
  }

  /**
   * クリティカルな画像の読み込み（ファーストビューのみ）
   */
  private async loadCriticalImages(): Promise<void> {
    return new Promise((resolve) => {
      const criticalImages = document.querySelectorAll<HTMLImageElement>(
        'img[data-critical], [data-critical-bg]',
      );

      if (criticalImages.length === 0) {
        this.criticalImagesLoaded = true;
        resolve();
        return;
      }

      let loadedCount = 0;
      const totalImages = criticalImages.length;

      // プログレスバーの更新
      const updateProgress = () => {
        loadedCount++;
        const progress = (loadedCount / totalImages) * 100;
        this.updateProgressBar(progress);

        if (loadedCount === totalImages) {
          this.criticalImagesLoaded = true;
          resolve();
        }
      };

      criticalImages.forEach((element) => {
        if (element.tagName === 'IMG') {
          const img = element as HTMLImageElement;
          if (img.complete) {
            updateProgress();
          } else {
            img.addEventListener('load', updateProgress, { once: true });
            img.addEventListener('error', updateProgress, { once: true });
          }
        } else {
          // 背景画像の場合
          const bgUrl = window.getComputedStyle(element).backgroundImage;
          const match = bgUrl.match(/url\(['"]?(.+?)['"]?\)/);

          if (match) {
            const img = new Image();
            img.src = match[1];
            img.addEventListener('load', updateProgress, { once: true });
            img.addEventListener('error', updateProgress, { once: true });
          } else {
            updateProgress();
          }
        }
      });
    });
  }

  /**
   * Webフォントの読み込み完了を待つ
   */
  private async loadFonts(): Promise<void> {
    if (!document.fonts) {
      this.fontsLoaded = true;
      return;
    }

    try {
      await document.fonts.ready;
      this.fontsLoaded = true;
    } catch (error) {
      console.warn('Font loading error:', error);
      this.fontsLoaded = true;
    }
  }

  /**
   * 最低表示時間を確保（ローディングが一瞬で消えるのを防ぐ）
   */
  private async ensureMinimumLoadingTime(): Promise<void> {
    const elapsed = performance.now() - this.startTime;
    const remaining = ModernPageLoader.MINIMUM_LOADING_TIME - elapsed;

    if (remaining > 0) {
      await new Promise((resolve) => setTimeout(resolve, remaining));
    }
  }

  /**
   * プログレスバーの更新
   */
  private updateProgressBar(progress: number): void {
    const progressBar = document.getElementById('js-progress-bar');
    if (progressBar) {
      progressBar.style.transform = `scaleX(${progress / 100})`;
    }
  }

  /**
   * ローディング完了処理
   */
  private completeLoading(delay: number): void {
    setTimeout(() => {
      // アニメーションライブラリとの協調のため、フラグを立てる
      this.root.classList.remove('page-loading');
      this.root.classList.add('page-loaded');

      if (this.loadingOverlay) {
        this.loadingOverlay.classList.add('fade-out');

        // アニメーション完了後にDOMから削除
        setTimeout(() => {
          this.loadingOverlay?.remove();
          this.initializeAnimations();
        }, 300);
      } else {
        this.initializeAnimations();
      }
    }, delay);
  }

  /**
   * GSAPなどのアニメーション初期化
   */
  private initializeAnimations(): void {
    // カスタムイベントを発火してGSAPなどに通知
    window.dispatchEvent(new CustomEvent('pageReady'));
  }

  /**
   * セッションストレージのチェック
   */
  private hasVisitedInSession(): boolean {
    try {
      return sessionStorage.getItem(ModernPageLoader.SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * セッションストレージに訪問記録
   */
  private markAsVisited(): void {
    try {
      sessionStorage.setItem(ModernPageLoader.SESSION_KEY, 'true');
    } catch {
      // sessionStorage使えない場合は無視
    }
  }
}
