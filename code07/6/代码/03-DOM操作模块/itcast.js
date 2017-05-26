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
            //为了防止下面的代码出错
            if( selector == undefined ) return this;

            //a、删除当前对象中原有的DOM元素，如果原来没有，这一步不会产生任何作用
            splice.call(this,0,this.length);

            if(itcast.isString(selector)){
                //判断selector是不是一段HTML字符串
                if(selector.charAt(0)==="<" && selector.charAt(selector.length-1)===">" && selector.length>=3){
                    //创建一个div容器
                    var div=document.createElement("div");
                    //设置div容器的内容
                    div.innerHTML=selector;//这段代码之后div就拥有了一些子节点
                    //遍历div的子节点
                    push.apply(this,div.childNodes);
                    // for (var i = 0; i < div.childNodes.length; i++) {
                    //     var childNode = div.childNodes[i];
                    //     push.call(this,childNode);
                    // }

                }else{//selector是一个选择器
                    //b、通过选择器模块来获取DOM元素
                    var doms=select(selector,context);
                    //c、把doms遍历添加到当前对象中
                    push.apply(this,doms); // { 0:body标签,1:title标签,length:2 }
                }


            }else if(selector.nodeType){//参数selector是一个DOM元素
                push.call(this,selector);//{ 0:body,length:1 }
            }else if(selector instanceof  itcast){ //selector是一个init类型的对象
                return selector;
            }

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
        trim:function(str){
            if(!itcast.isString(str)) throw new Error("参数不是一个合法的字符串");
            return String.prototype.trim?str.trim():str.replace(/^\s+/,"").replace(/\s+$/,"");
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
    //$("body").each(function(){})
    //{0:body,length:1}
    //itcast原型中的each方法
    itcast.fn.extend({
        //遍历当前对象的每一个DOM元素
        each:function(callback){
            itcast.each(this,callback);
            //实现链式编程
            return this;
        }
    });//相当于itcast.fn.each=function(){}

    //======================CSS模块
    itcast.fn.extend({
        //获取单个样式：$("body").css("fontSize")
        //设置单个样式：$("div").css("color","red")
        //设置多个样式：$("p").css({color:"blue",backgroundColor:"pink"})
        css:function(){
            //参数个数为0：不做任何操作，直接返回this
            if(arguments.length===0) return this;
            var arg0=arguments[0];
            var arg1=arguments[1];
            //参数个数为1：
            if(arguments.length===1){
                //再次判断参数的类型
                if(itcast.isString(arg0)){
                    //获取第一个DOM元素的单个样式
                    var firstDom=this[0];
                    if(!firstDom) return "";

                    //判断浏览器兼容性：能力检测
                    if(window.getComputedStyle){
                        return window.getComputedStyle(firstDom,null)[arg0];
                    }else{
                        return firstDom.currentStyle[arg0];
                    }
                }else{
                    //设置多个样式：三要素：dom元素 样式的名称 样式的值-->dom.style.样式名称=样式的值
                    this.each(function(){
                        //this:dom元素
                        var dom=this;
                        itcast.each(arg0,function(key,value){
                            dom.style[key]=value;
                        });
                    });
                    return this;

                }
            }else{
                //设置单个样式
                this.each(function(){
                    //this:dom元素
                    this.style[arg0]=arg1;
                });
                return this;
            }
        },
        show:function(){
            return this.css("display","block");
        },
        hide:function(){
            return this.css("display","none");
        },
        //功能：判断对象中每一个DOM元素是否隐藏，
        //          如果该元素是隐藏的，就显示出来，如果该元素是显示的，就隐藏起来
        toggle:function(){
            this.each(function(){
                //this:DOM元素

                //保存init类型的对象，方便后续的调用
                var $this=itcast(this);

                //判断DOM元素是隐藏的吗？
                if($this.css("display")==="none"){
                    $this.show();
                }else{
                    $this.hide();
                }
            });
            return this;
        }
    });

    //======================属性操作模块
    itcast.fn.extend({
        //功能1：获取单个属性
        //功能2：设置单个属性
        //功能3：设置多个属性
        attr:function(){
            //参数个数为0，什么都不用做
            if(arguments.length===0) return this;
            //判断参数的个数为1，参数为字符串：获取(第一个DOM元素的)单个属性
            var arg0=arguments[0];
            if(arguments.length===1 && itcast.isString(arg0)){
                //获取第一个DOM元素
                var firstDom=this[0];
                //返回firstDom的指定属性（属性名称为arg0）的值
                return firstDom.getAttribute(arg0);
            }else if(arguments.length ===1){ //参数个数为1，但是arg0不是一个字符串,arg0当成普通对象来处理
                //参数个数为1，并且参数是其他情况（当成普通对象来处理），设置多个属性
                //设置属性三要素：DOM元素、属性名称、属性值
                this.each(function(){
                    //this:DOM元素
                    var dom=this;

                    itcast.each(arg0,function(key,value){
                        dom.setAttribute(key,value);
                    });

                });
                return this;
            }else{
                //属性的值：attr方法的第二个实参
                var arg1=arguments[1];
                //参数个数>1，实现设置单个属性的功能
                this.each(function(){
                    //this:DOM元素
                    //属性名称：attr方法的第一个实参——>arg0

                    //设置DOM元素的指定属性
                    this.setAttribute(arg0,arg1);

                });
                return this;
            }
        },

        //功能：删除1个或者多个属性 $("body").removeAttr("a","b","c")
        removeAttr:function(){
            //dom.removeAttribute(属性名称)
            //arguments存储需要删除的属性
            var args=arguments;

            this.each(function(){
                //this:DOM元素
                var dom=this;

                //value表示每一个属性的名称，比如"a","b","c"
                itcast.each(args,function(index,value){
                    dom.removeAttribute(value);
                });
            });
            return this;
        },

        //判断当前对象的DOM元素是否存在className这个类名
        //只要当前对象有一个DOM元素存在这个类名，就返回true，一个都不存在，就返回false
        hasClass:function(className){
            var isExist=false;
            this.each(function(){
                //this:DOM元素
                var domClassNameChange=" "+this.className+" ";
                var classNameChange=" "+className+" ";
                if(domClassNameChange.indexOf(classNameChange)>-1){
                    isExist=true;
                    //终止遍历
                    return false;
                }
            });
            return isExist;
        },

        //功能：添加一个或者多个类名 $("body").addClass("a b c")
        //举例：body本身具有a c这两个类名，通过 $("body").addClass("a b c")
        //添加结果：body具有3个类名，分别是：a c b
        addClass:function(){
            if(arguments.length===0) return this;
            //1、获取参数
            var paramClassName=arguments[0];
            if(!itcast.isString(paramClassName)){
                throw new Error("参数必须是一个字符串");
            }

            //2、遍历init类型的对象里面的DOM元素
            this.each(function(){
                //this-->DOM元素
                var dom=this;

                //3、分割paramClassName变成数组，并遍历其中的每一个元素（类名）
                itcast.each(paramClassName.split(" "),function(i,className){
                    //4、判断DOM元素是否存在某个类名
                    var isExist=itcast(dom).hasClass(className);
                    if(!isExist){
                        //5、拼接DOM元素的原来的class属性的值+新的类名
                        dom.className=dom.className+" "+className;
                        //结果如下："context context2"+" "+"a"-->"context context2 a"
                    }
                });
                dom.className=dom.className.trim();

            });
            //实现链式编程
            return this;
        },

        //功能：删除一个或者多个类名 $("body").removeClass("a b c")
        //不传参：删除DOM元素的全部类名
        //举例：$("body").removeClass("a b c")中如果body本身具有类名"a d"，
        //结果：body元素上面具有类名：d
        //----->做法：修改dom元素的class属性的值，" a d "
        //----------->查找修改后的class属性的值类名" a "的位置，将其替换为单个空格
        removeClass:function(){
            if(arguments.length === 0){
                //删除全部类名
                return this.each(function(){
                    this.className="";//将DOM元素的类名置空
                });
            }
            //获取参数：即将需要删除的一个或者多个类名
            var paramClassName=arguments[0];
            //判断参数的类型
            if(!itcast.isString(paramClassName)) throw new Error("参数必须是字符串类型");

            //遍历init类型的对象的每一个DOM元素
            return this.each(function(){
                var dom=this;//"a d c"
                var domClassNameChange=" "+dom.className+" ";//" a d c "
                //分割paramClassName
                itcast.each(paramClassName.split(" "),function(i,className){//"a b d"
                    //判断dom元素是否含有指定的类名
                    if(itcast(dom).hasClass(className)){
                        var classNameChange=" "+className+" ";
                        //替换domClassNameChange里面的classNameChange为空格
                        domClassNameChange=domClassNameChange.replace(classNameChange," ");
                    }
                });
                //重新设置dom元素的class属性的值为domClassNameChange
                dom.className=domClassNameChange;
            });
        },

        //功能：切换DOM元素的类名
        //详细的功能：对init类型的对象中每一个DOM元素判断是否具有指定的类名，
        //                                  如果有，则移除，如果没有，则添加
        //举例说明：$("body").toggleClass("c")--->原来body标签具有a c 类名--->结果："a"
        //$("body").toggleClass("d")--->原来body标签具有a c 类名——>结果："a c d"
        toggleClass:function(className){
            if(arguments.length ===0) return this;

            if(!itcast.isString(className)){
                throw new Error("参数必须是字符串类型");
            }
            //遍历init类型的对象中每一个DOM元素
            return this.each(function(){
                var $dom=itcast(this);
                if($dom.hasClass(className)){
                    $dom.removeClass(className);
                }else{
                    $dom.addClass(className);
                }
            });
            //return this;
        }
    });

    //暴露入口函数
    window.$=window.itcast=itcast;
}(window));