/**
 * 
 * Author:成先程
 * Date:2016.7.28
 */

(function(window) {
    //选择器模块
    var select=(function(){
        /**
         * 根据id名称获取元素
         * @param idName id名称
         * @param context 查询context下面的指定idName的元素
         * @return 返回一个DOM元素，或者返回null
         */
        function getId(idName,context){
            var tag=document.getElementById(idName);
            //判断如果context就是document对象，那么也是直接返回结果
            if( context === window.document ) return tag;

            //判断tag是否存在于context的下级，或者下下级。。。。。。
            var parent=tag.parentNode;
            while(parent){
                if(parent === context){
                    return tag;
                }
                parent=parent.parentNode;
            }
            return null;
        }

        //get(".c1")-->getClasses("c1",document)
        /**
         * 根据类名获取元素
         * @param className
         * @param context
         * @returns {*}
         */
        function getClasses(className,context){
            if(document.getElementsByClassName){
                return context.getElementsByClassName(className);
            }else{
                var result=[];
                //1、获取页面中所有的标签 or context下面的所有的标签
                var tags=context.getElementsByTagName("*");
                //2、遍历tags
                for (var i = 0; i < tags.length; i++) {
                    var tag = tags[i];
                    //3、判断tag的class属性值是否包含参数className
                    var tagClassNameChange=" "+tag.className+" ";
                    var classNameChange=" "+className+" ";
                    if(tagClassNameChange.indexOf(classNameChange)>=0){
                        //4、把tag添加到结果数组中
                        result.push(tag);
                    }

                }
                //5、返回结果数组
                return result;
            }
        }

        /**
         * 根据标签名称获取元素
         * @param tagName
         * @param context
         * @returns {NodeList|*}
         */
        function getTags(tagName,context){
            return context.getElementsByTagName(tagName);
        }

        /**
         * 根据单个选择器获取元素
         * @param selector id选择器(如:"#context") or class选择器(如：".c2") or 标签选择器(如："div")
         * @param context DOM元素 or DOM数组 or 选择器
         */
        function get(selector,context){
            //1、声明一个结果数组
            var result=[];
            //2、一个正则表达式，匹配三种选择器
            var reg=/^(?:#(\w+)|\.(\w+)|(\w+|\*))$/;
            //3、将参数selector用reg匹配一下
            var regResult=reg.exec(selector);
            //4、判断context的类型
            if(!context){
                context=[document];
            }else if(context.nodeType){
                context=[context];
            }else if(typeof context === "string"){
                context=get(context);
            }

            //5、遍历context
            for (var i = 0; i < context.length; i++) {
                var singleContext = context[i];
                //6、将选择器名称以及singleContext传入getId getClasses getTags函数获取元素
                var tempResult;
                if(tempResult=regResult[1]){
                    var idResult=getId(tempResult,singleContext);
                    if(idResult != null){
                        result.push(idResult);
                    }
                }else if(tempResult = regResult[2]){
                    //返回结果是一个DOM数组，或者伪数组
                    var classResult=getClasses(tempResult,singleContext);
                    //将classResult里面包含的每一个DOM元素添加到结果数组中
                    result.push.apply(result,classResult);
                }else if(tempResult = regResult[3]){
                    var tagResult=getTags(tempResult,singleContext);
                    result.push.apply(result,tagResult);
                }

            }
            //6、返回结果数组
            return result;
        }

        /**
         * 按照分组选择器获取元素
         * @param selector 分组选择器，格式如："div,input" or "p,#content"
         * @param context
         */
        function $group(selector,context){
            var result=[];
            if(typeof selector === "string"){
                var groups=selector.split(",");
                for (var i = 0; i < groups.length; i++) {
                    var group = groups[i];
                    //下面的代码产生一个DOM数组
                    var groupResult=get(group,context);
                    //将groupResult里面的每一个DOM元素添加到result中
                    result.push.apply(result,groupResult);
                }
            }
            return result;

        }

        /**
         * 根据后代选择器获取元素
         * @param selector 后代选择器，格式如："body div" or "div input"
         * @param context
         */
        function $level(selector,context){
            //任何函数的形参都是函数内部的局部变量，言外之意：该参数会自动被声明

            if(typeof selector !=="string") return [];

            var levels=selector.split(" ");//以空格隔开

            for (var i = 0; i < levels.length; i++) {
                var level = levels[i];
                //1、第一次遍历，获取context下面的level元素
                //2、第二次以及后面的遍历，获取上一次遍历的结果下面的level元素
                context=get(level,context);
            }
            return context;
        }

        /**
         * 根据分组+后代选择器来获取元素
         * @param selector 分组+后代选择器，格式："body div,head title,div #c1"
         * @param context
         */
        function $groupAndLevel(selector,context){
            //1、声明一个结果数组
            var result=[];
            //2、判断参数selector是不是一个字符串
            if(typeof selector !== "string") return result;
            //3、将selector用逗号分隔成多个组
            var groups=selector.split(",");
            //4、遍历groups
            for (var i = 0; i < groups.length; i++) {
                //5、每一组（本身也是一个后代选择器）
                var group = groups[i];
                //6、将group传入$level函数获取元素
                var groupResult=$level(group,context);
                //7、将groupResult里面的每一个DOM元素遍历添加到结果数组中
                result.push.apply(result,groupResult);

            }
            //8、返回结果数组
            return result;
        }
        //返回选择器模块的唯一入口函数——>分组+后代选择器：$groupAndLevel
        return $groupAndLevel;
    }());

    /**
     * 框架的入口函数
     * @param {any} selector
     * @param {any} context
     * @returns
     */
    function itcast(selector, context) {
        return new itcast.fn.F(selector, context);
    }
    var arr = [],
        push = arr.push, //保存数组的push方法
        splice = arr.splice; //保存数组的splice方法

    itcast.fn = itcast.prototype = {
        length:0,
        //实现思路：
        // 1、删除原来的DOM元素
        // 2、往新创建的对象 or 调用的对象 插入新的DOM元素
        // 3、返回这个新创建的对象 or 调用的对象
        F: function(selector, context) {
            //删除之前的DOM元素
            splice.call(this, 0, this.length);

            //往当前对象中遍历添加多个DOM元素——>这些DOM元素来源于执行选择器模块的结果

            //apply的参数1：需要往哪个对象中的插入元素
            //       参数2：元素的来源：DOM数组、DOM伪数组({0:div,1:p,length:2})
            push.apply(this, select(selector));
            //相当于：
            //this.push(div)-->this.length=1
            //this.push(p)  -->this.length=2


            // var doms=select(selector);
            // for (var i = 0; i < doms.length; i++) {
            //     this[i]=doms[i];  //{ 0:div }            {0:div,1:p,length:1}
            //     this.length++;    //{ 0:div,length:1}    {0:div,1:p,length:2}
            // }
            

            //返回this对象：1、如果F作为构造函数来执行，那么 return this不会影响原来的结果
            //             2、如果F作为普通函数来执行，那么 return this将会返回调用的对象
            return this;
        },
        css: function() {
            for (var i = 0; i < this.length; i++) {
                var dom = this[i];

            }
            //返回调用的对象，实现链式编程
            return this;
        },
        show: function() {
            //返回调用的对象，实现链式编程
            return this;
        },
        hide: function() {
            //返回调用的对象，实现链式编程
            return this;
        }
    };

    //让F的原型继承自itcast的原型
    itcast.fn.F.prototype = itcast.fn;

    //公开唯一的入口函数：itcast——>将其添加到全局变量中
    window.$ = window.itcast = itcast;

}(window));