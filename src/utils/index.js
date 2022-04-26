import EXIF from 'exif-js';
import moment from 'moment';
import { API_URL, DEFALUT_LANG } from '../constants/config';
import { drawRect, drawTxt, drawTickBackColor, drawRectBackColor } from './canvas.draw';
import { getStore } from './storage';

export const getDateRangeByType = type => {
  const now = moment();
  const range = [now, now];

  switch (type) {
    case 'week':
      return [
        new Date(range[0].startOf('isoWeek')).getTime(),
        new Date(range[1].endOf('isoWeek')).getTime(),
      ];
    case 'year':
      return [
        new Date(range[0].startOf('year')).getTime(),
        new Date(range[1].endOf('year')).getTime(),
      ];
    case 'month':
    default:
      return [
        new Date(range[0].startOf('month')).getTime(),
        new Date(range[1].endOf('month')).getTime(),
      ];
  }
};

export const toQueryString = paramsObj =>
  Object
    .keys(paramsObj)
    .filter(key => paramsObj[key])
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObj[key])}`)
    .join('&');

export const RgbToRgba = (rgb, alpha = 1) => rgb.replace(')', `, ${alpha})`).replace('rgb', 'rgba');

export const numFormat = (n, d = 0) =>
  n.toFixed(d).replace(/./g, (c, i, a) => (
    i && c !== '.' && ((a.length - i) % 3 === 0) ? `,${c}` : c
  ));

export const getImageUrl = id => `${API_URL}/image/${id}`;

/**
 * 打印
 * @param {*} msg
 * @param {undefined, info, warn, error} type
 * @param {string} instr
 */
export function consoleMe(msg, type, instr) {
  let typeTemp = type;
  if (undefined === type) {
    typeTemp = 'info';
  }
  if (!instr) instr = typeTemp; // eslint-disable-line
  switch (typeTemp) {
    case 'info': console.log(instr, msg); break; // eslint-disable-line no-console
    case 'warn': console.warn(instr, msg); break; // eslint-disable-line no-console
    case 'error': console.error(instr, msg); break; // eslint-disable-line no-console
    default: console.log(instr, msg); break; // eslint-disable-line no-console
  }
}

/**
* 显示星期几
* @param {Date} time
*/
export function showDay(time, locale = 'zh-CN') {
  let day;
  switch (locale) {
    case 'zh-CN':
      day = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
      break;
    default:
      day = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      break;
  }

  return day[time.getDay() - 1];
}

// 画car矩形
export function drawCarRect(ctx, x, y, w, h) {
  drawRect(ctx, x, y, w, h, '#3EEEFF');
}

// 画car文字
export function drawCarTxt(ctx, content, x, y, fontSize = 14) {
  drawTxt(ctx, content, x, y, 'red', fontSize);
}

// 画checkbox
export function drawCheckBox(ctx, x, y, w, h) {
  drawTickBackColor(ctx, x, y, w, h, '#0000005e', '#fff');
}

// 画白色半透明矩形
export function drawRectBackColorByWhite(ctx, x, y, w, h) {
  drawRectBackColor(ctx, x, y, w, h, '#ffffff7f');
}

/**
 * 转为unicode 编码
 * @param {string} str
 */
export function encodeUnicode(str) {
  const res = [];
  for (let i = 0; i < str.length; i++) {
    res[i] = (`00${str.charCodeAt(i).toString(16)}`).slice(-4);
  }
  return `\\u${res.join('\\u')}`;
}

/**
 * unicode 解码
 * @param {string} str
 */
export function decodeUnicode(str) {
  const strTemp = str.replace(/\\/g, '%');
  return unescape(strTemp);
}

// 时分秒（00:00:00） 转为 时间戳
export function getTimeMs(time) {
  let s = '';

  const hour = time.split(':')[0];
  const min = time.split(':')[1];
  const sec = time.split(':')[2];

  s = Number(hour * 3600) + Number(min * 60) + Number(sec);

  return s;
}

// 时间秒数格式化
export function getTime(s, format = 'HH:mm:ss') {
  let t;
  if (s > -1) {
    const hh = format.indexOf('HH') !== -1;
    if (hh) {
      const hour = Math.floor(s / 3600);
      if (hour < 10) {
        t = `0${hour}`;
      } else {
        t = `${hour}`;
      }

      const mm = format.indexOf('mm') !== -1;
      if (mm) {
        const min = Math.floor(s / 60) % 60;
        t += ':';
        if (min < 10) { t += '0'; }
        t += `${min}`;

        const ss = format.indexOf('ss') !== -1;
        if (ss) {
          t += ':';
          const sec = s % 60;
          if (sec < 10) { t += '0'; }
          t += sec.toFixed(0);
        }
      }
    }
  }
  return t;
}

export function getImgNaturalDimensions(img) {
  return new Promise(resolve => {
    let nWidth; let nHeight;
    if (img.naturalWidth) { // 现代浏览器
      nWidth = img.naturalWidth;
      nHeight = img.naturalHeight;
      resolve({ w: nWidth, h: nHeight });
    } else { // IE6/7/8
      const image = new Image();
      image.src = img.src;
      image.onload = () => {
        resolve({ w: image.width, h: image.height });
      };
    }
  });
}

export function scrollTop() {
  if (typeof document !== 'undefined') {
    const value = 0;
    document.documentElement.scrollTop = value;
    document.body.scrollTop = value;
  }
}

export const getBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file);
};

export const rotateImage = (img, orientation) => {
  const imgWidth = img.width;
  const imgHeight = img.height;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  switch (orientation) {
    case 6: // rotate 90deg
      canvas.width = imgHeight;
      canvas.height = imgWidth;
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(img, 0, -imgHeight, imgWidth, imgHeight);
      break;
    case 3: // rotate 180deg
      ctx.rotate(Math.PI);
      ctx.drawImage(img, -imgWidth, -imgHeight, imgWidth, imgHeight);
      break;
    case 8: // rotate -90deg
      canvas.width = imgHeight;
      canvas.height = imgWidth;
      ctx.rotate(3 * (Math.PI / 2));
      ctx.drawImage(img, -imgWidth, 0, imgWidth, imgHeight);
      break;
    default:
      break;
  }

  return canvas.toDataURL('image/jpeg', 0.8);
};

export const resetOrientation = (file, callback) => {
  EXIF.getData(file, () => {
    const orientation = EXIF.getTag(file, 'Orientation');

    getBase64(file, base64Image => {
      const img = new Image();

      img.addEventListener('load', () => {
        let url;

        if (orientation && orientation !== 1) {
          url = rotateImage(img, orientation);
        } else {
          url = base64Image;
        }

        callback(url);
      });

      img.src = base64Image;
    });
  });
};

export const findKey = (data, value, compare = (a, b) => a === b) =>
  Object.keys(data).find(k => compare(data[k], value));

export const getLang = () => {
  let lang = getStore('locale') || (DEFALUT_LANG || navigator.browserLanguage || navigator.language ||
    navigator.userLanguage || navigator.systemLanguage || 'zh-CN').toLowerCase();

  if (lang.indexOf('zh') > -1) {
    if (lang.indexOf('tw') > -1) {
      lang = 'zh-TW';
    }
    lang = 'zh-CN';
    document.title = 'KANKAN AI 百眼卫士';
  } else {
    lang = 'en-US';
    document.title = 'KANKAN AI Argus Guardian';
  }
  return lang;
};

export const sleep = time => new Promise(resolve => setTimeout(resolve, time));

/** compressImage, src can be dataURL or url */
export const compressImage = (src, width, data = '', preImg = null) => new Promise(resolve => {
  const img = preImg === null ? new Image() : preImg;
  img.setAttribute('crossOrigin', 'anonymous');
  img.setAttribute('data-width', width);
  img.setAttribute('data-data', data);
  img.src = src;
  img.addEventListener('load', () => {
    let w;
    let h;
    if (img.naturalWidth) {
      w = img.naturalWidth;
      h = img.naturalHeight;
    } else {
      w = img.width;
      h = img.height;
    }
    const ratio = width / w;
    const height = h * ratio;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    const imgBase64 = canvas.toDataURL('image/jpeg', ratio);
    resolve({ src: imgBase64, data: img.getAttribute('data-data') });
  });
  img.onerror = () => {
    if (!img.getAttribute('data-error') || img.getAttribute('data-error') !== 'error') {
      const timeStamp = +new Date();
      img.setAttribute('data-error', 'error');
      compressImage(`${img.currentSrc}?${timeStamp}`, img.getAttribute('data-width'), img.getAttribute('data-data'), img);
    }
  };
});
