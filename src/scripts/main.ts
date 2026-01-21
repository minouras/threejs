import { headerScroll } from './components/headerScroll';
import { inviewScroll } from './components/inviewScroll';
import { Loading } from './components/loading';
import { AdaptivePageLoader } from './components/loadingNew';
import { SetGnav } from './components/setGnav';
import { SmoothScroll } from './components/SmoothScroll';
// 任意のモジュール
import { initParticles } from './components/particle';
import { setFlipSwiper, setCardsSwiper } from './components/Swiper';

// loading.ts
document.addEventListener('DOMContentLoaded', () => {
  // new Loading();
  new AdaptivePageLoader();
  new SetGnav();
  new headerScroll();
  // ※注意事項を読むこと
  SmoothScroll.init();
  inviewScroll();

  /** ************************
   * パーティクルが浮遊する背景
   * ************************ */
  initParticles();

  /** ************************
   * スライダー
   * ************************ */
  setFlipSwiper('.js-flipSwiper');
  setCardsSwiper('.js-cardSwiper');
});
