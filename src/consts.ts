/* TODO: サイト基本情報を入力*/
/*サイトタイトル*/
export const SITE_TITLE = 'UI / UX カタログ';

/*サイトディスクリプション*/
export const SITE_DESC =
  'Astroテンプレートで使う為のUI / UX カタログ。今まで実装してきたもののログも兼ねて。';

/*ページインデックス*/
export const PAGE_INDEX = [
  {
    name: 'テキスト',
    href: 'text',
  },
  {
    name: 'ボタン',
    href: 'button',
  },
  {
    name: 'コンテンツ',
    href: 'contents',
  },
  {
    name: '背景表現',
    href: 'background',
    content: [
      {
        id: 'gradation-anime',
        label: 'グラデーションアニメ',
      },
      {
        id: 'rising-anime',
        label: '上昇アニメ',
      },
      {
        id: 'particle',
        label: 'パーティクル',
      },
      {
        id: 'triangle-dot',
        label: '三角形のクロスドット',
      },
    ],
  },
  {
    name: 'スライド',
    href: '#slide',
  },
  {
    name: 'svgアニメ',
    href: 'svg',
  },
];

/** コンテンツ キーワード */
export const KEYWORDS = [];
