var httpreq = require('httpreq');
var fs = require('fs');

const DownloadProcess = (source, dest) => new Promise((resolve, reject) => {
  console.log('Started Downloading file' + source);
  httpreq.download(
    source,
    __dirname+'/download/'+dest + '.txt'
  , function (err, progress){}, function (err, res){
    if (err) resolve('Error in Downloading file ' + err);
    resolve('Downloading file ' + source + ' Done');
  });
});

const DownloadResult = data => new Promise((resolve, reject) => {
  console.log(data);
  resolve();
});

const postDownload = (data) => new Promise((resolve, reject) => {
  console.log('download done \n');
  resolve(data);
});

const DownloadFiles = (list = [], postDownload) => {
  if (list.length === 0) {
      console.log('Nothing to Download');
      return false;
  }
  const ps = [];
  list.forEach(item => {
      ps.push(() => DownloadProcess(item.source, item.dest));
      ps.push(DownloadResult);
  });
  ps.push(postDownload);
  const p = Promise.resolve();
  ps.reduce((p, c) => p.then(c), p);
};

const DownloadClient = () => {
  const settings = JSON.parse(fs.readFileSync('./licenses.json'));
  const list =[];
  const parentList = {
    "classnames": "^2.2.5",
    "es6-map": "^0.1.4",
    "es6-promise": "^4.0.5",
    "file-saver": "^1.3.3",
    "guid": "0.0.12",
    "jquery": "^3.1.1",
    "lodash": "^4.17.4",
    "moment": "^2.14.1",
    "prop-types": "^15.6.0",
    "react": "^15.4.2",
    "react-addons-transition-group": "^15.4.2",
    "react-dom": "^15.4.2",
    "react-draggable-tab": "^0.8.1",
    "xml-writer": "^1.7.0",
    "agentkeepalive": "^3.2.0",
    "babel-cli": "^6.24.1",
    "babel-core": "^6.4.0",
    "babel-eslint": "^7.2.1",
    "babel-loader": "^6.2.1",
    "babel-preset-env": "^1.5.2",
    "babel-preset-es2015": "^6.3.13",
    "babel-preset-react": "^6.3.13",
    "babel-register": "^6.24.1",
    "css-loader": "^0.26.1",
    "eslint": "^3.19.0",
    "eslint-loader": "^1.7.1",
    "eslint-plugin-react": "^6.10.3",
    "expect.js": "^0.3.1",
    "express": "^4.15.3",
    "extract-text-webpack-plugin": "^2.0.0-rc.3",
    "file-loader": "^0.10.0",
    "gulp": "^3.9.1",
    "gulp-concat": "^2.6.1",
    "gulp-connect": "^5.0.0",
    "gulp-sourcemaps": "^2.4.1",
    "gulp-uglify": "^2.0.1",
    "gulp-util": "^3.0.8",
    "happypack": "^3.0.3",
    "html-webpack-plugin": "^2.28.0",
    "http-proxy-middleware": "^0.17.4",
    "istanbul": "^1.1.0-alpha.1",
    "jsdom": "^11.1.0",
    "jsdom-global": "^3.0.2",
    "jsdomify": "^3.1.0",
    "json-loader": "^0.5.4",
    "less": "^2.7.2",
    "less-loader": "^2.2.3",
    "mocha": "^3.3.0",
    "mocha-jsdom": "^1.1.0",
    "mocha-junit-reporter": "1.13.0",
    "numeral": "^2.0.6",
    "prettier": "1.3.1",
    "react-addons-test-utils": "^15.5.1",
    "react-hot-loader": "^1.3.0",
    "sinon": "^2.1.0",
    "style-loader": "^0.13.0",
    "webpack": "^2.4.1",
    "webpack-build-dll-plugin": "^1.3.0",
    "webpack-dev-middleware": "^1.10.2",
    "webpack-dev-server": "^2.3.0",
    "webpack-dll-bundles-plugin": "1.0.0-beta.5",
    "webpack-hot-middleware": "^2.18.0",
    "webpack-stream": "^3.2.0"
  };

  const filteredList = {};
  for(var key in settings){
    if(!parentList.hasOwnProperty(key.split('@')[0])){
      delete settings[key];
    }
  }

  for (var key in settings) {
    if (settings.hasOwnProperty(key)) {
        list.push({
          source:settings[key].licenseUrl,
          dest:`LICENCE_${key.indexOf('/') > -1 ? key.split('/')[1] : key}` 
        })
    }
  }
  DownloadFiles(list, postDownload.bind(null));
};

DownloadClient();