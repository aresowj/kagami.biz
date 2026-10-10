---
title: "关于生成质数 (Prime Number) 的思路"
description: "最近在学习MIT的在线计算机科学入门课程，碰到了生成质数的问题。所谓的质数，就是在大于1的正整数中，因数只有1和其本身的整数。比如2，3，5……。第一反应之下，我只想到最笨的办法： def genPrimesDirectly(): '''Generate Prime Numbers using Python generator. It is the worst economic method I ..."
date: "2015-08-09T23:19:25+00:00"
updated: "2022-01-13T04:52:43+00:00"
routeSlug: "2015-08-10-how-to-generate-prime-number"
url: "/2015/08/10/how-to-generate-prime-number/"
categories: ["未分类"]
tags: ["算法","质数"]
cover: "/wp-content/uploads/2015/08/oqaaamq7u67pv8k_vp7upvjxendnj_h7kdt6bkzfbh75euvikjjoevybbesq4kr72tv2m1h3x9ktmzhslqyi-xbpxc8a15jojl4byetggk6hvvmcrhy5d6r0ydsl-1.gif"
---
<p>最近在学习MIT的在线计算机科学入门课程，碰到了生成质数的问题。<br>所谓的质数，就是在大于1的正整数中，因数只有1和其本身的整数。比如2，3，5……。<br>第一反应之下，我只想到最笨的办法：</p>



<pre class="wp-block-preformatted EnlighterJSRAW">def genPrimesDirectly():
  '''Generate Prime Numbers using Python generator.
    It is the worst economic method I can think of. The complexity should be O(nlog(n))
    Written by aresowj on 08/09/2015'''
  n = 2		#First number
  yield n
  while True:
    n += 1						#Start from 3
    for i in range(2, n):		#Calculates every number from 2 to n-1 to confirm if any factor of n
      if n % i == 0:
        break
      elif i == n - 1:		#If i is the last number in the sequence and i is not a factor of n, n is a prime number. Then yield it.
        yield n</pre>



<p>能够改进的地方还是有的，那就是缩小在判断每一个数字时用来求余的范围。在笨办法里，程序将用 [2, n-1] 这个区间里的每个数对n求余，如果发现n能够被区间内的某个数除尽，则判断n不是质数，从而跳到下一个n的判断中。<br>然而，实际上我们只需要在[2, sqrt(n)]这个范围内进行判断就好了。其原因在于，因数都是成对出现的，比如100的因数有1和100，2和50，4和25……10和10。可以看出，成对的因数会逐渐地互相“靠近”，并且总有一个因数小于等于该数的平方根，另一个因数大于等于该数的平方根。</p>







<pre class="wp-block-preformatted EnlighterJSRAW">import math
def genPrimesModified():
  '''Generate Prime Numbers using Python generator.
    Instead of looping from 2 to n, the better way is to set the end point at sqrt(n). The complexity should be O(n(log(logn)))
    Written by aresowj on 08/09/2015'''
  n = 2		#First number
  yield n
  n = 3		#Second number
  yield n
  while True:
    n += 1				#We would like to start from number 4 because number 3 will not trigger the for loop and will be ingnored.
    for i in range(2, int(math.sqrt(n))+1):
      if n % i == 0:
        break		#Stop this for loop and turn back to the outer while loop when a number was found to be a factor of n.
      elif i == int(math.sqrt(n)):
        yield n		#If i is the last number in the sequence and i is not a factor of n, n is a prime number. Then yield it.</pre>



<p>如果要再进一步优化，就将用于判断的数限定在已经求出的质数里，结束点同样是sqrt(n)。下列代码引用自MIT的在线慕课MITx: 6.00.1x Introduction to Computer Science and Programming Using Python。</p>



<pre class="wp-block-preformatted EnlighterJSRAW">'''
Referred from MITx: 6.00.1x Introduction to Computer Science and Programming Using Python, Lecture 12
URL: https://courses.edx.org/courses/course-v1:MITx+6.00.1x_6+2T2015/courseware/Week_6/videosequence:Lecture_11/
'''
# Note that our solution makes use of the for/else clause, which
# you can read more about here:
# http://docs.python.org/release/1.5/tut/node23.html
def genPrimes():
    primes = []   # primes generated so far
    last = 1      # last number tried
    while True:
        last += 1
        for p in primes:
            if last % p == 0:
                break
        else:
            primes.append(last)
            yield last</pre>



<p>我又想起来，之前好像在哪看过一个“筛选法”，是用排除的办法来选出质数。思路如下：</p>



<ol class="wp-block-list">
<li>确定要求质数的范围，比如[2, 100]；</li>
<li>从最小的质数2开始，将范围中2的倍数全部剔除，然后将下一个整数的倍数也都剔除；</li>
<li>如此循环下去，剩下的就全是质数了。</li>
</ol>



<div class="wp-block-image"><figure class="aligncenter"><a href="/how-to-generate-prime-number/oqaaamq7u67pv8k_vp7upvjxendnj_h7kdt6bkzfbh75euvikjjoevybbesq4kr72tv2m1h3x9ktmzhslqyi-xbpxc8a15jojl4byetggk6hvvmcrhy5d6r0ydsl/"><img   width="445" height="369" src="/wp-content/uploads/2015/08/oqaaamq7u67pv8k_vp7upvjxendnj_h7kdt6bkzfbh75euvikjjoevybbesq4kr72tv2m1h3x9ktmzhslqyi-xbpxc8a15jojl4byetggk6hvvmcrhy5d6r0ydsl-1.gif" alt="Find prime numbers" class="wp-image-591"></a></figure></div>



<p>可以用一张动画来形象地表示这个过程：<br><br>&nbsp;<br>然而，这个办法主要针对于已经确定了求值范围的情况。如果要写出一个更有效的可以不断生成新质数的函数，就应该在上述代码的基础上改进一下。各位可以参考一下廖雪峰老师在其Python 3教程使用filter函数实现的办法：<a href="http://www.liaoxuefeng.com/wiki/0014316089557264a6b348958f449949df42a6d3a2e542c000/001431821084171d2e0f22e7cc24305ae03aa0214d0ef29000" target="_blank" rel="noopener noreferrer">filter &#8211; 廖雪峰的官方网站</a><br>&nbsp;<br>&nbsp;</p>
