---
title: "读电子工业出版社《编码》一书有感"
description: "这次回美国，把很久之前买的一本《编码：隐匿在计算机软硬件背后的语言》也一同带过来了，想要找时间看完。在开始之前，我曾上豆瓣看了看大家对这本书的评价，普遍都是好评加推荐。当时也有看到有人提出翻译存在比较严重的问题，但直到阅读至第13章，我才真的认识到不能再花时间去读这个译本——错误的地方不少。第13章讲的是减法器的实现，读到某一段的时候，我感觉无论如何都看不明白，文字里似乎缺了什么东西，而且有矛盾。..."
date: "2015-08-22T19:33:27+00:00"
updated: "2021-12-07T19:30:05+00:00"
routeSlug: "2015-08-23-translation-error-code-the-hidden-language-of-computer-hardware-and-software"
url: "/2015/08/23/translation-error-code-the-hidden-language-of-computer-hardware-and-software/"
categories: ["读书"]
tags: ["翻译","计算机科学"]
cover: ""
---
<p>这次回美国，把很久之前买的一本《编码：隐匿在计算机软硬件背后的语言》也一同带过来了，想要找时间看完。<br>在开始之前，我曾上豆瓣看了看大家对这本书的评价，普遍都是好评加推荐。当时也有看到有人提出翻译存在比较严重的问题，但直到阅读至第13章，我才真的认识到不能再花时间去读这个译本——错误的地方不少。<br>第13章讲的是减法器的实现，读到某一段的时候，我感觉无论如何都看不明白，文字里似乎缺了什么东西，而且有矛盾。重新打开本书的豆瓣页面，我看见了<a href="http://book.douban.com/review/7495223/" target="_blank" rel="noopener noreferrer">有一位朋友直接指出了不少翻译错误</a>，其中便有这一段话：</p>







<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow"><p>　　页码：155 &#8211; 156<br>原文：If a subtraction is being performed and if the subtrahend (the B switches) is less than the minuend (the A switches), it&#8217;s normal that the CO output from the adder is 1. This represents the 100000000 that must be subtracted in the final step.So the Overflow/Underflow lamp is lit only if the CO output from the adder is 0. This means that the subtrahend is greater than the minuend and the result is negative. The machine shown above isn&#8217;t designed to display negative numbers.<br>译文：当进行减法运算的时候，如果减数（输入B）小于被减数（输入A），这时加法器的CO输出为1。这表示减法的最后一步要减去100000000。也就是说减数要大于被减数，结果为负。上面所示器件现在还不能表示负数。因此，上溢/下溢指示灯仅在加法器的CO输出为0时才会亮起。<br>改进：（来自旧译本）当做减法时, 如果被减数大于减数, 则加法器的CO端正常输出1, 这表示在减法的最后一步中要减去100000000。所以, 只有当加法器的CO输出为0时, 上溢/下溢灯泡才被点亮。这时减数大于被减数, 差是个负数。上面这个加/减法器现在还不能表示负数。<br>说明：CO和SUB作为XOR的输入，上溢/下溢灯泡是XOR输出。</p></blockquote>



<p>在我看来，即使是普遍被认为质量更佳的旧版翻译，对于这段话的表述也是有一点点偏差的。原文的意思并不是“这表示在减法的最后一步中要减去100000000”，而是加法器在进行了减法操作时，其结果会比输入的数多一位，通过求补数方法计算减法时需要这个多出来的最高位去掉。“减去100000000”这步是固定存在的，并不是由加法器的输出来决定的。<br>所以还是放弃看译本，找个原版的电子书继续把书读完。抛开翻译不说，这本书确实非常值得一读，只看了一半已经解答了很多对于计算机基础构造的疑问。然而出版社的翻译质量让人无法恭维，只能说如果能力足够，想要阅读外国著作时，最好是选择直接读原版。翻译错误或表达水平不足导致对原著的误解，这在中文译本里似乎并不是特别罕见的事情。<br>想到这，我也必须在翻译工作中督促自己才行，毕竟我做翻译的初衷，就是想让读者尽可能地感受到原作的正确内容和行文风格，无论做什么类型的书籍翻译，都是同样的道理。</p>
