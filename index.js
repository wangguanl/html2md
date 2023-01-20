const FS = require('fs'),
  Path = require('path'),
  cheerio = require('cheerio'),
  TurndownService = require('turndown'),
  turndownService = new TurndownService(),
  superagent = require('superagent'),
  { to } = require('await-to-js'),
  Ut = require('./ut'),
  config = require('./config');

(async () => {
  const [err, page] = await to(superagent.get(config.url));
  if (err) {
    console.log('页面获取失败');
    return;
  }
  const { origin, hostname, pathname } = new URL(config.url);
  const $ = cheerio.load(page.text);
  const domName = config.hosts[hostname] || 'body';

  const pathUrl =
    pathname[pathname.length - 1] === '/'
      ? pathname
      : pathname.slice(0, pathname.lastIndexOf('/') + 1);

  await Promise.allSettled(
    [...$(`${domName} img`)].map(element => {
      return new Promise(async (resolve, reject) => {
        const url =
          origin +
          Path.join(
            pathUrl,
            $(element).attr('src') || $(element).attr('data-src') || ''
          ).replace(/\\/g, '/');
        const [err, path] = await to(
          Ut.downImg(
            { url },
            {
              prefix: config.name,
            }
          )
        );
        if (err) {
          reject(err);
        } else {
          $(element).attr('src', path);
          resolve(path);
        }
      });
    })
  );
  $(domName).prepend(
    $(`<a href="${config.url}">转载文章：${$('title').text()}</a>`)
  );
  FS.writeFileSync(
    config.name + '.md',
    turndownService.turndown($(domName).html())
  );
})();
