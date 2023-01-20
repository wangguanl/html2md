const FS = require('fs'),
  Path = require('path'),
  cheerio = require('cheerio'),
  TurndownService = require('turndown'),
  turndownService = new TurndownService(),
  superagent = require('superagent'),
  { to } = require('await-to-js'),
  Ut = require('./ut');
(async () => {
  const url = 'http://172.31.209.98:8080/index.html';
  const [err, page] = await to(superagent.get(url));
  if (err) {
    console.log('页面获取失败');
    return;
  }
  const { origin, host, pathname } = new URL(url);
  const $ = cheerio.load(page.text);
  const hosts = {
    'www.cnblogs.com': '#cnblogs_post_body',
  };
  const domName = hosts[host] || 'body';
  await Promise.allSettled(
    [...$(`${domName} img`)].map(element => {
      return new Promise(async (resolve, reject) => {
        const url =
          origin +
          Path.join(
            pathname[pathname.length - 1] === '/'
              ? pathname
              : pathname.slice(0, pathname.lastIndexOf('/') + 1),
            $(element).attr('src')
          ).replace(/\\/g, '/');

        const [err, path] = await to(Ut.downImg({ url }));
        if (err) {
          reject(err);
        } else {
          $(element).attr('src', path);
          resolve(path);
        }
      });
    })
  );
  $(domName).prepend($(`<a href="${url}">转载文章：${$('title').text()}</a>`));
  FS.writeFileSync('index.md', turndownService.turndown($(domName).html()));
})();
