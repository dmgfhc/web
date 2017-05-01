/*
 * @Author: zhengwei
 * @Date:   2016-06-26 23:06:58
 * @Last Modified by:   zhengwei
 * @Last Modified time: 2016-06-28 09:19:39
 */

'use strict';
$(function() {
    // 轮播图大图小图切换
    // 判断屏幕宽度是否是小屏幕
    // 1.获取屏幕宽度
    // 2.定义一个小屏幕的标准(这个标准就参照bootstrap的xs)
    //获取轮播图元素
    //如果是小屏幕设置小屏幕 如果是大屏幕设置大屏幕
    //获取屏幕宽度

    //直接获取的话只能获取一次 如果窗口拉伸就无法重新获取
    //那么如果我们能每次窗口拉伸都获取一下屏幕宽度就可以了
    //那么怎么让每次窗口拉伸都获取呢
    //有一个窗口大小变化事件resize
    //定义一个小屏幕标准
    var isSmall = 768;
    var windowWidth;
    var slideBox = $('#slide_home .carousel-inner div');
    $(window).on('resize', function() {
        windowWidth = $(window).width();
        if (windowWidth < isSmall) {
            //是小屏幕 设置小图
            //得设置那就得获取轮播图元素
            slideBox.each(function(i, e) {
                // 设置小图
                // 这样写会有什么问题 
                // 万一下次图片要改的话这个js是不是得该
                //  那么这样的可维护性就不太好
                //  所以我们用另外一张方式动态的获取大图小图设置到元素上
                //  那么怎么获取大图和小图
                //  就引入到了我们的一个自定义属性 data-属性
                //  我们可不可以把大图和小图都分别装在轮播图的标签上
                //  如果后面图片改了的话只要改html就好了
                //  这样让美工去维护前台html页面就好
                //  或者说我们的图片如果在后台服务器里服务器里面修改了
                //  前台对应的就自然修改了这样我们的JS文件也不需要更改
                //  那么接下来我们来定义一下我们的自定义属性
                //  那么怎么获取自定义属性
                //jquery有一个data()方法可以获取自定义属性
                var imageSrc = $(this).data('image-small');
                // console.log(imageSrc);
                // $(this).css("background-image", "url(" + imageSrc + ")");
                //如果是小图就直接设置图片标签更清楚一些也能自动适应
                $(this).html('<img src=' + imageSrc + ' alt="" />');
            });
        } else {
            //大屏幕设置大图
            slideBox.each(function(i, e) {
                // 设置大图
                var imageSrc = $(this).data('image-large');
                // console.log(imageSrc);
                $(this).css("background-image", "url(" + imageSrc + ")");
                $(this).html("");
            });
        }
    }).trigger('resize');
    //那么手机端的轮播图通常还有滑动那么怎么实现轮播图可以左右滑动呢
    //1.首先要滑动切换轮播图得能让轮播图元素支持滑动吧
    //2.然后判断他是往左滑还是往右滑
    //3.往左滑是不是要切换到下一张
    //4.往右滑是不是要切换到上一张
    //5.那么大家想一下怎么让他切换到下一张或者上一张
    //6.是不是他页面上那左右两个按钮可以切换到上一张或者下一张
    //7.那么我们判断是左滑还是右滑触发那两个标签点击事件是不是一种方式
    //8.这样也可以,那么我这呢教大家一种新的方式
    //9.看到Bootstrap轮播图插件的介绍下面是不是有一些JS方法
    //10.可以触发他切换到上一张或者下一张
    //注册滑动事件
    //获取轮播图的父元素
    var startX = 0; //滑动开始的位置
    var moveX = 0; //滑动结束的位置
    var slideHome = document.querySelector('#slide_home');
    var bufferX = 50; //缓冲区距离
    var isMove = false;
    slideHome.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        //这能获取到我们开始滑动时候的位置
        //那么我们再记录一下他滑动结束的位置
        //然后用结束减去开始滑动位置是不是可以求得滑动的距离啊

    });
    slideHome.addEventListener('touchmove', function(e) {
        moveX = e.touches[0].clientX;
        //这是不是有啊 但是太多了我们要的是他最终那个move的位置吧
        //那么我们可不可以在这里记录一下他滑动中的时候的位置
        //在滑动结束的时候是不是就是滑动结束的最终位置
        isMove = true;
    });
    slideHome.addEventListener('touchend', function(e) {
        // console.log(e.touches[0].clientX);
        //结束的时候一瞬间滑动都结束了
        //这touches滑动对象就不存在了
        //那么我们的想法是不是就破灭了
        //没法获取到滑动结束那一瞬间的距离
        //之前是不是给大家说过有3个滑动事件还有一个touchmove
        //那我们看一看他那里有没有       
        console.log((moveX - startX));
        //那么这时候我们是不是可以求得他滑动的距离
        //如果往左滑是负值 往右滑是正值
        //那么我们判断一下他是正值还是负值然后给他设置一下
        //切换到上一张或者是下一张是不是就行了
        //往左滑 
        // if (moveX - startX < 0) {
        //     //切换到下一张
        //     //怎么切换到上一张下一张呢
        //     //我们是不是可以调用一下官方提示的方法
        //     $('#slide_home .carousel').carousel('next');
        // } else if (moveX - startX > 0) {
        //     //切换到上一张
        //     $('#slide_home .carousel').carousel('prev');
        // }
        //那这样直接判断有什么问题
        //如果他滑动的距离很小本来人家不想滑动的
        //是不是也有那么几像素的变化啊
        //那么我们是不是应该判断一下如果有一定距离才叫滑动
        //那么我们定义一个缓冲距离
        //如果滑动距离超过这个值认为才是滑动了
        //再进行判断是往左还是往右滑 
        //判断滑动的距离大于缓冲区的距离 这样的话如果往左滑是负值
        //负值是不是不可能大于正值啊那么我们这里要加什么 是不是绝对值
        //如果没有触摸的话 触摸的moveX的值就为0 那么 0 -startX的值就有不太合理
        //所以我们定义一个是否滑动的变量如果滑动了才进行判断
        if (Math.abs(moveX - startX) > bufferX && isMove) {
            if (moveX - startX < 0) {
                //切换到下一张
                //怎么切换到上一张下一张呢
                //我们是不是可以调用一下官方提示的方法
                $('#slide_home .carousel').carousel('next');
            } else if (moveX - startX > 0) {
                //切换到上一张
                $('#slide_home .carousel').carousel('prev');
            }
        }
    });
    if (windowWidth < isSmall) {
        //获取产品推荐下的ul里面的所有Li
        var lis = $('.ul-wapper .nav-tabs li');
        var ulWidth = 20;
        lis.each(function(index, el) {
            ulWidth += $(this).width();
        });
        //给ul设置宽度
        $('.ul-wapper .nav-tabs').css('width', ulWidth);
    }

    $('[data-toggle="tooltip"]').tooltip();
});
