const Path = require('path');
const turndown = require('../src');
const config = {
  url: 'http://localhost:8080/%E4%B8%89%E8%A8%80%E4%B8%A4%E8%AF%AD%E8%AF%B4%E9%80%8F%E6%9F%AF%E9%87%8C%E5%8C%96%E5%92%8C%E5%8F%8D%E6%9F%AF%E9%87%8C%E5%8C%96.html',
  name: '柯里化和反柯里化',
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
    localhost: '#js_content',
  },
};

turndown(config);
