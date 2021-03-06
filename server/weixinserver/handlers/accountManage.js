/**
 * Demo of reading and writing data with neo4j.
 * Date: 2013.04.15
 */

var accountManage = {};

var serverSetting = root.globaldata.serverSetting;

var neo4j = require('neo4j');

var db = new neo4j.GraphDatabase(serverSetting.neo4jUrl);

/***************************************
 *     URL：/api2/account/add
 ***************************************/
accountManage.add = function (data, response) {
    response.asynchronous = 1;
    var accountName = data.accountname;
    var password = data.password;
    var phone = data.phone;
    if("" == accountName || "" == password){
        response.write(JSON.stringify({
            "提示信息": "注册账号失败",
            "reason": "账号信息不能为空"
        }));
       /* if(data.phone==undefined){
            data.phone="123654789";
        }*/
        response.end();
    }
    var account = {
        accountname: accountName,
        phone: phone,
//        email: data.email,
        password: password
    };

    checkAccountNodeExist(account);

    function checkAccountNodeExist(account) {

        var query = [
            'MATCH account:Account',
            'WHERE account.accountname! ={accountname}',
            'RETURN  account'
        ].join('\n');

        var params = {
            accountname: account.accountname
//            phone: account.phone
//            email: account.email
        };

        db.query(query, params, function (error, results) {
            if (error) {
                console.error(error);
            } else if (results.length == 0) {
                createAccountNode(account);
            } else {
                response.write(JSON.stringify({
                    "提示信息": "注册账号失败",
                    "reason": "账号信息已存在"
                }));
                response.end();
            }
        });
    }

    function createAccountNode() {
        var query = [
            'CREATE account:Account{account}',
            'SET account.uid=ID(account)',
            'RETURN  account'
        ].join('\n');

        var params = {
            account: account
        };

        db.query(query, params, function (error, results) {
            if (error) {
                console.error(error);
                return;
            } else {
                var accountNode = results.pop().account;
                response.write(JSON.stringify({
                    "提示信息": "注册账号成功",
                    "uid": accountNode.id,
                    "accountname": accountNode.data.accountname,
                    "accesskey": "123",
                    "PbKey": "123"
                }));
                response.end();
            }

        });
    }
}

/***************************************
 *     URL：/api2/account/exist
 ***************************************/
/*accountManage.exist = function (data, response) {
    response.asynchronous = 1;
    var account = {
        accountname: data.accountname,
        email: data.email
    };

    var type = "账号名";
    var name = account.accountname;
    if (account.accountname != null) {
        type = "账号名";
        name = account.accountname;
        account.email = "unexist email";
    }
    else if (account.email != null) {
        type = "邮箱";
        name = account.email;
        account.accountname = "unexist accountname";
    }

    checkAccountNodeExist();

    function checkAccountNodeExist() {
        var query = [
            'MATCH account:Account',
            'WHERE account.accountname! ={accountname} OR account.email! ={email}',
            'RETURN  account'
        ].join('\n');

        var params = {
            accountname: account.accountname,
            email: account.email
        };

        db.query(query, params, function (error, results) {
            if (error) {
                console.error(error);
                return;
            } else if (results.length == 0) {
                response.write(JSON.stringify({
                    "提示信息": "验证失败",
                    "失败原因": name + type + " ",
                    "status": "failed"
                }));
                response.end();
            } else {
                var accountNode = results.pop().account;
                if (accountNode.data.password == account.password) {
                    response.write(JSON.stringify({
                        "提示信息": "用户名存在",
                        "status": "passed"
                    }));
                    response.end();
                }
            }
        });
    }
}*/


/***************************************
 *     URL：/api2/account/auth
 ***************************************/
