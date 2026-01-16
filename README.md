# 概要

Astroテンプレで利用できるUIカタログ

## コア

```
Astro
tailwindCSS
TypeScript
```

## 導入したいもの

```
three.js（3D表現）
swiper （スライダー）
gsap (アニメーション)
```

# 構成

```
.
├── public/             # ビルドによって加工されないアセット
├── src/                # メインのソースコード
│   ├── components/     # Astroコンポーネント
│   ├── content/        # Astroのコンテンツコレクション
│   ├── layouts/        # ページの構造を規定するAstroコンポーネント
│   ├── pages/          # ページと対応するAstroコンポーネント
│   ├── scripts/        # クライアントサイドで利用されるスクリプト
│   └── styles/         # Tailwind CSSで読み込まれるCSSファイル
├── astro.config.ts     # Astroの設定
├── package.json        # 依存パッケージを管理するための設定
├── tailwind.config.cjs # Tailwind CSSの設定
└── tsconfig.json       # TypeScriptの設定
```

詳しくは、Astro公式ドキュメントの「[Project Structure](https://docs.astro.build/en/core-concepts/project-structure/)」も参照してください。

## scriptの各モジュール説明

loading

```bash
ローディング画面実装。
imagesloadedで画像の読み込みを検知。現在読み込んでいる画像/全ての画像でプログレスバーを表現。
```

headerScroll

```bash
スクロールが発生する度に現在のスクロール方向を検知しhtmlにクラス付与する。
Headerのスクロール連動動作で使用。Headerが固定なら削除してOK。
ヘッダー: id="js-header"
ヘッダー固定させたい位置: id="js-header-trg"
```

SetGnav

```bash
開閉式メニューの動作。
ハンバーガーボタン: id="js-gnav-trg"
開閉ナビエリア: id="js-gnav"
エリア内のアイテム(クリックでナビを閉じる): id="js-gnav_item"
```

inviewScroll

```bash
html要素のスクロール検知。
class="js-inview"の要素を検知し、表示領域に入ったらclass="in-view"を付与
```

matchHeith

```bash
第一引数に指定したクラスを持つ要素を全て取得し、一番高い要素に高さを合わせる関数。
PC幅の時だけ指定したい場合は、ビューポート幅if文の中に入れる
```

letterAnimation

```bash
テキストに一文字ずつ変化を付けたい時に使用。
第一引数に指定したクラスを持つ要素内のテキストが<span class="letter">で区切られる。
要素が表示領域に入ると、spanタグに時間差で class="letter-inview" が付与される。
```

## プラグイン

```bash
imagesloaded
@types/imagesloaded : loading.tsで使用(画像チラつき防止)
```

# sdenv

次のツールを採用しています:

- [Astro](https://astro.build/): ウェブサイト構築のためのフレームワーク
- [Tailwind CSS](https://tailwindcss.com/): ユーティリティファーストCSSフレームワーク
- ~~[Alpine.js](https://alpinejs.dev/): HTML上に直接振る舞いを記述できるJavaScriptフレームワーク~~

sdenvを利用する際には、これらのツールの使い方を理解している必要があります。理解が不十分な点があれば、それぞれの公式ドキュメントなどを参照してください。

加えて、これらのツールを快適に使用できるように、[ESLint](https://eslint.org/)、[Prettier](https://prettier.io/)、[VSCode](https://code.visualstudio.com/)の設定が組み込まれています。

## 開発用コマンド

依存パッケージのインストール:

```bash
npm ci
```

ローカルサーバーの起動:

```bash
npm run dev

'npm run dev:astro -- --host'
#ネットワークを使用する時(スマホ共有したい時等)
```

本番用ビルド:

```bash
npm run build
```

自動テスト:

```bash
npm test
```

ソースコードの静的検証:

```bash
npm run lint
```

ソースコードの静的検証および自動修正:

```bash
npm run lint:fix
```
