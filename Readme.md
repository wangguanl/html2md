# 将 HTML 页面转为 markdown

## 操作步骤
1. 打开 `src/config.js` 文件，将文件中的 `url` 替换成页面链接，并在 `hosts` 中配置要捕获的页面元素（默认是整个页面）
```bash
yarn
```
```bash
yarn build
```

会生成 `dist` 文件夹， `dist/index.md` `dist/images/*.jpg`
