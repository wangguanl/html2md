const Path = require('path'),
  cheerio = require('cheerio'),
  // TurndownService = require('turndown'), // 无法转换 table 元素
  // turndownService = new TurndownService(),
  superagent = require('superagent'),
  { to } = require('await-to-js'),
  {
    writeFileAsync,
    statAsync,
    mkdirAsync,
    rmDirFile,
  } = require('./utils/node-utils'),
  downImg = require('./utils/down-img'),
  html2md = require('./utils/html2md'),
  config = require('./config');

(async () => {
  const output = Path.resolve(config.output, config.name);
  // 检查输出目录是否存在
  const [statOutputErr] = await to(statAsync(output));
  // 如果存在则清空目录
  if (!statOutputErr) {
    await to(rmDirFile(output));
  }
  // 创建输出目录
  await mkdirAsync(output);

  const [err, page] = await to(superagent.get(config.url));
  if (err) {
    console.log('页面获取失败');
    console.log(err);
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
    [...$(`${domName} img`)].map(
      element =>
        new Promise(async (resolve, reject) => {
          const src =
            $(element).attr('src') || $(element).attr('data-src') || '';
          let url = src;
          // 不是以http开头，而是使用的相对路径
          if (!/(http|https):\/\/([\w.]+\/?)\S*/.test(src)) {
            url = origin + Path.join(pathUrl, src).replace(/\\/g, '/');
          }
          const [err, path] = await to(
            downImg(
              { url },
              {
                output: Path.resolve(output, 'images'),
              }
            )
          );
          if (err) {
            reject(err);
          } else {
            $(element).attr('src', path.replace(output, '.'));
            $(element).attr('data-src', path.replace(output, '.'));
            resolve();
          }
        })
    )
  );
  $(domName).prepend(
    $(`<a href="${config.url}">转载文章：${$('title').text()}</a>`)
  );
  await to(
    writeFileAsync(
      output + '/' + config.name + '.md',
      html2md($(domName).html())
      // turndownService.turndown($(domName).html())
    )
  );
})();
