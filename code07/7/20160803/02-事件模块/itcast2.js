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

















    }())







})(window);