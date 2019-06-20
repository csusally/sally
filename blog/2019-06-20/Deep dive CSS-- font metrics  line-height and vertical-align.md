---
date: "2019-05-20"
title: "Deep dive CSS: font metrics, line-height and vertical-align"
category: "css"
tags: ["css","line-height"]
banner: "/assets/bg/3.jpg"
---

>line-height 和 vertical-align是两个简单的css属性，大多数的开发者都认为自己已经完全掌握了他们的用法。但是其他们是非常复杂的，甚至可以说是最难掌握的之一，因为他们在创建css中不常见的属性——内联格式内容中发挥着中发挥着重要作用。
>
>line-height可以被设定为一个长度或者不带单位的数值，其默认值为normal。normal表示什么呢？我们经常看到它是1（获取应该是1）或者1.2，在这点上并没有明确的规定。无符号的line-height与fontsize是相关的，问题是对于不同的字体font-size：100px表现是不同的，所以此时line-height总是相同的还是不同呢？真是在1——1.2之间么？另外，vertical-align，他们对于line-height又是怎样表现的？

翻译自:http://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align [原文地址](http://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align"%3Ehttp://iamvdo.me/en/blog/css-font-metrics-line-height-and-vertical-align)

## 先来聊聊font-size
下面的html code，每个span设置不同的字体：
```
<p>
    <span class="a">Ba</span>
    <span class="b">Ba</span>
    <span class="c">Ba</span>
</p>


p  { font-size: 100px }
.a { font-family: Helvetica }
.b { font-family: Gruppo    }
.c { font-family: Catamaran }
```
font-size相同，字体不同，表现出不同的高度，并没有生成100px高度的圆度，他们的高都分别如下图标示：
![css-fontsize](/assets/2019-05-20/deep-css1.png )
虽然这看起来有点奇怪，但是其实完全符合预想，原因主要在**字体本身**。

——特定的字体定义了自身的em-square（or UPM, units per em），一种用来绘制每个字符占用的容器，这个面积使用相对单位，通常设置为1000单位。也可以是1024、2018或者其他数值。
——基于它的相对单位，字体的一些属性被设置（ascender, descender, capital height, x-height, etc.）。需要注意的是一些值可以回溢出em-square之外。
——在浏览器中，相对单位会去等比去适应给定的字体大小。

以Catamaran font 为例，在fontforge中得到以下信息：
em-square： 1000
the ascender ： 1100  （mac、windows可能不同）
descender ： 540  （mac、windows可能不同）
Capital Height： 680
X height： 485
![css-fontsize](/assets/2019-05-20/deep-css2.png )

这意味着Catamaran在1000单位的em-square中使用了1100+540个单位，所以设置100px的font-size时得到164px的高度，这个计算出的高度是元素的content-area的高度。可以认为content-area就是背景应用的区域。

我们同样可以得到大写字母的高度为68px(680单位)，小写字母的高度为49px（485单位），因此，1ex = 49px，1em = 100px不是164px（em是基于font-size，不是计算高度）
![css-fontsize](/assets/2019-05-20/deep-css3.png )

在我们继续深入之前，要注意在屏幕上渲染一个p元素时候，它可能因为限定的宽度而分成很多行。每一行包括一个或多个行内元素，每一行又称之为一个line-box。line-box的高度取决于它的子元素的高度。结果就是一个line-box的高度足够容纳所有的子元素（默认）。以如下html为例：
```

<p>
    Good design will be better.
    <span class="a">Ba</span>
    <span class="b">Ba</span>
    <span class="c">Ba</span>
    We get to make a consequence.
</p>
```
它将产生3个line-box，第一个和最后一个分别好汉一个单独的匿名的行内元素（text content）；第二个包括两个匿名的行内元素和3个span标签。
![css-fontsize](/assets/2019-05-20/deep-css4.png )

我们清楚的看到第2个line-box比其他两个高，是因为他们孩子的content-area。更具体的就是其他一个是Catamaran字体。
line-box生成的难点在于我们看不到也无法用css来控制它，即使对::first-line应用一个背景也无法显示第一个line-box的高度。


