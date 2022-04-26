import { MD5 } from '../src/utils/md5';

const fs = require('fs');
const util = require('util');
const qs = require('querystring');
const rp = require('request-promise'); // eslint-disable-line

const MESSAGES_PATH = 'translate/messages';
const LANG_DIR = 'src/locales/json';
const MESSAGES_PATH_ZH = 'translate/messages/zh-CN';
const MESSAGES_PATH_EN = 'translate/messages/en-US';
const WEB_PATH = 'translate/web翻译.txt';

const isHiddenPath = path => (/(^|\/)\.[^/.]/g).test(path);

const msgWrite = async () => {
  const msgFiles = fs.readdirSync(MESSAGES_PATH).filter(file => !isHiddenPath(file));
  const writeFile = util.promisify(fs.writeFile);

  const appid = '20181128000240664';
  const appkey = '7HolsmGbMk9Vj0y8vvqJ';
  const salt = (new Date()).getTime();
  const from = 'zh';
  const to = 'en';

  const getMsg = file => fs.readFileSync(file).toString()
    .split('\n')
    .map(row => ({
      [row.split('=')[0]]: row.split('=')[1],
    }))
    .reduce((obj, m) => ({
      ...obj,
      ...m,
    }), {});

  if (fs.existsSync(LANG_DIR)) {
    const jsonFiles = fs.readdirSync(LANG_DIR).filter(file => !isHiddenPath(file));
    jsonFiles.forEach(file => {
      const path = `${LANG_DIR}/${file}`;

      fs.unlinkSync(path);
    });
  } else {
    fs.mkdirSync(LANG_DIR);
  }

  const messagesZh = JSON.parse(JSON.stringify(getMsg(MESSAGES_PATH_ZH), null, 2));
  const messagesWebEn = JSON.parse(JSON.stringify(getMsg(MESSAGES_PATH_EN), null, 2));

  const messagesVals = [...new Set(Object.values(messagesZh))];
  if (fs.existsSync(WEB_PATH)) { fs.unlinkSync(WEB_PATH); }
  writeFile(WEB_PATH, messagesVals.join('\n'))
    .then(() => {
      console.log('Generate the web翻译.txt file'); // eslint-disable-line no-console
    });

  /* eslint-disable no-restricted-syntax,no-await-in-loop */
  for (const v of messagesVals) {
    const vEn = messagesWebEn[v];
    if (!vEn) {
      const str1 = appid + v + salt + appkey;
      const sign = MD5(str1);
      const data = {
        q: v,
        appid,
        salt,
        from,
        to,
        sign,
      };
      let val = 'undefined';
      const chunk = await rp.get(`http://api.fanyi.baidu.com/api/trans/vip/translate?${qs.stringify(data)}`);
      if (chunk) {
        try {
          const { trans_result: transResult } = JSON.parse(chunk);
          if (transResult && transResult instanceof Array && transResult.length > 0) {
            const [{ dst }] = transResult;
            val = dst;
          }
        } catch (error) {
          console.log('rq error', error); // eslint-disable-line
        }
      }
      messagesWebEn[v] = val;
    }
  }

  if (fs.existsSync(MESSAGES_PATH_EN)) { fs.unlinkSync(MESSAGES_PATH_EN); }
  const messagesWebEnTemp = Object.entries(messagesWebEn).reduce((arr, [key, value]) => {
    const t = `${key}=${value}`;
    arr.push(t);

    return arr;
  }, []);
  writeFile(MESSAGES_PATH_EN, messagesWebEnTemp.join('\n'))
    .then(() => {
      console.log('Generate the en-US file'); // eslint-disable-line no-console
    });

  const messagesEn = Object.entries(messagesZh).reduce((obj, [key, value]) => {
    const val = messagesWebEn[value] || value;
    const data = {
      ...obj,
      [key]: val,
    };
    return data;
  }, {});

  msgFiles.forEach(file => {
    const fileName = file.split('.')[0];
    const messages = file === 'zh-CN' ? messagesZh : messagesEn;
    writeFile(`${LANG_DIR}/${fileName}.json`, JSON.stringify(messages, null, 2))
      .then(() => {
        console.log(`Generate the ${fileName}.json file`); // eslint-disable-line no-console
      });
  });
};

msgWrite();

if (process.env.NODE_ENV === 'development') {
  fs.watchFile(MESSAGES_PATH_ZH, () => {
    msgWrite();
  });
}
