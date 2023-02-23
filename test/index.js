const Path = require('path');
const turndown = require('../src');
const config = {
  url: 'https://blog.csdn.net/weixin_44935956/article/details/126317933',
  name: 'nvm-windows安装和配置',
  // url: 'http://localhost:8080',
  // name: 'index',
  output: Path.resolve(process.cwd(), 'dist'),
  hosts: {
    'www.cnblogs.com': '#cnblogs_post_body',
    'blog.csdn.net': '#content_views',
    'www.bilibili.com': '.article-container__content',
    'juejin.cn': '.markdown-body',
    'mp.weixin.qq.com': '#js_content > .js_darkmode__0',
    'mp.weixin.qq.com': '#js_content',
    // '172.31.209.98': '#js_content > .js_darkmode__0',
    // localhost: '#js_content > .js_darkmode__0',
  },
};

turndown(config);
