/**
 *
 * Created by ChengXiancheng on 2016/7/31.
 */
(function(window){
    //选择器模块
    var select = (function () {
        /**
         * 根据id名称获取元素
         * @param idName id名称
         * @param context 查询context下面的指定idName的元素
         * @return 返回一个DOM元素，或者返回null
         */
        function getId(idName, context) {
            var tag = document.getElementById(idName);
            //判断如果context就是document对象，那么也是直接返回结果
            if (context === window.document) return tag;

            //判断tag是否存在于context的下级，或者下下级。。。。。。
            var parent = tag.parentNode;
            while (parent) {
                if (parent === context) {
                    return tag;
                }
                parent = parent.parentNode;
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
        function getClasses(className, context) {
            if (document.getElementsByClassName) {
                return context.getElementsByClassName(className);
            } else {
                var result = [];
                //1、获取页面中所有的标签 or context下面的所有的标签
                var tags = context.getElementsByTagName("*");
                //2、遍历tags
                for (var i = 0; i < tags.length; i++) {
                    var tag = tags[i];
                    //3、判断tag的class属性值是否包含参数className
                    var tagClassNameChange = " " + tag.className + " ";
                    var classNameChange = " " + className + " ";
                    if (tagClassNameChange.indexOf(classNameChange) >= 0) {
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
        function getTags(tagName, context) {
            return context.getElementsByTagName(tagName);
        }

        /**
         * 根据单个选择器获取元素
         * @param selector id选择器(如:"#context") or class选择器(如：".c2") or 标签选择器(如："div")
         * @param context DOM元素 or DOM数组 or 选择器
         */
        function get(selector, context) {
            //1、声明一个结果数组
            var result = [];
            //2、一个正则表达式，匹配三种选择器
            var reg = /^(?:#(\w+)|\.(\w+)|(\w+|\*))$/;
            //3、将参数selector用reg匹配一下
            var regResult = reg.exec(selector);
            //4、判断context的类型
            if (!context) {
                context = [document];
            } else if (context.nodeType) {
                context = [context];
            } else if (typeof context === "string") {
                context = get(context);
            }

            //5、遍历context
            for (var i = 0; i < context.length; i++) {
                var singleContext = context[i];
                //6、将选择器名称以及singleContext传入getId getClasses getTags函数获取元素
                var tempResult;
                if (tempResult = regResult[1]) {
                    var idResult = getId(tempResult, singleContext);
                    if (idResult != null) {
                        result.push(idResult);
                    }
                } else if (tempResult = regResult[2]) {
                    //返回结果是一个DOM数组，或者伪数组
                    var classResult = getClasses(tempResult, singleContext);
                    //将classResult里面包含的每一个DOM元素添加到结果数组中
                    result.push.apply(result, classResult);
                } else if (tempResult = regResult[3]) {
                    var tagResult = getTags(tempResult, singleContext);
                    result.push.apply(result, tagResult);
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
        function $group(selector, context) {
            var result = [];
            if (typeof selector === "string") {
                var groups = selector.split(",");
                for (var i = 0; i < groups.length; i++) {
                    var group = groups[i];
                    //下面的代码产生一个DOM数组
                    var groupResult = get(group, context);
                    //将groupResult里面的每一个DOM元素添加到result中
                    result.push.apply(result, groupResult);
                }
            }
            return result;

        }

        /**
         * 根据后代选择器获取元素
         * @param selector 后代选择器，格式如："body div" or "div input"
         * @param context
         */
        function $level(selector, context) {
            //任何函数的形参都是函数内部的局部变量，言外之意：该参数会自动被声明

            if (typeof selector !== "string") return [];

            var levels = selector.split(" ");//以空格隔开

            for (var i = 0; i < levels.length; i++) {
                var level = levels[i];
                //1、第一次遍历，获取context下面的level元素
                //2、第二次以及后面的遍历，获取上一次遍历的结果下面的level元素
                context = get(level, context);
            }
            return context;
        }

        /**
         * 根据分组+后代选择器来获取元素
         * @param selector 分组+后代选择器，格式："body div,head title,div #c1"
         * @param context
         */
        function $groupAndLevel(selector, context) {
            //1、声明一个结果数组
            var result = [];
            //2、判断参数selector是不是一个字符串
            if (typeof selector !== "string") return result;
            //3、将selector用逗号分隔成多个组
            var groups = selector.split(",");
            //4、遍历groups
            for (var i = 0; i < groups.length; i++) {
                //5、每一组（本身也是一个后代选择器）
                var group = groups[i];
                //6、将group传入$level函数获取元素
                var groupResult = $level(group, context);
                //7、将groupResult里面的每一个DOM元素遍历添加到结果数组中
                result.push.apply(result, groupResult);

            }
            //8、返回结果数组
            return result;
        }

        //返回选择器模块的唯一入口函数——>分组+后代选择器：$groupAndLevel
        return $groupAndLevel;
    }());

    var arr=[],
        splice=arr.splice,//保存了数组的splice方法
        push=arr.push;

    //入口函数 $("body,title")
    function itcast(selector,context){
        //返回一个init类型的对象
        return new itcast.fn.init(selector,context);
    }
    //itcast的原型
    itcast.fn=itcast.prototype={
        constructor:itcast,
        init:function(selector,context){
            //a、删除当前对象中原有的DOM元素，如果原来没有，这一步不会产生任何作用
            splice.call(this,0,this.length);
            //b、通过选择器模块来获取DOM元素
            var doms=select(selector,context);
            //c、把doms遍历添加到当前对象中
            push.apply(this,doms); // { 0:body标签,1:title标签,length:2 }
            //f、返回当前对象：(new init:返回的就是新创建的对象;f.init()返回的是f )
            return this;
        }
    };
    //让init类型的对象继承自itcast的原型
    itcast.fn.init.prototype=itcast.fn;

    //添加一个extend方法，学习要求：最起码理解其功能
    itcast.extend=itcast.fn.extend=function(){
        var target,sources=[];
        //1、判断参数的个数
        //1.1、参数个数为0，返回当前对象
        if(arguments.length===0) return this;
        //1.2、参数个数为1,功能：将参数对象里面的每一个属性、方法都拷贝到当前对象(this)中
        if(arguments.length ===1){
            //设置目标对象
            target=this;
            //设置源对象
            sources.push(arguments[0]);
        }else{
            //1.3、参数个数>1，功能：将第二个参数及其后面的参数这些对象中的属性、方法，分别拷贝到第一个参数对象中
            //设置目标对象
            target=arguments[0];
            //设置源对象
            sources.push.apply(sources,arguments);
            sources.splice(0,1);
        }
        
        //1.4、遍历sources
        for (var i = 0; i < sources.length; i++) {
            var source = sources[i];//每一个源对象
            for (var key in source) {
                //1.4.1、将source里面的key属性的值拷贝到目标对象中
                target[key]=source[key];
            }
            
        }
        //1.5、返回目标对象
        return target;
    };


    //添加工具类方法是通过extend方法扩展到itcast对象中
    itcast.extend({
        isString:function(str){
            return typeof str === "string";
        },
        isFunction:function(fn){
            return typeof fn === "function";
        },
        isNumberic:function(num){
            return typeof num === "number" && !isNaN(num);
        },
        isArray:function(arr){
            return Array.isArray?
                        Array.isArray(arr):
                        Object.prototype.toString.call(arr)==="[object Array]";
        },
        isLikeArray:function(arr){
            return itcast.isNumberic(arr.length) && arr.length>=0;
        },
        each:function(arr,fn){
            var i,result;
            //1、遍历数组、伪数组
            if(itcast.isLikeArray(arr)){
                for ( i = 0; i < arr.length; i++) {
                    result=fn.call(arr[i],i,arr[i]);
                    if(result === false){
                        break;
                    }
                }
            }else{
                for ( i in arr) {
                    result=fn.call(arr[i],i,arr[i]);
                    if(result=== false){
                        break;
                    }
                }
            }
        }
    });
    //itcast原型中的each方法
    itcast.fn.extend({
        //遍历当前对象的每一个DOM元素
        each:function(callback){
            itcast.each(this,callback);
            //实现链式编程
            return this;
        }
    });//相当于itcast.fn.each=function(){}

    //暴露入口函数
    window.$=window.itcast=itcast;
}(window));