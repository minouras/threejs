import Swiper from 'swiper';
import { Autoplay, Pagination, EffectFlip, EffectCards, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cards';

/**
 * 1枚エフェクト：フリップ
 * */
export const setFlipSwiper = (trg: string) => {
  const targets = document.querySelectorAll<HTMLElement>(trg);
  if (targets.length <= 0) return;

  targets.forEach((target) => {
    const pager = document.createElement('div');
    pager.classList.add('text-center');
    target.insertAdjacentElement('afterend', pager);

    return new Swiper(target, {
      modules: [Pagination, EffectFlip, Autoplay],
      slidesPerView: 1,
      effect: 'flip',
      loop: true,
      speed: 600,
      pagination: {
        el: pager,
      },
      autoplay: {
        delay: 2500,
      },
    });
  });
};

/**
 * 1枚エフェクト：カード
 * */
export const setCardsSwiper = (trg: string) => {
  const targets = document.querySelectorAll<HTMLElement>(trg);
  if (targets.length <= 0) return;

  targets.forEach((target) => {
    const pager = document.createElement('div');
    pager.classList.add('text-center');
    target.insertAdjacentElement('afterend', pager);

    return new Swiper(target, {
      modules: [Pagination, EffectCards, Autoplay],
      slidesPerView: 1,
      effect: 'cards',
      loop: true,
      speed: 600,
      pagination: {
        el: pager,
      },
      autoplay: {
        delay: 2500,
      },
    });
  });
};
