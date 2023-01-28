const Path = require('path');
module.exports = {
  url: 'https://mp.weixin.qq.com/s/1NabLOqxOjYJSG4M_z8HmQ',
  name: '什么是向上管理',
  // url: 'http://localhost:8080',
  // name: 'index',
  output: Path.resolve(process.cwd(), 'dist'),
  hosts: {
    'www.cnblogs.com': '#cnblogs_post_body',
    'www.bilibili.com': '.article-container__content',
    'juejin.cn': '.markdown-body',
    'mp.weixin.qq.com': '#js_content > .js_darkmode__0',
    'mp.weixin.qq.com': '#js_content',
    // '172.31.209.98': '#js_content > .js_darkmode__0',
    // localhost: '#js_content > .js_darkmode__0',
  },
};
