const Path = require('path'),
  cheerio = require('cheerio'),
  TurndownService = require('turndown'), // 无法转换 table 元素
  turndownService = new TurndownService(),
  superagent = require('superagent'),
  { to } = require('await-to-js'),
  {
    writeFileAsync,
    statAsync,
    mkdirAsync,
    rmDirFile,
    readFileAsync,
  } = require('./utils/node-utils'),
  downImg = require('./utils/down-img'),
  html2md = require('./utils/html2md'),
  { unique } = require('wgl-utils/main.cjs');

module.exports = async config => {
  const output = Path.resolve(config.output, config.name);
  // 检查输出目录是否存在
  const [statConfigOutputErr] = await to(statAsync(config.output));
  // 如果不存在则创建
  if (statConfigOutputErr) {
    await to(mkdirAsync(config.output));
  }
  // 检查输出目录是否存在
  const [statOutputErr] = await to(statAsync(output));
  // 如果存在则清空目录
  if (!statOutputErr) {
    await to(rmDirFile(output));
  }
  // 创建输出目录
  await to(mkdirAsync(output));

  let $,
    origin,
    hostname,
    pathname,
    pathUrl = '/';
  if (/^(http|https):/.test(config.url)) {
    const [err, page] = await to(superagent.get(config.url));
    if (!err) {
      $ = cheerio.load(page.text);
      const urlObj = new URL(config.url);
      origin = urlObj.origin;
      hostname = urlObj.hostname;
      pathname = urlObj.pathname;
      pathUrl =
        pathname[pathname.length - 1] === '/'
          ? pathname
          : pathname.slice(0, pathname.lastIndexOf('/') + 1);
      $(domName).prepend(
        $(`<a href="${config.url}">转载文章：${$('title').text()}</a><br />`)
      );
    } else {
      console.log('页面获取失败');
      console.log(err);
    }
  } else {
    const [err, data] = await to(readFileAsync(config.url));
    if (!err) {
      $ = cheerio.load(data.toString());
      origin = Path.dirname(config.url);
      hostname = 'localhost';
    } else {
      console.log('页面获取失败');
      console.log(err);
    }
  }
  const domName = config.hosts[hostname] || 'body';
  await Promise.allSettled(
    [...$(`${domName} img`)].map(
      element =>
        new Promise(async (resolve, reject) => {
          let url = $(element).attr('src') || $(element).attr('data-src') || '';
          // /(http|https):\/\/([\w.]+\/?)\S*/.
          // 是使用的相对路径
          if (!/^(http|https|data|blob):/.test(url)) {
            url = origin + Path.join(pathUrl, url).replace(/\\/g, '/');
          }
          const filename = unique() + '.png', // 图片名称
            fileOutput = Path.resolve(output, 'images'), // 图片存储路径
            path = Path.resolve(fileOutput, filename); // 图片完整路径
          // 检查输出目录是否存在
          const [statOutputErr] = await to(statAsync(fileOutput));
          statOutputErr && (await to(mkdirAsync(fileOutput)));

          if (/^(http|https):\/\//.test(url)) {
            const [err] = await to(
              downImg(
                { url: encodeURI(url) },
                {
                  output: Path.resolve(output, 'images'),
                  filename,
                }
              )
            );
            if (err) {
              reject(err);
            }
            // 不处理data或blob数据，本地图片
          } else if (!/^(data|blob):/.test(url)) {
            const [err, data] = await to(readFileAsync(url));
            if (!err) {
              const [writeErr] = await to(writeFileAsync(path, data));
              if (writeErr) {
                console.log('写入文件失败', writeErr);
                reject(writeErr);
              }
            } else {
              console.log('读取文件失败', err);
              reject(err);
            }
          }
          $(element).attr('src', path.replace(output, '.'));
          $(element).attr('data-src', path.replace(output, '.'));
          resolve();
        })
    )
  );

  await to(
    writeFileAsync(
      output + '/index.md',
      // html2md($(domName).html())
      turndownService.turndown($(domName).html())
    )
  );
};
