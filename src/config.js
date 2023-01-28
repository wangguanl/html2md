const Path = require('path');
module.exports = {
  url: 'http://172.31.209.98:8080/index.html',
  name: 'index',
  output: Path.resolve(process.cwd(), 'dist'),
  hosts: {
    'www.cnblogs.com': '#cnblogs_post_body',
    'www.bilibili.com': '.article-container__content',
    'juejin.cn': '.markdown-body',
    'mp.weixin.qq.com': '#js_content',
    '172.31.209.98': '#js_content > .js_darkmode__0',
    localhost: '#js_content',
  },
};
