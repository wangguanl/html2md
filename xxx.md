[转载文章：『B站API学习』不使用插件下载B站视频 - 哔哩哔哩](http://localhost:8080/index.html)

『B站API学习』不使用插件下载B站视频
====================

2020-06-14 10:005439阅读 · 75喜欢 · 40评论

[

![](./images/xxx-files-6578dd3a5e75ba6f72e9bcb1e6986991c4b22c3a.jpg@96w_96h_1c_1s.webp)

![](./images/xxx-files-2c40fe802d1935d96e4fc63ec42274d8846a34b7.png@144w_144h.webp)



](https://space.bilibili.com/36046577)

[ZHY2020](https://space.bilibili.com/36046577)

![](./images/xxx-files-275b468b043ec246737ab8580a2075bee0b1263b.png)

见习偶像

所有自制视频总播放数>=10万

普通勋章

[查看全部>>](https://account.bilibili.com/site/nameplate.html)

粉丝：9805文章：29

关注

**声明：仅作技术交流，严禁用于盗视频**

![](./images/xxx-files-02db465212d3c374a43c60fa2625cc1caeaab796.png@progressive.webp)

前言
==

前几天，发了个演示不用插件只用浏览器和aria2c下载器下载视频的视频。

[

03:29

如何下载B站4K视频 不使用插件助手 不包会

1.4万 32

视频 ZHY2020









](https://www.bilibili.com/video/BV17p4y1D7dA)

发这个纯粹是装个B，之所以标题里写着不包会，是因为我自己知道这个方法是有bug的。关键是[https://api.bilibili.com/x/player/playurl](https://api.bilibili.com/x/player/playurl)这个接口的可被条抓取件。

![](./images/xxx-files-6929b2810a5ef40dd385c07344323afb0f1526f0.png@731w_219h_progressive.webp)

但是它是可以输入地址调用，大会员不是必须条件，不登录帐号也是可以。

在浏览器的地址栏直接输入：

![](./images/xxx-files-8bdff9162e4734fbe781bdaf091270f59cce1fbc.png@759w_140h_progressive.webp)

不换行（专栏系统会莫名其妙加分号，所以图片）

也可以获取到视频的下载链接信息。

“？”后面是请求的各种参数，并以“&”分割，下面来解释下如何手动构造这个请求URL。

![](./images/xxx-files-02db465212d3c374a43c60fa2625cc1caeaab796.png@progressive.webp)

下载视频分几步？
========

在我看来这个过程有以下的步骤：（已知BV号或av的情况下）

1.  通过BV号或者av号获取稿件的P数，以及每P视频的cid
    
2.  通过BV号或者av号加上画质参数（qn）来组合playurl接口的参数，来获取视频的下载地址。
    
3.  将下载地址导入下载器，添加referer请求标头，下载。
    

CID是个啥？咋获取？
===========

av号和bv号我们都很熟悉，但它们是稿件的唯一编号。

一个视频稿件可能不会只有一个视频（多P），你只告诉服务器av号或bv号，服务器其实并不知道你要获取哪个视频。于是就需要另一种编号来指定视频，这就是cid。

cid不会在正常访问时查看到，于是也需要调用特定接口来获取。

[https://api.bilibili.com/x/web-interface/view](https://api.bilibili.com/x/web-interface/view)

这个接口使用很简单，只有一个参数：aid（av号）或bvid（BV号）二选一。

![](./images/xxx-files-aa988f8f2d83106e03d394eadd6f64c87250daea.png@663w_203h_progressive.webp)

范例（bv号要包含BV）

其返回的json数据（使用开发者模式查看）

![](./images/xxx-files-fd07cbeb5f08a178a23510802db58bd717ce1de6.png@942w_609h_progressive.webp)

示例

从中你可以看到该稿件的很多信息：BV号av号（可以用作两者在线互转）、UP主、封面图……

pages中存有稿件每一个P的信息，cid就保存在这里，择其一。

![](./images/xxx-files-4adb9255ada5b97061e610b682b8636764fe50ed.png@progressive.webp)

构建playurl接口请求
=============

好了现在就有了能够指定视频的两个最重要的参数了

![](./images/xxx-files-af22858d30c4a783b78f8db6bbb61cae8b2a1807.png@201w_86h_progressive.webp)

这个时候你可以直接在接口地址后跟上两个参数。

![](./images/xxx-files-2eab010b65078c8c35b3abae3072e343c1a5eaf3.png@578w_89h_progressive.webp)

这里av号对应avid，bv号对应bvid

返回数据：

![](./images/xxx-files-15f2dce40d129d849c13c7188ea74f122f0708d0.png@942w_644h_progressive.webp)

durl-url里的链接就是视频下载链接了，这里由于其他参数缺省，获取到的是flv封装的720p视频地址，包含音视频。

如果要其他画质呢？那就是qn参数所确定的事了。

加上qn参数：

![](./images/xxx-files-737a2949c4b1bbafc4d3be0f595bb1d89aeea2c0.png@741w_89h_progressive.webp)

之前的没高画质，换个视频举例

![](./images/xxx-files-3da1d6564684f3dd3729a213b929aeb0caa984d5.png@272w_296h_progressive.webp)

qn参数值对应表

返回同上，参数设定你会获取到1080p+画质的flv视频，如果视频没有对应画质选项，那么它会在大会员画质中选择对应数值小于112且最大的，比如一个60帧视频，qn=112，返回720p60。

当然这个请求会依赖于cookie，也就是它需要验证浏览器登录的帐号是否有大会员，没有则只会返回1080p画质。如果没有登录，则只有480p（也就是无账号游客可观看的最高画质）。

（所以说白嫖是不可能的啦……）

如果想要4K画质的视频，按上面的方法（qn取120）是无法获取的，这时候需添加参数fourk=1。

![](./images/xxx-files-61c36766e54090820a17271b17bf50980d3b9346.png@750w_131h_progressive.webp)

qn也要取120

这时候获取到的是4K分辨率的flv视频。

![](./images/xxx-files-4adb9255ada5b97061e610b682b8636764fe50ed.png@progressive.webp)

下载视频
====

通过以上的一通操作，我们现在已经有了视频的下载链接。

![](./images/xxx-files-3257f2eaefb15acf86363b383b39a9c687a3bd05.png@746w_602h_progressive.webp)

链接有时效

这时候，直接用浏览器访问该链接会报403。

这是因为缺少请求referer标头。referer内容是啥？从抓播放视频时浏览器的请求记录可知它就是播放页的地址。（av号也可以）

[https://www.bilibili.com/video/BV17p4y1D7dA](https://www.bilibili.com/video/BV17p4y1D7dA)

多P稿件需指定P的标号：（[BV1Yv411z7q3](https://www.bilibili.com/video/BV1Yv411z7q3?p=2) 的2P）

[https://www.bilibili.com/video/BV1Yv411z7q3?p=2](https://www.bilibili.com/video/BV1Yv411z7q3?p=2)

下载工具我使用aria2c，这是一个命令行（本体无图形界面）的开源多协议多线程下载器。功能类似IDM，但还支持种子以及磁链的下载。使用它一是因为我还算比较熟悉使用，二是它可以在添加下载任务时手动加入标头。

aria2c下载：https://github.com/aria2/aria2/releases

![](./images/xxx-files-5f4fb1916cdd6f39a3dd99aa142dea3431df4007.png@942w_182h_progressive.webp)

aria2c命令 （aria2c已加入Windows环境变量，示例下载位置为“C:\\User\\ZHY”）

下载即可得到flv视频，包含音视频。

![](./images/xxx-files-4adb9255ada5b97061e610b682b8636764fe50ed.png@progressive.webp)

进阶篇
===

**下载dash源以及H265视频**

最开始从浏览器抓下来的接口调用的参数好像不止以上的bvid（或avid）、cid、qn、fourk，之前的视频中我是音视频分开下载再后期合并。

![](./images/xxx-files-8bdff9162e4734fbe781bdaf091270f59cce1fbc.png@759w_140h_progressive.webp)

其实这些参数中有些是不必要手动输入（对于达成我们的目的来说）fnval算是一个有点用的参数，这里就取值16  

![](./images/xxx-files-9a1083825dd8dfb4827b107483a14217d0255565.png@753w_125h_progressive.webp)

返回的数据结构就与之前的相比差异比较大了。

![](./images/xxx-files-75a5ec22e006f7f3c3f632af413447f3f920f685.png@942w_821h_progressive.webp)

这里获取的是当前网页端以及APP端所使用的dash源视频，特点是音视频是分开的，并且下载到的文件扩展名为m4s，如果你经常在安卓APP上缓存视频，并查看过下载的文件，扩展名是一样的，且音视频都是分开的。dash下的audio和video分别就是音视频，展开获得链接，下载方法与上面相同。

你应该也发现了视频video中每个id对应着画质，qn设定为120却获取到了所有的画质级别，并且每种画质都有两条。

这两条分别对应着传统H264的视频源，以及新式的H265的视频源

![](./images/xxx-files-1fa1443262af7fc9b593829492fa6b45bfa23cb3.png@731w_597h_progressive.webp)

h265

![](./images/xxx-files-83c2cf95c7dec2b6b570e7dd66dca8bc3944bc3f.png@800w_596h_progressive.webp)

H264 AVC

HEVC的规格为8bit，这个格式目前在WEB端没有使用，APP在用。（不是所有视频都有）

**Aria2c 简单使用方法**

从GitHub可以直接下载编译好的windows版本。

解压后只有一个可执行程序 aria2c.exe 这个是本体了。

你可以选择添加到环境变量，shell cmd中可以快速调用，也可以直接拖到Powershell或cmd中，后面空格加上命令参数

![](./images/xxx-files-0b416a425015a6f0713b1bdc160a456d42608048.png@942w_177h_progressive.webp)

**Python 编程实现**

有了上面思路步骤，基本上就可以依靠request模块的get()以及json模块来发起GET请求调用接口解析数据了，下载通过subprocess模块调用aria2c下载以及ffmpeg合并音视频。

在get()的使用上，添加了header（请求标头包含cookie以实现下载大会员视频）

执行效果：

[

01:16

Python下载B站4K视频【非教程】

1825 10

视频 ZHY2020









](https://www.bilibili.com/video/BV1CT4y1E7u2)

源代码：https://github.com/Daniel2022/bilibili\_own\_tools （本人的帐号cookie已剔除）

![](./images/xxx-files-4adb9255ada5b97061e610b682b8636764fe50ed.png@progressive.webp)

延伸
==

[

【B站API】视频二压与网页播放器API行为的联系

头图来源：pid 63756446 侵删投稿视频未被B站二压和被二压似乎在网页api回复上好像有点不一样，看完这个可能是奇怪的知识增加了。本文做为B站api学习笔记。感兴趣的就跟我体验发现规律验证规律的乐趣吧~~~起因之前写了篇调查B站新4K视频码率的文章cv5778825，起初只下载了AVC格式的原视频（通过手机缓存），后来发现B站是有HEVC格式的视频的（目前确定UWP客户端可以在线播放），奈何当时UWP有点bug下载403forbidden（此文写作时已修复但仍不能下载HEVC视频），虽然

文章 ZHY202... 1072 15 0



](https://www.bilibili.com/read/cv5794140?from=articleDetail)

dash源不是所有时候都返回所有画质的链接

[

MPEG-DASH - 面向未来的流媒体解决方案

演讲简介：伴随着多媒体技术的发展，视频逐渐成为互联网内容的主流，思科表示到 2022 年视频资源将占据互联网流量的 82%，并且将近一半的设备和连接都会具备视频功能。在互联网快速发展的今天，多媒体播放的用户体验显得愈发重要。B 站一直致力于用户视频播放用户体验改善及优化，于去年正式引入并全量上线 MPEG-DASH 作为新的流媒体解决方案。上线之后卡顿率得到大幅优化，切换体验大幅提升，获得用户一致好评。而我们使用的 MPEG-DASH 是一种自适应比特率串流技术，使高质量流媒体可以通过传统的 H

文章 哔哩哔哩技术 787 19 0



](https://www.bilibili.com/read/cv3901640?from=articleDetail)

何为DASH

[

【推测】B站H.265（HEVC）编码的触发条件

上回，我测试了下B站全面开放的4K视频的一些指标。其中，我提到有一点：所有投稿的4K视频都会被B站服务器二压，并且产生H265（HEVC）编码格式的视频流供移动端和win10 UWP客户端使用。关于启用H.265格式，我并没有又找到公开的官方说明，只是坊间流传说在做灰度测试。这里只找到一个比较“官方”的文章，原作者是B站视频云技术专家，负责视频编解码团队，开发自研hevc编码器。启用H.265视频编码，目前我可以追溯到去年的8月份就开始了，但是没有官方的公开说明（其实这个大不必宣传，毕竟一般用户

文章 ZHY202... 1.3万 56 33



](https://www.bilibili.com/read/cv6360816?from=articleDetail)

H265格式触发的个人推测

[

『B站API学习』获取UP主的实时总播放量

最近几天，倒腾测试4K视频，涉及到下载B站视频，捎带学习了下网站的一些api接口的使用，可以用来获取一些有用的数据，其中包括下载视频。（嘿嘿……）咳咳，上面这个用到的稍微有点复杂，现在先不涉及，这篇先从一个比较简单的讲起。这个是我的B站主页的信息条，其中除去粉丝关注点赞数会实时更新，其余都是每天12：00更新一次，包括UP的“创作中心”后台数据。但是单个视频的播放量是在实时变动的，那么是不是把UP主所有视频的播放量都加起来就是实时的总播放量呢？要获取UP的所有视频的播放量数据，就涉及到这篇文章使

文章 ZHY202... 2140 13 6



](https://www.bilibili.com/read/cv6381588?from=articleDetail)

API调用简单实战

![](./images/xxx-files-4adb9255ada5b97061e610b682b8636764fe50ed.png@progressive.webp)

参考资料
====

https://segmentfault.com/a/1190000017511459 【关于bilibili视频下载的一些小思路 原作者：shabby】

头图PID：69606244

本文为我原创本文禁止转载或摘编

[教程](https://search.bilibili.com/article?keyword=%E6%95%99%E7%A8%8B&from_source=article) [技巧](https://search.bilibili.com/article?keyword=%E6%8A%80%E5%B7%A7&from_source=article) [浏览器](https://search.bilibili.com/article?keyword=%E6%B5%8F%E8%A7%88%E5%99%A8&from_source=article) [下载视频](https://search.bilibili.com/article?keyword=%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91&from_source=article) [API](https://search.bilibili.com/article?keyword=API&from_source=article) [视频下载](https://search.bilibili.com/article?keyword=%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD&from_source=article) [Bilibili](https://search.bilibili.com/article?keyword=Bilibili&from_source=article)