accountManage.auth = function (data, response) {
    response.asynchronous = 1;
    var account = {
        "accountname": data.accountname,
        "phone": data.phone,
        "email": data.email,
        "password": data.password
    };

    var type = "账号名";
    var name = account.accountname;
    if (account.accountname != null) {
        type = "账号名";
        name = account.accountname;
        account.phone = "unexist phone";
        account.email = "unexist email";
    }
    else if (account.phone != null) {
        type = "手机";
        name = account.phone;
        account.accountname = "unexist accountname";
        account.email = "unexist email";
    }
    else if (account.email != null) {
        type = "邮箱";
        name = account.email;
        account.accountname = "unexist accountname";
        account.phone = "unexist phone";
    }

    checkAccountNode();

    function checkAccountNode() {
        var query = [
            'MATCH account:Account',
            'WHERE account.accountname! ={accountname} OR account.phone! ={phone} OR account.email! ={email}',
            'RETURN  account'
        ].join('\n');

        var params = {
            accountname: account.accountname,
            phone: account.phone,
            email: account.email
        };

        db.query(query, params, function (error, results) {
            if (error) {
                console.error(error);
                return;
            } else if (results.length == 0) {
                response.write(JSON.stringify({
                    "提示信息": "账号登录失败",
                    "失败原因": name + type + " 邮箱不存在"
                }));
                response.end();
            } else {
                var accountNode = results.pop().account;
                if (accountNode.data.password == account.password) {
                    response.write(JSON.stringify({
                        "提示信息": "账号登录成功",
                        "account":accountNode.data,
                        "uid": accountNode.id,
                        "accountname": accountNode.data.accountname,
                        "accesskey": "123",
                        "PbKey": "123"
                    }));
                    response.end();
                } else {
                    response.write(JSON.stringify({
                        "提示信息": "账号登录失败",
                        "失败原因": "密码不正确"
                    }));
                    response.end();
                }
            }
        });
    }
}

/***************************************
 *     URL：/api2/account/modify
 ***************************************/
accountManage.modify = function (data, response) {
    response.asynchronous = 1;

    var account = {
        uid: data.uid,
        oldpassword: data.oldpassword,
        newpassword: data.newpassword
    };


    modifyAccountNode();

    function modifyAccountNode() {
        var query = [
            'MATCH account:Account',
            'WHERE account.uid! ={uid} AND account.password! ={password}',
            'SET account.password={newpassword}',
            'RETURN  account'
        ].join('\n');

        var uid =  data.uid;
        var params = {
            uid: parseInt(uid),
            password: account.oldpassword,
            newpassword: account.newpassword
        };

        db.query(query, params, function (error, results) {
            if (error) {
                console.error(error);
                return;
         
            } else if (results.length != 0) {
                response.write(JSON.stringify({
                    "提示信息": "修改密码成功"
                }));
                response.end();

            } else {
                response.write(JSON.stringify({
                    "提示信息": "修改密码失败",
                    "失败原因": "原密码不正确"
                }));
                response.end();
            }

        });
    }

}
/***************************************
 *     URL：/api2/account/exist
 ***************************************/
accountManage.exist = function (data, response) {
    response.asynchronous = 1;
    var account = {
        accountname: data.accountname,
        email: data.email
    };

    var type = "邮箱";
    var name = account.accountname;
    if (account.accountname != null) {
        type = "邮箱";
        name = account.accountname;
        account.email = "unexist email";
    }
  /*  else if (account.email != null) {
        type = "昵称";
        name = account.email;
        account.accountname = "unexist accountname";
    }*/

    checkAccountNodeExist();

    function checkAccountNodeExist() {
        var query = [
            'MATCH account:Account',
            'WHERE account.accountname! ={accountname} OR account.email! ={email}',
            'RETURN  account'
        ].join('\n');

        var params = {
            accountname: account.accountname,
            email: account.email
        };

        db.query(query, params, function (error, results) {
            if (error) {
                console.error(error);
                return;
            } else if (results.length == 0) {
                response.write(JSON.stringify({
                    "提示信息": "用户名不存在",
                    "status": "passed"
                }));
                response.end();
            } else {
                var accountNode = results.pop().account;
//                if (accountNode.data.password == account.password) {
                    response.write(JSON.stringify({
                        "提示信息": "用户名存在",
                        "失败原因": name + type + "已存在",
                        "status": "failed"
                    }));
                    response.end();
//                }
            }
        });
    }
}
/***************************************
 *     URL：/api2/account/getnowpageaccount
 ***************************************/
accountManage.getnowpageaccount = function (data, response) {
    response.asynchronous = 1;
    var count = 0;
    var start = data.start;
    var end = data.end;
    getNowPageAccountCountNode();
    function getNowPageAccountNode() {
        var query = [
            'MATCH account:Account' ,
            'RETURN  account',
            'SKIP {stat}',
            'LIMIT {total}'
        ].join('\n');

        var params = {
            stat: parseInt(start),
            total: parseInt(end)
        };
        db.query(query, params, function (error, results) {
            if (error) {
                console.error(error);
                return;
            }
            if (results.length == 0) {
                response.write(JSON.stringify({
                    "提示信息": "获得分页注册用户失败",
                    "失败原因 ": "无注册用户"
                }));
                response.end();
            } else {
                var accounts = [];
                for (var index in results) {
                    var accountNode = results[index].account;
                    accounts.push(accountNode.data);
                }
                response.write(JSON.stringify({
                    "提示信息": "获得分页注册用户成功",
                    "accounts": accounts,
                    "count": count
                }));
                response.end();
            }
        });
    }
    function getNowPageAccountCountNode() {
        var query = [
            'MATCH account:Account' ,
            'RETURN  count(account)'
        ].join('\n');

        var params = {};
        db.query(query, params, function (error, results) {
            if (error) {
                console.log(error);
                response.write(JSON.stringify({
                    "提示信息": "获得所有注册用户数量失败",
                    "失败原因 ": "数据格式不正确"
                }));
                response.end();
            } else {
                count = results.pop()["count(account)"];
                getNowPageAccountNode();
            }
        });
    }
}
/***************************************
 *     URL：/api2/account/getbyid
 ***************************************/
