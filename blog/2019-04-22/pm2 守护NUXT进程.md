---
date: "2018-04-22"
title: "pm2 守护NUXT进程"
category: "构建"
tags: ["nuxt","ssr","PM2","进程管理"]
banner: ""
---

nuxt项目在上线部署的时候，可以通过pm2来守护node进程，相关使用配置如下：
1、首先，需要在服务器或本机上全局安装pm2，
```
npm install pm2 -g
```
2、通过pm2启动node 服务
```
#package.json 添加一条脚本命令
"pm2": "npm run build && pm2 start npm --name '进程名称' -- run start
执行“pm2”脚本
npm run pm2
```
在mac系统或linux系统中以上大概就可以成功启动了，但是windows系统却提示“缺少ecosystem.config.js文件”，ok，接下来就需要生成这个文件，并且通过pm来启动它就好了
```
pm2 ecosystem
```
生成需要的文件，文件内容如
```

module.exports = {
apps : [{
name: 'nuxtapp', //启动的进程的名字
script: 'server/index.js',  //执行的脚本
// Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
args: 'one two',
instances: 'max', //启动的实例数，默认为1，只启动一个进程，max表示自动检测服务器cpu的核数
autorestart: true,
watch: false,
max_memory_restart: '1G',
exec_mode: "cluster",  //执行模式，默认为“folk”，修改为“cluster”，充分利用多核cpu
env: {
NODE_ENV: 'development'
},
env_production: {
NODE_ENV: 'production'
}
}],
deploy : {
production : {
user : 'node',
host : '212.83.163.1',
ref : 'origin/master',
repo : 'git@github.com:repo.git',
path : '/var/www/production',
'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
}
}
};

```
以上配置好之后，package.json增加
```
"pm2": "npm run build && pm2 start ecosystem.config.js --env production"
```
同样执行` npm run pm2` 就可以启动啦，如图
![d8cee87bcf7fd147a1a3d492bceff19e.png](en-resource://database/901:1)
还可以通过pm2 monit 监控运行时的状态
![a77bc7ae5d2abaa918d88f584b37c4bc.png](en-resource://database/903:1)

还有pm2 部署的完美解决方案：
```
pm2 deploy ecosystem.json production setup
pm2 deploy ecosystem.json production
```

