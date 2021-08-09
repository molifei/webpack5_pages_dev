import './index.less';

// 引入swiper
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';

import { add } from 'lodash';

console.log('home');
console.log(add(3, 4));

let mySwiper = new Swiper('.swiper-container', {
  direction: 'horizontal', // 垂直切换选项
  loop: true, // 循环模式选项

  effect: 'fade',
  fadeEffect: {
    crossFade: true,
  },

  observer: true,

  // 如果需要分页器
  pagination: {
    el: '.swiper-pagination',
    type: 'progressbar',
    clickable: true,
  },

  // 如果需要前进后退按钮
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // 如果需要滚动条
  // scrollbar: {
  //   el: '.swiper-scrollbar',
  // },
});

document.title = 'Home';
