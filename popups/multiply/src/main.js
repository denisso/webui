import List from './list.js';
import throttle from './throttle';
// instead of a List, you can use querySelectorAll()
const list = new List();
const duration = 1000000;
const texts = [
  'Lorem, ipsum dolor sit amet consectetur, adipisicing elit.',
  'Voluptatum mollitia dicta ab dolorem iure similique fugiat sapiente ullam dignissimos maxime quo alias ea quasi magni magnam facilis aspernatur, asperiores temporibus. Provident quis totam, maiores recusandae ut expedita eligendi dolor sed, tempora, quo asperiores nobis, vitae error? Suscipit nihil nesciunt aliquam in, enim!',
];
let textIndx = 0;

const verticalGap = 16;

const updatePopups = (node = list.tail.prev) => {
  if (list.length == 0) return;
  if (list.length == 1) {
    list.tail.value.style.buttom = 0;
    return;
  }
  // cicle with 1 reflow for getBoundingClientRect
  const bottoms = new Array(list.length).fill(0);

  for (
    let i = 1, prevHeight = list.tail.value.getBoundingClientRect().height;
    node;
    i++
  ) {
    bottoms[i] = bottoms[i - 1] + prevHeight + verticalGap;
    prevHeight = node.value.getBoundingClientRect().height;
    node = node.prev;
  }
  node = list.tail.prev;
  // cicle with 1 reflow for assign new position
  for (let i = 1; node; i++) {
    node.value.style.bottom = bottoms[i] + 'px';
    node = node.prev;
  }
};
window.addEventListener(
  'resize',
  throttle(() => updatePopups)
);

const moveLeft = [
  [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }],
  {
    duration,
    easing: 'linear',
    fill: 'forwards',
  },
];

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
  const node = list.append(popup);
  const animationEndHandler = () => {
    popup.remove();
    q.dequeue();
    list.remove(node);
  };
  const line = popup.querySelector('.line');
  line.animate(...moveLeft);
  popup.addEventListener('animationend', animationEndHandler);
  popup.addEventListener('click', (e) => {
    if (!e.target.classList.contains('close')) return;
    popup.removeEventListener('animationend', animationEndHandler);
    list.remove(node);
    popup.remove();
    if (!node.next) {
      updatePopups(node.prev);
    } else {
      updatePopups(node.next);
    }
  });

  document.body.appendChild(popup);
  updatePopups();
};

const btnCreatePopup = document.getElementById('btnCreatePopup');
btnCreatePopup.addEventListener('click', createPopup);
