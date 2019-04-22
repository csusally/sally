---
date: "2019-04-12"
title: "网页优化之开启Gzip压缩"
category: "优化"
tags: ["加载优化","spa","vue"]
banner: ""
---



HTTP压缩是指在Web服务器和浏览器间传输压缩文本内容的方法。HTTP压缩通常采用gzip压缩算法压缩HTML、JavaScript、CSS等文件。压缩的最大好处就是降低了网络传输的数据量，从而提高客户端浏览器的访问速度。当然，同时也会增加一点服务器的负担。


原理：

* 1)Web服务器接收到浏览器的HTP请求后，检查浏览器是否支持HTP压缩;在用户浏览器发送请求的HTTP头中，带有" Accept-Encoding：gzip，deflate"参数则表明支持gzip和 deflate两种压缩算法。
* 2)如果浏览器支持HTTP压缩，Wb服务器检查请求文件的后缀名；
静态文件和动态文件后缀启动要所都需要在Metabase，xml中设置；
静态文件需要设置：HcFileExtensions Metabase Property；
动态文件需要设置：HcScriptFileExtensions Metabase Property。
* 3)如果请求文件是HTML、CSS等静态文件并且文件后缀启用了压缩，则Web服务器到压缩缓冲目录中检查是否已经存在请求文件的最新压缩文件；
* 4)如果请求文件的压缩文件不存在，Web服务器向浏览器返回未压缩的请求文件，并在压缩缓冲目录中存放请求文件的压缩文件；
* 5)如果请求文件的最新压缩文件已经存在，则直接返回请求文件的压缩文件；
* 6)如果请求文件是ASPX、ASP等动态文件并且文件后缀启用了压缩Web服务器动态压缩内容井返回浏览器，压缩内容不存到压缩缓存目录中。 [1]
![80825c7b19a471abe0790485eb23cdb6.png](en-resource://database/751:1)

弊端：

对HTTP传输内容进行压缩是改良前端响应性能的可用方法之一，大型网站都在用。但是也有缺点，就是压缩过程占用cpu的资源，客户端浏览器解析也占据了一部分时间。但是随着硬件性能不断的提高，这些问题正在不断的弱化。



nginx 配置：

The ngx_http_gzip_static_module module allows sending **precompressed files** with the “.gz” filename extension instead of regular files.This module is not built by default, it should be enabled with the --with-http_gzip_static_module configuration parameter.
```
                                    Example Configuration
gzip_static  on;
gzip_proxied expired no-cache no-store private auth;
```


With the “always” value (1.3.6), gzipped file is used in all cases, without checking if the client supports it. It is useful if there are no uncompressed files on the disk anyway or thengx_http_gunzip_module is used.