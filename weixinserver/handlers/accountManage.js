/**
 * Demo of reading and writing data with neo4j.
 * Date: 2013.04.15
 * Request:
 *  http://127.0.0.1:8062/api2/account/publicAdd?accountName=abc&password=6367c48dd193d56ea7b0baad25b19455e529f5ee&phone=15232232888&email=avasf%40163.com
 * Response:
 *  "{}"
 *
 * Request:
 *  http://127.0.0.1:8062/api2/account/auth?i=0
 * Response:
 *  "{}"
 */

var accountManage = {};

var neo4j = require('neo4j');

var db = new neo4j.GraphDatabase('http://localhost:7474');
var nodeId = 2;//create a node in Neo4j monitoring and management tools, and put its node id here.
var RSA = require('./../tools/RSA');
accountManage.add = function (data, response) {
    response.asynchronous = 1;
    account =
    {
        "accountName": data.accountName,
        "type": "account",
        "password": data.password,
        "phone": data.phone,
        "phoneStatus": "verified",
        "email": data.email,
        "emailStatus": "verifying#366541",
        "accessKey": ["f5d4f5d46f4d65f4d654f56d4f", "4f54d6f54d65f45d6f465d4f65"]
    };
    RSA.setMaxDigits(38);
    var pbkeyStr3 = RSA.RSAKeyStr(
        "5db114f97e3b71e1316464bd4ba54b25a8f015ccb4bdf7796eb4767f9828841",
        "5db114f97e3b71e1316464bd4ba54b25a8f015ccb4bdf7796eb4767f9828841",
        "3e4ee7b8455ad00c3014e82057cbbe0bd7365f1fa858750830f01ca7e456b659");
    var pbkey3 = RSA.RSAKey(pbkeyStr3);

    var pvkeyStr3 = RSA.RSAKeyStr(
        "10f540525e6d89c801e5aae681a0a8fa33c437d6c92013b5d4f67fffeac404c1",
        "10f540525e6d89c801e5aae681a0a8fa33c437d6c92013b5d4f67fffeac404c1",
        "3e4ee7b8455ad00c3014e82057cbbe0bd7365f1fa858750830f01ca7e456b659");
    var pvkey3 = RSA.RSAKey(pvkeyStr3);

    db.getIndexedNode("account", "accountName", account.accountName, function (err, node) {
        if (node == null) {
            db.getIndexedNode("account", "phone", account.phone, function (err, node) {
                if (node == null) {
                    db.getIndexedNode("account", "email", account.email, function (err, node) {
                        if (node == null) {
                            var node = db.createNode(account);
                            node.save(function (err, node) {
                                node.data.uid = node.id;
                                node.index("account", "accountName", account.accountName);
                                node.index("account", "phone", account.phone);
                                node.index("account", "email", account.email);
                                node.save(function (err, node) {
                                    response.write(JSON.stringify({
                                        "information": "/api2/account/publicAdd  success",
                                        "node": node.data
                                    }));
                                    response.end();
                                });
                            });
                        }
                        else {
                            response.write(JSON.stringify({
                                "information": "/api2/account/add  failed",
                                "reason": "email has existed."
                            }));
                            response.end();
                        }
                    });
                } else {
                    response.write(JSON.stringify({
                        "information": "/api2/account/add  failed",
                        "reason": "phone number has existed."
                    }));
                    response.end();
                }
            });
        }
        else {
            response.write(JSON.stringify({
                "information": "/api2/account/add  failed",
                "reason": "account name has existed."
            }));
            response.end();

        }
    });


}

