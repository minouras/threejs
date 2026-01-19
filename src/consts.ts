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
    name: '背景表現',
    href: 'background',
    content: [
      {
        id: 'gradation-anime',
        labels: ['グラデーション', 'グラデーションアニメ'],
      },
      {
        id: 'rising-anime',
        labels: ['上昇アニメ', 'svgアニメ', '縦に無限ループ'],
      },
      {
        id: 'triangle-dot',
        labels: ['三角形のドット', 'クロスドット'],
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
