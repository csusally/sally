---
date: "2019-07-12"
title: "关于vue项目中npm包安装失败&bebal版本不对等问题的解决方"
category: "VUE"
tags: ["VUE", "npm", "babel"]
banner: "/assets/bg/2.jpg"
---

一、如果安装npm包时出现错误，（很可能是使用的淘宝的源）可以尝试以下的流程：

    1、npm set registry https://registry.npmjs.org/   
    清除已设置的npm淘宝镜像 安装cnpm：npm install -g cnpm --registry=https://registry.npm.taobao.org）
    2、npm cache clean --force

二、项目启动时报错

`Requires Babel "^7.0.0-0", but was loaded with "6.26.3". `
如果之前项目启动正常，后来因为新装了bebal插件导致此错误的话，正常情况下是因为新装的插件需要更新版本的bebal，此时你就需要更新你的babel啦。比较简单的方法就是

1、执行 `npx babel-upgrade --write --install` 不过这个命令需要注意的是<u>If using npm < v5.2.0, install npx globally.</u>

详细的可参阅更新：https://www.npmjs.com/package/babel-upgrade

2、更新项目下 .babelrc 文件

```
"presets": [
    [
        "@babel/preset-env"
    ]
],
```
更多参考 https://babeljs.io/docs/en/next/babel-preset-env 或者 babel官网