var RSA = require('./../tools/RSA');
accountManage.exist = function (data, response) {
    response.asynchronous = 1;
    account =
    {
        "accountName": data.accountName,
        "email": data.email
    };
    checkAccountName();

    function checkAccountName() {
        if (account.accountName != null) {
            db.getIndexedNode("account", "accountName", account.accountName, function (err, node) {
                if (node != null) {
                    response.write(JSON.stringify({
                        "information": account.accountName + " exist.",
                        "status": "failed"
                    }));
                    response.end();
                    return;
                } else {
                    checkEmail();
                }

            });
        } else {
            checkEmail();
        }
    }

    function checkEmail() {
        if (account.email != null) {
            db.getIndexedNode("account", "email", account.email, function (err, node) {
                if (node != null) {
                    response.write(JSON.stringify({
                        "information": account.email + " exist.",
                        "status": "failed"
                    }));
                    response.end();
                    return;
                } else {
                    responsePass();
                }

            });
        } else {
            responsePass();
        }
    }

    function responsePass() {
        response.write(JSON.stringify({
            "information": (account.accountName || account.email) + " does not exist.",
            "status": "passed"
        }));
        response.end();
    }

}

var RSA = require('./../tools/RSA');
accountManage.auth = function (data, response) {
    response.asynchronous = 1;
    account =
    {
        "accountName": data.accountName,
        "password": data.password,
        "type": "account",
        "phone": data.phone,
        "email": data.email
    };
    RSA.setMaxDigits(38);
    var pbkeyStr3 = RSA.RSAKeyStr(
        "5db114f97e3b71e1316464bd4ba54b25a8f015ccb4bdf7796eb4767f9828841",
        "5db114f97e3b71e1316464bd4ba54b25a8f015ccb4bdf7796eb4767f9828841",
        "3e4ee7b8455ad00c3014e82057cbbe0bd7365f1fa858750830f01ca7e456b659");
    var pbkey3 = RSA.RSAKey(pbkeyStr3);

    var pvkeyStr3 = RSA.RSAKeyStr(
        "10f540525e6d89c801e5aae681a0a8fa33c437d6c92013b5d4f67fffeac404c1",
        "10f540525e6d89c801e5aae681a0a8fa33c437d6c92013b5d4f67fffeac404c1",
        "3e4ee7b8455ad00c3014e82057cbbe0bd7365f1fa858750830f01ca7e456b659");
    var pvkey3 = RSA.RSAKey(pvkeyStr3);

    if (account.accountName != null) {
        checkAccountName();
    } else if (account.phone != null) {
        checkPhone();
    } else if (account.email != null) {
        checkEmail();
    }


    function checkAccountName() {
        db.getIndexedNode("account", "accountName", account.accountName, function (err, node) {
            if (node != null) {
                var data = node.data;
                if (account.password == node.data.password) {
                    node.index("account", "accountName", account.accountName);
                    response.write(JSON.stringify({
                        "information": "user exist.",
                        "status": "passed"
                    }));
                    response.end();
                } else {
                    response.write(JSON.stringify({
                        "information": account.password + " password is wrong.",
                        "status": "failed"
                    }));
                    response.end();
                }
            } else {
                response.write(JSON.stringify({
                    "information": account.accountName + " does not exist.",
                    "status": "failed"
                }));
                response.end();
            }

        });
    }

    function checkPhone() {
        db.getIndexedNode("account", "phone", account.phone, function (err, node) {
            if (node != null) {
                var data = node.data;
                if (account.password == node.data.password) {
                    node.index("account", "phone", account.phone);
                    response.write(JSON.stringify({
                        "information": "phone exist.",
                        "status": "passed"
                    }));
                    response.end();
                } else {
                    response.write(JSON.stringify({
                        "information": account.password + " password is wrong.",
                        "status": "failed"
                    }));
                    response.end();
                }
            } else {
                response.write(JSON.stringify({
                    "information": account.phone + " does not exist.",
                    "status": "failed"
                }));
                response.end();
            }

        });

    }

    function checkEmail() {
        db.getIndexedNode("account", "email", account.email, function (err, node) {
            if (node != null) {
                var data = node.data;
                if (account.password == node.data.password) {
                    node.index("account", "email", account.email);
                    response.write(JSON.stringify({
                        "information": "email exist.",
                        "status": "passed"
                    }));
                    response.end();
                } else {
                    response.write(JSON.stringify({
                        "information": account.password + " password is wrong.",
                        "status": "failed"
                    }));
                    response.end();
                }
            } else {
                response.write(JSON.stringify({
                    "information": account.email + " does not exist.",
                    "status": "failed"
                }));
                response.end();
            }
        });
    }
}

module.exports = accountManage;