import List from './list.js';
import throttle from './throttle';
// instead of a List, you can use querySelectorAll()
const list = new List();
const duration = 5000;
const popupTemplate = document.getElementById('popup-template');
const texts = [
  'Lorem, ipsum dolor sit amet consectetur, adipisicing elit.',
  'Voluptatum mollitia dicta ab dolorem iure similique fugiat sapiente ullam dignissimos maxime quo alias ea quasi magni magnam facilis aspernatur, asperiores temporibus. Provident quis totam, maiores recusandae ut expedita eligendi dolor sed, tempora, quo asperiores nobis, vitae error? Suscipit nihil nesciunt aliquam in, enim!',
];
let textIndx = 0;

const verticalGap = 16;

const verticalAlignPopups = () => {
  if (list.length == 0) return;

  requestAnimationFrame(() => {
    // First rAF: calculate tY 1 reflow
    list.tail.value.tY = 0;
    for (
      let node = list.tail.prev,
        prevHeight = list.tail.value.popup.getBoundingClientRect().height;
      node;
      node = node.prev
    ) {
      node.value.tY = -(
        Math.abs(node.next.value.tY) +
        prevHeight +
        verticalGap
      );
      prevHeight = node.value.popup.getBoundingClientRect().height;
    }

    // Second rAF: for paint и composite
    requestAnimationFrame(() => {
      for (let node = list.tail; node; node = node.prev) {
        node.value.popup.style.transform = `translate(0, ${node.value.tY}px)`;
      }
    });
  });
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
  const popup = popupTemplate.content.cloneNode(true).querySelector('.popup');
  popup.querySelector('.content').innerHTML = texts[textIndx++];
  const node = list.append({ popup, tY: 0 });

  popup.addEventListener('mouseenter', () => ppAnimations(false));
  popup.addEventListener('mouseleave', () => ppAnimations(true));

  let animation;

  const cleanAndAlign = () => {
    popup.remove();
    if (animation.playState == 'running') animation.cancel();
    animations.delete(animation);
    verticalAlignPopups();
  };

  const animationEndHandler = () => {
    popup.addEventListener('transitionend', cleanAndAlign);
    list.remove(node);
    animation.removeEventListener('finish', animationEndHandler);
    popup.style.transform = `translate(100%, ${node.value.tY}px)`;
  };

  popup.querySelector('.close').addEventListener('click', animationEndHandler);
  document.body.appendChild(popup);
  requestAnimationFrame(() => {
    animation = popup.querySelector('.line').animate(...moveRight);
    animations.add(animation);
    animation.addEventListener('finish', (e) => {
      if (e.target.id !== 'moveRight') return;
      animationEndHandler();
    });
    popup.style.transform = `translateX(0)`;
    verticalAlignPopups();
  });
};

const btnCreatePopup = document.getElementById('btnCreatePopup');
btnCreatePopup.addEventListener('click', createPopup);