## line-height: to the problems and beyond
line-box的高度是根据孩子高度计算的。虽然这听起来有点怪异，一个行内元素有两个不同的高度：content-area高度和virtual-area高度（virtual-area并不是官方说法）。
——content-area高度有font-metrics定义。
——virtual-area高度是line-height，它的高度用来计算line-box的高度。
这打破了一个常见的认知： line-height是基线之间的距离。在css中，他不是。
![css-fontsize](/assets/2019-05-20/deep-css5.png )

virtual-area和content-area之间的高度的计算差异叫做leading，一般添加在content-area的上方，另一半则在下方。content-area始终在virtual-area的中间。

基于他们的计算值，line-height（virtual-area）会与content-area高度相同、高于或小于content-area。对于较小的virtual-area，leading是负数，line-box同城会小于它的孩子。

还有其他种类的行内元素。
——替代的行内元素 (`<img>, <input>, <svg>, etc.`)
——inline-block 和其他的inline-* 元素
——在特定形式内容中的行内元素（如：在一个flex-box元素中，所有的flex item都是块级化的）

对于这些特定的额行内元素，高度基于他们height，margin、border等属性计算，如果height是auto，line-height严格的等于它的content-area高度。
![css-fontsize](/assets/2019-05-20/deep-css6.png )

总之，我们依然不清楚line-height的normal值是多少，这个答案就在font metrics中。以Catamaran为例，em-sqare为1000，还有很多ascender、descender值
——generals Ascent/Descent： 分别为770/230，用于对字符绘制
——metrics Ascent/Descent： 分别为1100/540 用于content-area的高度
——metric line gap：用于line-height：normal，增加此值到Ascent/Descent metrics

此时，Catamaran的line gap为0，因此，line-height：normal等于content-area的高度，即1640 units or 1.64，对于其他字体类似，所有的font-metrics都是有字体设计者设定的，是某种字体特有的。因此，显然设置；line-height：1并不是一个好的实践。必须提醒的是无单位值是与font-size相关的而不是content-area，virtual-area比content-area小经常是很多问题的来源。
![css-fontsize](/assets/2019-05-20/deep-css7.png )
几乎有95%的字体默认的line-height大于1，在0.618-3.378之间。

对于line-box的更详细的说明：
——对于行内元素，padding和border增加了背景区域，但不会增加content-area的高度，也不会增加line-box的高度。content-area并不总是你在屏幕中看到的，margin-top和margin-bottom无效。
——对于替代行内元素，inline-block和块级化的行内元素：padding、margin和border增加个高度，同时有增加了line-box的高度。


## vertical-align: one property to rule them all

我们还没有提高vertical-align，虽然在计算line-box的高度重非常重要，甚至可以说vertical-align在内联格式的内容中有首要的作用。其默认值为baseline。还记得font metrics ascender 和descender吗？这些值决定了baseline的位置以及比例，由于ascenders和desenders很少是对半的额，它可能会引起意想不到的结果，例如兄弟元素之间。
首先来看如下的html：
```

<p>
    <span>Ba</span>
    <span>Ba</span>
 </p>
 
 
p {
    font-family: Catamaran;
    font-size: 100px;
    line-height: 200px;
}
```
结果渲染如下，同样的字号，同样的baseline，一切都很好：
![css-fontsize](/assets/2019-05-20/deep-css8.png )

那如果第二个元素的字号更小呢，`span:last-child {
    font-size: 50px;
}`
结果就是很怪异的导致了更高的line-box，如下图
![css-fontsize](/assets/2019-05-20/deep-css9.png )
这可能是无单位的line-height引起的，但有些时候你需要固定的一些line-height的值去达到一个完美的垂直位置上的渲染。讲真，不论你怎么选择，你都会在内联对齐上面有麻烦。

