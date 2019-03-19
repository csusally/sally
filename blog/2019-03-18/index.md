---
date: "2018-03-18"
title: "vue SPA 单页面应用加载时间优化"
category: "js"
tags: ["vue", "SPA优化", "webpack"]
banner: ""
---


>使用vue开发的SPA（单页面）web页面随着项目的不断增大，不可避免的会出现首页加载时间太长的问题，这时候就要着重的考虑进行首页加载优化了。优化方案可以从以下几个方面去考虑。


![vue首页加载优化](/assets/2019-03-19/11vue.png "vue首页加载优化")

### 减小入口文件体积
未做优化前，我们会明显的发现build之后的文件中vender.js和main.js 比较大，特别是vender.js有时候会有大几百kb，还有main.js当然通过网页的开发者工具也会发现文件的加载速度比较慢，影响了整个页面的加载速度。因此针对性的减小文件体积会大大提高网页的加载速度。

1、首先，我们一般会通过使用CDN加载vue、vuex等资源的方式将这部分资源从vender.js中剥离出来。
//在index.html中引入cdn资源
```
 <body>
      <div id="app">
      </div>
      <!-- built files will be auto injected -->
      <script src="https://cdn.bootcss.com/vue/2.5.2/vue.min.js"></script>
      <script src="https://cdn.bootcss.com/vue-router/3.0.1/vue-router.min.js"></script>
      <script src="https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js"></script>
      <script src="https://cdn.bootcss.com/vue-resource/1.5.1/vue-resource.min.js"></script>
 </body>
```
 
 
 //修改 build/webpack.base.conf.js 
```
module.exports = {
 context: path.resolve(__dirname, '../'),
 entry: {
  app: './src/main.js'
 },
 externals:{
  'vue': 'Vue',
  'vue-router': 'VueRouter',
  'vuex':'Vuex',
  'vue-resource': 'VueResource'
 },
}
```
 
 
//修改src/main.js src/router/index.js 注释掉import引入的vue,vue-resource

```
// import Vue from 'vue'
// import VueResource from 'vue-resource'
// Vue.use(VueResource)
```


另外从代码分包的角度，改变原来一起加载组件的方式，利用路由懒加载的方式实现首页按需加载，将路由组件分为独立的js文件从而减少main.js 的文件。

修改router/index.js 文件

```
    const famouscompany = () => import("../components/famousCompany/index.vue") ;
    const joblist = () => import("../components/joblist/index.vue");
    const famouscompanydetail = () => import("../components/famousCompanyDetails/index.vue");
```
### 合理利用缓存
将css、js通过hash指纹追踪文件内容变化(vue-cli 已配置)，合理设置静态文件缓存过期时间，增量缓存

### 开启gzip压缩

gzip压缩需要服务端配合，具体的配置nginx和apache有别。
前端需要的配置有：


config/index.js中

```
module.exports = {
 build: {
  ...
  // Gzip off by default as many popular static hosts such as
  // Surge or Netlify already gzip all static assets for you.
  // Before setting to `true`, make sure to:
  // npm install --save-dev compression-webpack-plugin
  productionGzip: true, // 就是这里开启gzip,vue-cli搭建项目，这里默认为false
  productionGzipExtensions: ['js', 'css'],
 
  // Run the build command with an extra argument to
  // View the bundle analyzer report after build finishes:
  // `npm run build --report`
  // Set to `true` or `false` to always turn it on or off
  bundleAnalyzerReport: process.env.npm_config_report
 }
}
```

build/webpack.prod.conf.js中（使用vue-cli构建项目时，默认会有这段代码）


```
if (config.build.productionGzip) {
 const CompressionWebpackPlugin = require('compression-webpack-plugin')
 webpackConfig.plugins.push(
  new CompressionWebpackPlugin({
   asset: '[path].gz[query]',
   algorithm: 'gzip',
   test: new RegExp(
    '\\.(' +
    config.build.productionGzipExtensions.join('|') +
    ')$'
   ),
   threshold: 10240,
   minRatio: 0.8
  })
 )
}
```

### js、css 放在别处
静态文件放在别处可以减小服务器的压力
### 按需引入第三方插件
常见的有一些js函数库、iview的ui库等

### 若首屏为登录页，可以做成多入口，登录页单独分离为一个入口

**修改webpack配置**
在原先只有一个入口叫app的基础上，再加一个叫login的入口，指向另一个入口js文件；
既然是两个页面，那么原先只有一个的HtmlWebpackPlugin也需要再添加一个，并且filename和template改成登录页的；
HtmlWebpackPlugin默认会把所有资源放进html，为了去掉不需要的资源，需要在HtmlWebpackPlugin选项里分别添加excludeChunks: ['login']和excludeChunks: ['app']；
原先的某些CommonsChunkPlugin会导致报错，删掉只剩下一个manifest的CommonsChunkPlugin就好。

**添加登录相关文件**
添加之前配好的login入口文件，与app类似，但是去掉登录页不需要的东西，如用不到的组件和样式等；
添加login入口专用的router配置文件，去掉其他路由，只留下登录页一个就好：
添加登录页的html模板，也是去掉登录里用不到的资源。
![router配置](/assets/2019-03-19/12.png "router配置")

其他：
登录完不是用vue-router的push方法，而是改成直接修改location.href跳到另一个页面；
去除原来app路由中的login；
