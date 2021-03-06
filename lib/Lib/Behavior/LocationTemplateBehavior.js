/**
 * 定位模版的行为
 * @return {[type]} [description]
 */

module.exports = Behavior(function(){
    "use strict";
    return {
        run: function(templateFile){
            if (!isFile(templateFile)) {
                return this.parseTemplateFile(templateFile);
            }
        },
        /**
         * 解析模版文件
         * @param  {[type]} templateFile [description]
         * @return {[type]}              [description]
         */
        parseTemplateFile: function(templateFile){
            templateFile = templateFile || "";
            if (!templateFile) {
                templateFile = [
                    VIEW_PATH, "/", this.http.group, "/",
                    this.http.controller.toLowerCase(),
                    C('tpl_file_depr'),
                    this.http.action.toLowerCase(),
                    C('tpl_file_suffix')
                ].join("");
            }else if(templateFile.indexOf('/') > -1){
                //自动追加VIEW_PATH前缀
                if (templateFile.indexOf('/') !== 0) {
                    templateFile = VIEW_PATH + "/" + templateFile;
                }
            }else if(templateFile.indexOf(C('tpl_file_suffix')) === -1){
                var path = templateFile.split(":");
                var action = path.pop();
                var controller = path.pop() || this.http.controller.toLowerCase();
                var group = ucfirst(path.pop()) || this.http.group;
                templateFile = [
                    VIEW_PATH, "/", group, "/",
                    controller, 
                    C('tpl_file_depr'),
                    action,
                    C('tpl_file_suffix')
                ].join("");
            }
            if (!isFile(templateFile)) {
                console.log(templateFile + " is not exist", this.http);
                return false;
            }
            return templateFile;
        }
    };
});