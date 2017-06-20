(function(window) {


    var select = (function () {

        function getId(idName,context) {
            var tag = document.getElementById(idName);
            if(context === window.document) return tag;
            var parent = tag.parentNode;
            while(parent){
                if(parent === context){
                    return tag;
                }
                parent = tag.parentNode;
            }
            return null;
        }

        function getClasses(className,context) {
            if(document.getElementsByClassName){
                return context.getElementsByClassName(className);
            }else{
                var result = [];
                var tags = document.getElementsByTagName('*');
                for(var i =0;i<tags.length;i++){
                    var tag = tags[i];
                    var tagClassNameChange = " " + tag.className + " ";
                    var classNameChange = " " + className + " ";
                    if(tagClassNameChange.indexOf(classNameChange)>=0){
                        result.push(tag);
                    }
                }
                return result;
            }
        }

        function getTags(tagName,context) {
            return context.getElementsByTagName(tagName);
        }



        function get(selector,context) {

            var result = [];

            var reg = /^(?:#(\w+)|\.(\w+)|(\w+|\*))/;

            var regResult = reg.exec(selector);

            if(!context){
                context = [document];
            }else if(context.nodeType){
                context = [context]
            }else if(typeof context === 'string'){
                context = get(context);
            }

            for(var i =0;i<context.length;i++){
                var singleContext = context[i];
                var tempResult;
                if(tempResult = regResult[1]){
                    var idResult = getId(tempResult,singleContext);
                    if(idResult!=null){
                        result.push(idResult);
                    }
                }else if(tempResult = regResult[2]){
                    var classResult = getClasses(tempResult,singleContext);
                    result.push.apply(result,classResult);

                }else if(tempResult = regResult[3]){
                    var tagResult = getTags(tempResult,singleContext);
                    result.push.apply(result,tagResult);
                }

            }
            return result;
        }

        function $group(selector,context) {
            var result = [];
            if(typeof selector ==="string"){
                var groups = selector.split(',');
                for(var i=0;i<groups.length;i++){
                 var group = groups[i];
                 var groupResult = get(group,context);
                 result.push.apply(result,groupResult);
                }
            }
            return result;
        }

        function $level(selector,context) {

            if(typeof selector !== 'string') return [];

            var levels = selector.split(' ');

            for(var i =0;i<levels.length;i++){

                var level = levels[i];

                context = get(level,context);

            }

            return context;

        }

        function $groupAndLevel(selector,context) {

            var result = [];

            if(typeof selector !== 'string') return result;

            var groups = selector.split(',');

            for(var i=0;i<groups.length;i++){

                var group = groups[i];

                var groupResult = $level(group,context);

                result.push.apply(result,groupResult);

            }

            return result;
        }

        return $groupAndLevel;

    }())

    var arr = [],splice = arr.splice,push = arr.push;
    function itcast(selector,context) {
        return new itcast.fn.init(selector,context)
    }

    itcast.fn = itcast.prototype = {
      construct:itcast,
        init:function (selector,context) {
          if(selector == undefined) return this;
          splice.call(this,0,this.length);
          if(itcast.isString(selector)){
              if(selector.charAt(0)==="<" && selector.charAt(selector.length-1)===">" && selector.length>=3){
                  var div = document.createElement('div');
                  div.innerHTML = selector;
                  push.apply(this,div.childNodes);
              }
              else{
                  var doms = select(selector,context);
                  push.apply(this,doms);
              }
          }else if(selector.nodeType){

              push.call(this,selector);

          }else if(selector instanceof itcast){

              return selector
          }

          return this;

        }


    };

    itcast.fn.init.prototype = itcast.fn;

    itcast.extend = itcast.fn.extend = function () {

        var target,sources = [];

        if(arguments.length === 0)return this;

        if(arguments.length=== 1){
            target = this;
            sources.push(arguments[0]);
        }else{
            target = arguments[0];
            sources.push.apply(sources,arguments);
            sources.splice(0,1);
        }

        for(var i=0;i<sources.length;i++){

            var source = sources[i];

            for(var key in source){
                target[key] = source[key];
            }

        }
            return target;
    }






})(window);