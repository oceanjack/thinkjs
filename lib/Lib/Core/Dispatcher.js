/**
 * 路由识别
 * @type {Object}
 */
var Dispatcher = module.exports = Class(function(){
    "use strict";
    return {
        init: function(http){
            this.http = http;
        },
        /**
         * 解析pathname
         * @return {[type]} [description]
         */
        parsePathName: function(){
            var pathname = this.http.pathname.split("/").filter(function(item){
                return item.trim();
            }).join("/");
            //去除pathname前缀
            var prefix = C('url_pathname_prefix');
            if (prefix && pathname.indexOf(prefix) === 0) {
                pathname = pathname.substr(prefix.length);
            }
            //判断URL后缀
            var suffix = C('url_pathname_suffix');
            if (suffix && pathname.substr(0 - suffix.length) === suffix) {
                pathname = pathname.substr(0, pathname.length - suffix.length);
            }
            this.http.pathname = pathname;
        },
        run: function(){
            var self = this;
            return self.resourceCheck().then(function(){
                self.parsePathName();
                return tag("path_info", self.http);
            }).then(function(){
                return self.routeCheck();
            }).then(function(flag){
                //已经是自定义路由
                if (flag) {
                    return true;
                }
                var paths = self.http.pathname.split("/");
                //将group list变为小写
                var groupList = C('app_group_list').map(function(item){
                    return item.toLowerCase();
                });
                var group = "";
                if (groupList.length && paths[0] && groupList.indexOf(paths[0].toLowerCase()) > -1) {
                    group = paths.shift();
                }
                var controller = paths.shift();
                var action = paths.shift();
                //解析剩余path的参数
                if (paths.length) {
                    for(var i = 0,length = Math.ceil(paths.length) / 2; i < length; i++){
                        self.http.get[paths[i * 2]] = paths[i * 2 + 1] || "";
                    }
                }
                self.http.group = Dispatcher.getGroup(group);
                self.http.controller = Dispatcher.getController(controller);
                self.http.action = Dispatcher.getAction(action);
            });
        },
        /**
         * 自定义路由检测
         * @return {[type]} [description]
         */
        routeCheck: function(){
            return tag('route_check', this.http);
        },
        /**
         * 静态资源类请求
         * @return {[type]} [description]
         */
        resourceCheck: function(){
            return tag('resource_check', this.http);
        }
    };
});

/**
 * 获取group
 * @param  {[type]} group [description]
 * @return {[type]}       [description]
 */
Dispatcher.getGroup = function(group){
    "use strict";
    group = group || C('default_group');
    return ucfirst(group);
};
/**
 * 获取controller
 * @param  {[type]} controller [description]
 * @return {[type]}            [description]
 */
Dispatcher.getController = function(controller){
    "use strict";
    controller = controller || C('default_controller');
    return ucfirst(controller);
};
/**
 * 获取action
 * @param  {[type]} action [description]
 * @return {[type]}        [description]
 */
Dispatcher.getAction = function(action){
    "use strict";
    action = action || C('default_action');
    return action;
};