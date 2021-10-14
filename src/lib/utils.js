import { Howl } from 'howler';

const cardFlip1Sound = new Howl({ src: ['https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/cardFlip1.mp3'], volume: 0.5 });
const cardFlip2Sound = new Howl({ src: [`https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/cardFlip2.mp3`], volume: 0.5 });
const effect1Sound = new Howl({ src: [`https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/effect1.mp3`], volume: 0.5 });
const effect2Sound = new Howl({ src: [`https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/effect2.mp3`], volume: 0.5 });
const effect3Sound = new Howl({ src: [`https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/effect3.mp3`], volume: 0.5 });
const effect4Sound = new Howl({ src: [`https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/effect4.mp3`], volume: 0.5 });
const effect5Sound = new Howl({ src: [`https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/effect5.mp3`], volume: 0.5 });
const effect6Sound = new Howl({ src: [`https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/effect6.mp3`], volume: 0.5 });
const effect7Sound = new Howl({ src: [`https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/effect7.mp3`], volume: 0.5 });
const effect8Sound = new Howl({ src: [`https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/effect8.mp3`], volume: 0.5 });
const viewverInSound = new Howl({ src: [`https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/viewerIn.mp3`], volume: 0.5 });
const viewverOutSound = new Howl({ src: [`https://memoslive-assets.s3-ap-southeast-1.amazonaws.com/viewerOut.mp3`], volume: 0.5 });

export async function playSound(id) {
  if (id === 'cardFlip1') cardFlip1Sound.play();
  if (id === 'cardFlip2') cardFlip2Sound.play();
  if (id === 'effect1') effect1Sound.play();
  if (id === 'effect2') effect2Sound.play();
  if (id === 'effect3') effect3Sound.play();
  if (id === 'effect4') effect4Sound.play();
  if (id === 'effect5') effect5Sound.play();
  if (id === 'effect6') effect6Sound.play();
  if (id === 'effect7') effect7Sound.play();
  if (id === 'effect8') effect8Sound.play();
  if (id === 'viewerIn') viewverInSound.play();
  if (id === 'viewerOut') viewverOutSound.play();
}

export function copyToClipboard(addr, domElForFeedback) {
  const el = document.createElement('textarea');
  el.value = addr;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  console.log(domElForFeedback);
  domElForFeedback.current.classList.add('run-feedback');
  setTimeout(() => domElForFeedback.current.classList.remove('run-feedback'), 800);
}

export async function getContentByUrl(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(xhr.responseText);
      }
    }
    xhr.open('GET', url);
    xhr.send();
  })
}

export async function postContent({ url, data }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve(xhr.responseText);
      }
    }
    xhr.open('POST', url);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
  })
}

export function randomInteger(min, max) {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  return Math.round(rand);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getSpecsFromHash(hash) {
  const filtered =  hash?.split('').filter(i => /[0-9]/gi.test(i));
  return filtered?.join('').substr(0, 4);
}

export function debounce(f, ms) {
  let isCooldown = false;
  return function() {
    if (isCooldown) return;
    f.apply(this, arguments);
    isCooldown = true;
    setTimeout(() => isCooldown = false, ms);
  };
}

export function toggleTheme() {
  const isDarkTheme = localStorage.getItem('isDarkTheme');
  if (isDarkTheme) {
    document.body.classList.remove('dark');
    localStorage.removeItem('isDarkTheme');
  }
  if (!isDarkTheme) {
    document.body.classList.add('dark');
    localStorage.setItem('isDarkTheme', true);
  }
}

export function applyTheme() {
  const isDarkTheme = localStorage.getItem('isDarkTheme');
  document.body.classList[isDarkTheme ? 'add' : 'remove']('dark');
}