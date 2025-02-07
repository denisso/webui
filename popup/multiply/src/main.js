import List from './list.js';
import throttle from './throttle';
// instead of a List, you can use querySelectorAll()
const list = new List();
const duration = 5000;
const texts = [
  'Lorem, ipsum dolor sit amet consectetur, adipisicing elit.',
  'Voluptatum mollitia dicta ab dolorem iure similique fugiat sapiente ullam dignissimos maxime quo alias ea quasi magni magnam facilis aspernatur, asperiores temporibus. Provident quis totam, maiores recusandae ut expedita eligendi dolor sed, tempora, quo asperiores nobis, vitae error? Suscipit nihil nesciunt aliquam in, enim!',
];
let textIndx = 0;

const verticalGap = 16;

const verticalAlignPopups = () => {
  if (list.length == 0) return;
  let start = list.tail,
    node = start.prev;

  // cicle with 1 reflow for getBoundingClientRect
  for (
    let i = 1, prevHeight = start.value.popup.getBoundingClientRect().height;
    node;
    i++
  ) {
    node.value.tY = -(Math.abs(node.next.value.tY) + prevHeight + verticalGap);
    prevHeight = node.value.popup.getBoundingClientRect().height;
    node = node.prev;
  }
  node = list.tail.prev;
  // cicle with 1 reflow for assign new position
  for (let i = 1; node; i++) {
    node.value.popup.style.transform = `translate(0, ${node.value.tY}px)`;
    node = node.prev;
  }
};

window.addEventListener(
  'resize',
  throttle(() => verticalAlignPopups())
);

const moveRight = [
  [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }],
  {
    id: 'moveRight',
    duration,
    easing: 'linear',
    fill: 'forwards',
  },
];
const animations = new Set();
// p = true - play otherwise pause
const ppAnimations = (p) =>
  animations.forEach((a) => (p ? a.play() : a.pause()));

const createPopup = () => {
  if (textIndx == texts.length) textIndx = 0;
  const popupContent = `
  <div class="content">
  ${texts[textIndx++]}
    <div class="line-box">
      <div class="line"></div>
    </div>
    <div class="close">X</div>
  </div>
  `;

  const popup = document.createElement('div');

  popup.classList.add('popup');
  popup.insertAdjacentHTML('afterbegin', popupContent);
  popup.style.bottom = 0;
  const node = list.append({ popup, tY: 0 });
  const line = popup.querySelector('.line');
  const animation = line.animate(...moveRight);
  const animationEndHandler = (e) => {
    if (e.target.id !== 'moveRight') return;
    popup.style.transform = `translate(100%, ${node.value.tY}px)`;
    popup.addEventListener('transitionend', () => {
      popup.remove();
      list.remove(node);
      animations.delete(animation);
    });
  };
  popup.addEventListener('mouseenter', () => ppAnimations(false));
  popup.addEventListener('mouseleave', () => ppAnimations(true));
  animations.add(animation);
  animation.addEventListener('finish', animationEndHandler);

  popup.addEventListener('click', (e) => {
    if (!e.target.classList.contains('close')) return;
    animation.removeEventListener('finish', animationEndHandler);
    list.remove(node);
    popup.style.transform = `translate(100%, ${node.value.tY}px)`;
    popup.addEventListener('transitionend', () => {
      animations.delete(animation);
      animation.cancel();
      popup.remove();
      verticalAlignPopups();
    });
  });
  document.body.appendChild(popup);
  requestAnimationFrame(() => {
    popup.style.transform = `translateX(0)`;
    verticalAlignPopups();
  });
};

const btnCreatePopup = document.getElementById('btnCreatePopup');
btnCreatePopup.addEventListener('click', createPopup);
