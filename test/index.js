const Path = require('path');
const turndown = require('../src');
const config = {
  url: 'C:/Users/Administrator/Desktop/workspace/blog-page/讲讲我做低代码平台的建设过程，希望可以帮到正在工作的你.html',
  name: '低代码',
  // url: 'http://localhost:8080/%E5%89%8D%E7%AB%AF%E7%AE%80%E6%B4%81%E6%9E%B6%E6%9E%84.html',
  // name: '前端简洁架构',
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
