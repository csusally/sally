---
date: "2019-07-04"
title: "vue-cli webpack-simple模板配置px2rem"
category: "VUE"
tags: ["VUE"]
banner: "/assets/bg/2.jpg"
---


1、`npm i px2rem-loader --save-dev`

2、修改webpack.config.js 文件，增加 **px2rem-loader**

```
{
    test: /\.css$/,
    use: [
    {
        loader: 'vue-style-loader'
    }, {
     loader: 'css-loader'
    }, {
        loader: 'px2rem-loader',
    // options here
    options: {
        remUni: 75,
        remPrecision: 8
    }
    }]
},
```
```
{
test: /\.vue$/,
loader: 'vue-loader',
options: {
    loaders: {
        css: 'vue-style-loader!css-loader!px2rem-loader?remUnit=75&remPrecision=8',
    }
// other vue-loader options go here
}
},
```

