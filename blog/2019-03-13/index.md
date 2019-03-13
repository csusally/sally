---
date: "2018-03-13"
title: "git提交规范 & 文档生成"
category: "git"
tags: ['git', 'githooks', '规范']
banner: ""
---

# git提交规范 & 文档生成

> git commit 规范虽然没有代码规范那样要求严格，甚至很多在工作中从来就没有提交的规范。但统一标准必然会让我们在版本回退中更轻松，利人利己。


## 具体的commit规则

规范参考自：[Commit message 和 Change log 编写指南](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html"%3Ehttp://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

* 规则公式

```
<type>(<scope>): <subject>
```

* **type** 说明commit的类别

```
feat：新功能（feature）
fix：修补bug
docs：文档（documentation）
style： 格式（不影响代码运行的变动）
refactor：重构（即不是新增功能，也不是修改bug的代码变动）
test：增加测试
chore：构建过程或辅助工具的变动
```


* **scope**  用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。
* **subject**  是 commit 目的的简短描述，不超过50个字符

## 不符合规则异常处理


```
INVALID COMMIT MSG: does not match "<type>(<scope>): <subject>" ! jartto:fix bug 
```

原因：
其一，使用了规范外的关键字;
其二，很细节的问题，jartto：后少了空格;


这时候我才回忆起来，当时提交一直失败，情急之下直接强制提交，所以以后的提交都会抱出这个异常。大致意思就是：你的之前的 Commit 不合格


怎么解决呢，继续放下看：

## 如何修改之前的 commit 信息


1. 将当前分支无关的工作状态进行暂存

```
git stash
```
2. 将 HEAD 移动到需要修改的 commit 上

```
git rebase 9633cf0919^ --interactive
```
3. 找到需要修改的 commit ,将首行的 pick 改成 edit
4. 开始着手解决你的 bug
5. git add 将改动文件添加到暂存
6. git commit –amend 追加改动到提交
7. git rebase –continue 移动 HEAD 回最新的 commit
8. 恢复之前的工作状态
```
git stash pop
```

## 项目中如何使用


这时候问题又来了，为什么我提交的时候会有警告，这个又是如何做到的呢?这时候，我们需要一款 **Node 插件 validate-commit-msg** 来检查项目中 Commit message 是否规范。

1、首先，安装插件：

```
npm install --save-dev validate-commit-msg
```
 

2、使用方式一，建立 .vcmrc 文件：

```
{   
"types": ["feat", "fix", "docs", "style", "refactor", "perf", "test", "build", "ci", "chore", "revert"],   
"scope": {     
   "required": false,    
   "allowed": ["*"],     
   "validate": false,     
   "multiple": false   
   },   
"warnOnFail": false,   
 "maxSubjectLength": 100,   
 "subjectPattern": ".+",
 "subjectPatternErrorMsg": "subject does not match subject pattern!",  
 "helpMessage": "",   
 "autoFix": false 
 } 
```

3、使用方式二：写入 package.json （同上面的配置）

```
{   
    "config": {    
        "validate-commit-msg": {     
            /* your config here */    
        }  
    }
}
```

4、怎么实现已提交commit就检查是否符合规范呢，使用**ghooks钩子函数**
（package.json 文件）
当然没有装[ghooks](https://www.npmjs.com/package/ghooks"%3Ehttps://www.npmjs.com/package/ghooks)的需要先安装
```
npm install ghooks --save-dev
```
```
{   …  
    "config": {     
        "ghooks": {       
        "pre-commit": "gulp lint",      
        "commit-msg": "validate-commit-msg",       
        "pre-push": "make test",       
        "post-merge": "npm install",       
        "post-rewrite": "npm install",     
        …     } 
        }  
    … 
}
```

在 ghooks 中我们可以做很多事情，当然不只是 validate-commit-msg 哦。

## commit 规范的作用

1、提供更多的信息，方便排查与回退;
2、过滤关键字，迅速定位;
3、方便生成文档;


## 生成 Change log
正如上文提到的生成文档，如果我们的提交都按照规范的话，那就很简单了。生成的文档包括以下三个部分：

New features
Bug fixes
Breaking changes.


每个部分都会罗列相关的 commit ，并且有指向这些 commit 的链接。当然，生成的文档允许手动修改，所以发布前，你还可以添加其他内容。这里需要使用工具 Conventional Changelog 生成 Change log ：

```
npm install -g conventional-changelog-cli
cd <项目目录>
conventional-changelog -p angular -i CHANGELOG.md -s -r 0
```

可以将其写入 package.json 的 scripts 字段。


```

{
  "scripts": {
    "version": "conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md"
  }
}

```