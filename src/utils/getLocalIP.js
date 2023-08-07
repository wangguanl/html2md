module.exports = function getLocalIP() {
  const os = require('os');
  const iFaces = os.networkInterfaces(); //网络信息
  let localIp = '';
  for (let dev in iFaces) {
    if (dev === '本地连接' || dev === 'WLAN' || dev === '以太网') {
      for (let j = 0; j < iFaces[dev].length; j++) {
        if (iFaces[dev][j].family === 'IPv4') {
          localIp = iFaces[dev][j].address;
          break;
        }
      }
    }
  }
  return localIp;
};
