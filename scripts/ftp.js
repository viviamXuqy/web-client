'use strict'; // eslint-disable-line

const moment = require('moment');

const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const WebpackFtpUpload = require('webpack-ftp-upload') // eslint-disable-line

const fileDate = '' || moment().format('YYYYMMDD');

const config = {
  entry: path.join(__dirname, 'ftp.js'),
  output: {
    path: path.join(__dirname, '..'),
    filename: 'ftp_bundle.js',
  },
  plugins: [
    // Upload file to FTPServer
    new WebpackFtpUpload(path.join(__dirname, `../dist/build_${fileDate}.zip`)),
  ],
};

const uploadFile = () => {
  console.log('The file starts uploading...'); // eslint-disable-line
  const compiler = webpack(config);
  compiler.run((err, stats) => { // eslint-disable-line
    if (err) {
      return reject(err); // eslint-disable-line
    }
  });
};

uploadFile();
