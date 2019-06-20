---
date: "2019-06-20"
title: "微信小程序scroll-view 实现锚点功能"
category: "微信小程序"
tags: ["mpvue","锚点"]
banner: "/assets/bg/2.jpg"
---


>mpvue 开发微信小程序的过程中有时会碰到分页的列表中有折叠展开子列表的功能，如果在有字列表展开的情况下再点开其他的列表，如果此时之前展开的列表需要折叠起来的话， 那么新展开的列表就会紧接着在之前收回的列表之后，但是这个收回的位置就是不可控的了，可能跟它的子列表的高度有关，并且如果刚好收回的列表在屏幕底部时，用户新展开的列表也就到最底部或者超出屏幕之外了，这样子用户体验就会大打折扣。因此，想到锚点的功能，这样的话，主要你点击展开列表，新展开的列表就会自动到用户视野中，用户体验会好很多。


在微信小程序中，没有a标签可以实现锚点，但是可以利用原生的scroll-view组件来实现。那有人会说scroll-view需要高度固定，这个高度怎么自适应的固定呢？那这就需要css的calc函数来实现。例如整个页面只有上部的tab栏，下方都是列表。那个列表就可以放在scroll-view标签中，一般情况下tab栏的尺寸都是固定的，那么可以通过设置scrll-view的css为：height:calc（100vh - 固定的px），这样就可以对不同屏幕高度的手机做适配（微信内置浏览器要在calc前面加前缀-webkit-），用户也看不出来使用了scroll-view标签，还可以让上面的tab栏始终在页面中（这对于长列表说非常重要）。

接下来就是怎么实现锚点的功能了。这个功能可以通过给每个列表项标签设置id值，通过将scroll-view的scroll-into-view属性设置成子元素的id值就可以实现类似的锚点作用。下面看实例代码：


```

<template>
    <view class="main">
        <view style="height:300rpx;background:#777;margin:0 0 20rpx 0;padding:0;">
        test-scroll
        height:300rpx;
        margin-bottom:20rpx;
        </view>
        <scroll-view :scroll-into-view="currid" scroll-y scroll-with-animation>
        height: calc(100vh - 320rpx);
            <view v-for="(item,index) in [1,2,3,4,5,6,7,8,9,10]" :key="index" :id="'item'+index" @click="curridChange('item'+index)">
                <view class="title" style='color:blue;height:100rpx;background:yellow;text-align:center;margin:10rpx auto;'>{{item}}</view>
                <view v-show="'item'+ index===currid" style="padding: 0 5%;">
                    <view v-for="(inneritem,innerindex) in [1,2,3,4,5]" :key="innerindex" style="background:pink">
                        {{'inner'+innerindex}}
                    </view>
                </view>
            </view>
        </scroll-view>
    </view>
</template>
<script>
export default {
    data(){
        return{
            currid:'item0'
        }
    },
    computed:{
    },
    methods:{
        curridChange(index){
            this.currid = index;
        }
    }
}
</script>
<style>
    scroll-view{
    height: calc(100vh - 320rpx);
}
</style>

```
示例的效果图如下：

![微信 scroll-view 锚点](/assets/2019-06-20/scroll-view.png "微信 scroll-view 锚点示例图")