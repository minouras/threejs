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
    contents: [{ id: 'neon', label: 'ネオン看板風' }],
  },
  {
    name: 'ボタン',
    href: 'button',
  },
  {
    name: 'コンテンツ',
    href: 'contents',
    contents: [{ id: 'neon', label: 'ネオン看板風' }],
  },
  {
    name: '背景表現',
    href: 'background',
    contents: [
      {
        id: 'gradation-anime',
        label: 'グラデーションアニメ',
      },
      {
        id: 'rising-anime',
        label: '上昇アニメ',
      },
      {
        id: 'loop-h',
        label: '横に流れる背景',
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
    href: 'slide',
    contents: [{ id: 'swiper-effect', label: 'Swiperエフェクト' }],
  },
  {
    name: 'svgアニメ',
    href: 'svg',
  },
];

/** コンテンツ キーワード */
export const KEYWORDS = [];
