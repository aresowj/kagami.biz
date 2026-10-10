---
title: "加入Disqus社区 分享一下集成方法"
description: "Disqus的跨站点交流功能非常吸引我，于是花了点时间给自己的博客装上。过程实际上只有几步，关键是在于如何确定margin的大小，以此调节Disqus模块位置，使其与现用的主题（官方默认的Twenty Fifteen）融合。安装完Disqus插件并且导入原有的评论，看上去是这样的： 比较难看 ，要是不能调我宁愿不装了。看了下官方的说明，似乎需要自己动手调整CSS，Disqus的div id为&#8..."
date: "2016-01-14T14:30:56+00:00"
updated: "2022-01-13T04:52:38+00:00"
routeSlug: "2016-01-14-integrate-disqus"
url: "/2016/01/14/integrate-disqus/"
categories: ["未分类"]
tags: ["css","JavaScript","jQuery","wordpress","编程"]
cover: "/wp-content/uploads/2016/01/qqe688aae59bbe20160114223026.jpg"
---
<div class="wp-block-image"><figure class="aligncenter"><a href="/wp-content/uploads/2016/01/qqe688aae59bbe20160114222144.jpg" rel="attachment wp-att-743"><img  width="990" height="933" src="/wp-content/uploads/2016/01/qqe688aae59bbe20160114222144.jpg" alt="QQ截图20160114222144" class="wp-image-743"  ></a></figure></div>



<p>Disqus的跨站点交流功能非常吸引我，于是花了点时间给自己的博客装上。<br>过程实际上只有几步，关键是在于如何确定margin的大小，以此调节Disqus模块位置，使其与现用的主题（官方默认的Twenty Fifteen）融合。<br>安装完Disqus插件并且导入原有的评论，看上去是这样的：<br><br>比较难看 ，要是不能调我宁愿不装了。<br>看了下官方的说明，似乎需要自己动手调整CSS，Disqus的div id为&#8217;disqus_thread&#8217;。<br>我也尝试过用Wordpress自带的CSS编辑功能，但不太熟悉CSS，没有找到对应主题样式调节margin, padding的方法，将主题样式表中的media部分照搬过来似乎不管用。于是转投JavaScript，安装插件<a href="https://wordpress.org/plugins/custom-css-and-javascript/" target="_blank" rel="noopener noreferrer">Custom CSS and Javascript</a>。<br>简单地分析后发现，只需要获取&lt;article&gt;的两边margin并为Disqus的div赋上并调节背景色即可，通过以下代码完成。</p>







<pre class="wp-block-code EnlighterJSRAW"><code>jQuery(document).ready(function () {
  var $article = jQuery('article').first();
  var $disqus = jQuery('#disqus_thread');
  $disqus.css('margin-left', $inner.css('margin-left')).css('margin-right', $inner.css('margin-right')).css('background-color', 'white').css('padding', '30px');
})</code></pre>



<div class="wp-block-image"><figure class="aligncenter"><a href="/wp-content/uploads/2016/01/qqe688aae59bbe20160114223026.jpg" rel="attachment wp-att-745"><img  width="966" height="820" src="/wp-content/uploads/2016/01/qqe688aae59bbe20160114223026.jpg" alt="QQ截图20160114223026" class="wp-image-745"  ></a></figure></div>



<p>完成后的模样：<br><br>只是非常简单的一个小修改，希望能给不知如何整合Disqus的朋友一点思路。</p>
