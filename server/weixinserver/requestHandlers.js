/**
 * Date: 2013.04.15
 * requestHandles dispatch.
 */

var requestHandlers = {};
var globaldata = root.globaldata;


var accountManage = require('./handlers/accountManage');
requestHandlers.accountManage = function (request, response, pathObject, data) {
    var operation = pathObject["operation"];
    if (operation == "add") {
        accountManage.add(data, response);
    }
    else if (operation == "exist") {
        accountManage.exist(data, response);
    }
    else if (operation == "auth") {
        accountManage.auth(data, response);
    }
    else if (operation == "modify") {
        accountManage.modify(data, response);
    }
};

var weixinManage = require('./handlers/weixinManage');
requestHandlers.weixinManage = function (request, response, pathObject, data) {
    var operation = pathObject["operation"];
    if (operation == "bindingtoken") {
        weixinManage.bindingtoken(data, response);
    }
    else if (operation == "bindapp") {
        weixinManage.bindapp(data, response);
    }
    else if (operation == "unbindapp") {
        weixinManage.unbindapp(data, response);
    }
    else if (operation == "getall") {
        weixinManage.getall(data, response);
    }
    else if (operation == "getbyid") {
        weixinManage.getbyid(data, response);
    }
    else if (operation == "modify") {
        weixinManage.modify(data, response);
    }
    else if (operation == "modifyrelapro") {
        weixinManage.modifyrelapro(data, response);
    }
};


var userManage = require('./handlers/userManage');
requestHandlers.userManage = function (request, response, pathObject, data) {
    var operation = pathObject["operation"];
    if (operation == "getall") {
        userManage.getall(data, response);
    }
    else if (operation == "modify") {
        userManage.modify(data, response);
    }
    else if (operation == "getbyid") {
        userManage.getbyid(data, response);
    }
};

var applicationManage = require('./handlers/applicationManage');
requestHandlers.applicationManage = function (request, response, pathObject, data) {
    var operation = pathObject["operation"];
    if (operation == "add") {
        applicationManage.add(data, response);
    }
    else if (operation == "modify") {
        applicationManage.modify(data, response);
    }
    else if (operation == "getall") {
        applicationManage.getall(data, response);
    }
    else if (operation == "delete") {
        applicationManage.delete(data, response);
    }
};

var myappManage = require('./handlers/myappManage');
requestHandlers.myappManage = function (request, response, pathObject, data) {
    var operation = pathObject["operation"];
    if (operation == "add") {
        myappManage.add(data, response);
    }
    else if (operation == "getall") {
        myappManage.getall(data, response);
    }
};

module.exports = requestHandlers;