再看下另外一个例子。一个a标签的line-height：200px，包含一个span标签继承了相同的line-height属性。
```

<p>
    <span>Ba</span>
</p>


p {
    line-height: 200px;}span {
    font-family: Catamaran;
    font-size: 100px;
}
```
此时line-box的高度是多少呢？我们期望是200px，但并不是我们想的那样。问题在于p元素有自己不同于默认字体的字体设置。p元素和span元素之间的baseline是不同的，因此line-box的高度就比期望的高些。这主要是因为浏览器在即使有一个0
宽度的字符也会开始计算line-box。
![css-fontsize](/assets/2019-05-20/deep-css10.png ))

默认的基线对齐太tm了，那vertical-aiign：middle会解决问题么？‘middle’是将盒子的垂直中点与父盒子基线加x-height的一半的位置对齐。基线比例是不同的，x-height也不同，因此，middle 对齐也是不太可靠的，更糟糕的是在大部分的情况下，middle从来都不是真正的在中间。
另外，有4个其他的值在一些情况下是非常有用的：
——vertical-align： top、bottom  align to the top or the bottom of the line-box
——text-top / text-bottom align to the top or the bottom of the content-area
![css-fontsize](/assets/2019-05-20/deep-css11.png )

在对齐virtual-area的时候就是对齐看不到的高度的时候，也要特别注意。如下就是一个简单的例子vertical-align: top。不可见的line-height可能会产生奇怪的结果。

![css-fontsize](/assets/2019-05-20/deep-css12.png )

最后，vertical-align也接受数值来相对基线提高或降低盒子的位置。应用起来会有点棘手，会改变content-area的高度。


## CSS is awesome
我们已经了解了line-height和vertical-align是如何一起工作的，现在的问题是：font-metrics可以通过css控制么？当然是不行的，font metrics是固定的，不过我们仍然可以通过css做些事。
假如我想使用Catamaran字体得到大写字母的高度是准确的100px。首先我们将所有的font metrics设置为一般的css属性，然后计算合适的font-size 来得到100px的大写字母高度。
```

p {
    /* font metrics */
    --font: Catamaran;
    --fm-capitalHeight: 0.68;
    --fm-descender: 0.54;
    --fm-ascender: 1.1;
    --fm-linegap: 0;

    /* desired font-size for capital height */
    --capital-height: 100;

    /* apply font-family */
    font-family: var(--font);

    /* compute font-size to get capital height equal desired font-size */
    --computedFontSize: (var(--capital-height) / var(--fm-capitalHeight));
    font-size: calc(var(--computedFontSize) * 1px);}
```
![css-fontsize](/assets/2019-05-20/deep-css13.png )
非常的直接。但是如果想要文字在视觉的中间（content-area），name其他的空间就要平均的分配在B字母的上下两端。因此我们基于ascender、descender来计算vertical-align的值。
首先计算normal情况下content-area的高度
```
p {
    …
    --lineheightNormal: (var(--fm-ascender) + var(--fm-descender) + var(--fm-linegap));
    --contentArea: (var(--lineheightNormal) * var(--computedFontSize));
}
```
然后需要计算字母顶部到上边缘的距离以及字母底部到下边缘的距离。
```

p {
    …
    --distanceBottom: (var(--fm-descender));
    --distanceTop: (var(--fm-ascender) - var(--fm-capitalHeight));
    }
```
现在可以计算vertical-align的值，它是以上两个距离的差乘以计算font-size（我们必须对内联的子元素应用此值）
```

p {
    …
    --valign: ((var(--distanceBottom) - var(--distanceTop)) * var(--computedFontSize));}span {
    vertical-align: calc(var(--valign) * -1px);
    }
```

最后设定想要的line-height
```

p {
    …
    /* desired line-height */
    --line-height: 3;
    line-height: calc(((var(--line-height) * var(--capital-height)) - var(--valign)) * 1px);
    }
```
![css-fontsize](/assets/2019-05-20/deep-css14.png )
在B的左边添加一个与B等高的icon就非常容易：
```

span::before {
    content: '';
    display: inline-block;
    width: calc(1px * var(--capital-height));
    height: calc(1px * var(--capital-height));
    margin-right: 10px;
    background: url('https://cdn.pbrd.co/images/yBAKn5bbv.png');
    background-size: cover;}
```
![css-fontsize](/assets/2019-05-20/deep-css15.png )