accountManage.getbyid = function (data, response) {
    response.asynchronous = 1;
    var uid = data.uid;
    getByIdAccountNode();

    function getByIdAccountNode() {
        var query = [
            'MATCH account:Account' ,
            'WHERE account.uid! ={uid}',
            'RETURN  account '
        ].join('\n');

        var params = {
            uid: parseInt(uid)
        };

        db.query(query, params, function (error, results) {
            if (error) {
                console.error(error);
                return;
            }
            if (results.length == 0) {
                response.write(JSON.stringify({
                    "提示信息": "获取用户信息失败",
                    "失败原因 ": "用户信息不存在"
                }));
                response.end();
            } else {
                var account = results.pop().account.data;
                response.write(JSON.stringify({
                    "提示信息": "获取用户信息成功",
                    "account": account
                }));
                response.end();
            }
        });
    }
}
/***************************************
 *     URL：/api2/account/modifyaccount
 ***************************************/
accountManage.modifyaccount = function (data, response) {
    response.asynchronous = 1;
    var uid = data.uid;
    var accountStr = data.account;
    var account = JSON.parse(accountStr);
    modifyAccountNode();

    function modifyAccountNode() {
        var query = [
            'MATCH account:Account',
            'WHERE account.uid! ={uid}',
            'RETURN  account'
        ].join('\n');

        var params = {
            uid: parseInt(uid)
        };

        db.query(query, params, function (error, results) {
            if (error) {
                console.error(error);
                return;
            }
            if (results.length == 0) {
                response.write(JSON.stringify({
                    "提示信息": "修改用户信息失败",
                    "失败原因 ": "用户信息不存在"
                }));
                response.end();
            } else {
                var accountNode = results.pop().account;
                accountNode.data = account;
                accountNode.save();
                response.write(JSON.stringify({
                    "提示信息": "修改用户信息成功",
                    "account": account
                }));
                response.end();
            }
        });
    }
}

/***************************************
 *     URL：/api2/account/getallcount
 ***************************************/
accountManage.getallcount = function (data, response) {
    response.asynchronous = 1;
    getAllAccountCountNode();
    function getAllAccountCountNode() {
        var query = [
            'MATCH account:Account' ,
            'RETURN  count(account)'
        ].join('\n');

        var params = {};
        db.query(query, params, function (error, results) {
            if (error) {
                console.log(error);
                response.write(JSON.stringify({
                    "提示信息": "获得所有注册用户数量失败",
                    "失败原因 ": "数据异常"
                }));
                response.end();
            } else {
                var count = results.pop()["count(account)"];
                response.write(JSON.stringify({
                    "提示信息": "获得所有注册用户数量成功",
                    "count": count
                }));
                response.end();
            }
        });
    }
}
/***************************************
 *     URL：/api2/account/delete
 ***************************************/
accountManage.delete = function (data, response) {
    response.asynchronous = 1;
    var uid = data.uid;
    deleteAccountNode();
    function deleteAccountNode() {
        var query = [
            'MATCH other-[r]-account:Account' ,
            'WHERE account.uid! ={uid}',
            'DELETE r, account'
        ].join('\n');

        var params = {
            uid: parseInt(uid)
        };
        db.query(query, params, function (error, results) {
            if (error) {
                console.log(error);
                response.write(JSON.stringify({
                    "提示信息": "删除注册用户失败",
                    "失败原因 ": "用户不存在"
                }));
                response.end();

            }else {
                response.write(JSON.stringify({
                    "提示信息": "删除注册用户成功"
                }));
                response.end();
            }
        });
    }
}
/***************************************
 *     URL：/api2/account/trash
 ***************************************/
accountManage.trash = function (data, response) {
}


module.exports = accountManage;


