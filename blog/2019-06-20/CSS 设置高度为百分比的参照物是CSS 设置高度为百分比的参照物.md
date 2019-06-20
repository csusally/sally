---
date: "2019-06-19"
title: "CSS 设置高度为百分比的参照物是？"
category: "css"
tags: ["css","高度百分比"]
banner: "/assets/bg/4.jpg"
---

>The percentage is calculated with respect to the height of the generated box's containing block.

这个对应于你的去掉 absolute 的情形，因为父元素设置了height:0，所以子元素也应该是0。

>Note: For absolutely positioned elements whose containing block is based on a block-level element, the percentage is calculated with respect to the height of the padding box of that element.
这个对应于 absolute 的情形。
也就是说当子元素设置为position：absolute；height：100%时候，该子元素的高度就是父元素自身高度加padding的总高度。

**结论:**
1. absolute元素的百分比宽高 计算时按照的包含块的 padding + content的值算的，偏移的参考也要加上padding那部分

2. relative元素的百分比宽高 计算时按照的包含块的 content的值算的.


**这个特性的用法:**
**可以用来生成长宽比例固定的自适应div容器，并且内部内容也随外部容器等比放大缩小。
参考最后的vue 代码所示：**


这是利用了padding 设置百分比以其父元素宽度为参考来实现的。
>The percentage is calculated with respect to the width of the generated box's containing block, even for 'padding-top' and 'padding-bottom'. If the containing block's width depends on this element, then the resulting layout is undefined in CSS 2.

slider默认宽度为100%，高度设为0，padding-bottom设置为65%（此百分比以元素的父元素宽度为参考，），其子元素采用绝对定位，高度为100%（即父元素的padding高度。也就是父元素宽度的65%）。此时绝对定位的元素长宽比为设置的100:65，长宽比就是固定的。


```
<div class="slider" >
    <div id="wrap">
        <ul id="slider" :style="sty">
            <li v-for="(item, index) in imgList" :key="index" :style="sty">
            <img class="weui-slider-list-img" :src="item">
            </li>
        </ul>
    </div>
</div>


ul {
    list-style: none;
}
.slider {
    position: relative;
    height: 0;
    padding-bottom: 65%;
    margin: 0;
}
#wrap {
    position: absolute;
    overflow: hidden;
    margin: 0 auto;
    height:100%;
    /* max-height: 700px; */
    top: 0;
    left:0;
    z-index: 1;
}
#slider {
    width: 300%;
    height: 100%;
    font: 100px/400px Microsoft Yahei;
    text-align: center;
    color: #fff;
    margin-left: 0;
    -webkit-animation: slide1 3s ease-out infinite;
    overflow: hidden;
    display: flex;
    flex-direction: row;
}
#slider li {
    flex: 1;
    text-align: center;
    overflow: hidden;
    /* max-height: 700px; */
}
```

更多css标准用法参考
https://www.w3.org/TR/CSS/#terms