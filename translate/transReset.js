const fs = require('fs');
const util = require('util');

const MESSAGES_PATH = 'translate/messages';
const path = 'translate/web翻译.txt';

const msgWrite = () => {
  const getMsg = file => fs.readFileSync(file).toString()
    .split('\n')
    .map(row => ({
      [row.split('=')[0]]: row.split('=')[1],
    }))
    .reduce((obj, m) => ({
      ...obj,
      ...m,
    }), {});

  if (fs.existsSync(path)) { fs.unlinkSync(path); }

  const messages = JSON.parse(JSON.stringify(getMsg(`${MESSAGES_PATH}/zh-CN`), null, 2));

  const messagesVals = [...new Set(Object.values(messages))].join('\n');

  const writeFile = util.promisify(fs.writeFile);
  writeFile(path, messagesVals)
    .then(() => {
      console.log('Generate the web翻译 file'); // eslint-disable-line no-console
    });
};

msgWrite();
