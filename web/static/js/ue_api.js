var data = {};
/*************************************** ***************************************
 *    resolve local storage
 *************************************** ***************************************/
var logindata = {};
logindata.localSettings = {};
var logindata = {};
logindata.localSettings = {};
window.onbeforeunload = function () {
    window.localStorage.localSettings = JSON.stringify(logindata.localSettings);
};
$(document).ready(function () {
    if (window.localStorage.localSettings != null) {
        logindata.localSettings = JSON.parse(window.localStorage.localSettings);
    }
});

/*************************************** ***************************************
 *    public functions
 *************************************** ***************************************/
var templatePool = {};
function getTemplate(template) {
    if (templatePool[template] != null) {
        return  templatePool [template];
    }
    var tenjin = nTenjin;
    var templateDiv = $(".template[template='" + template + "']")

    if (templateDiv.size() != 1) {
        return null;
    }
    var string = templateDiv.html();
    string = string.replace(/\<\!\-\-\?/g, "<?");
    string = string.replace(/\?\-\-\>/g, "?>");
    string = string.replace(/比较符号大于/g, ">");
    string = string.replace(/比较符号兄小于/g, "<");
    var nTemplate = new tenjin.Template();
    nTemplate.convert(string);
    nTemplate.eventPool = $(templateDiv).attr("eventPool");
    nTemplate.serverData = $(templateDiv).attr("serverData");
    nTemplate.localData = $(templateDiv).attr("localData");
    templatePool [template] = {template: nTemplate, templateDiv: templateDiv}
    return templatePool [template];
    return {template: nTemplate, templateDiv: templateDiv};
}


/*************************************** ***************************************
 *    callback session
 *************************************** ***************************************/
$(document).ready(function () {
    var now = new Date();
    data.appid = "36";
    data.uid = "91";
    data.accesskey = "123";
    data.sessionID = data.uid + now.getTime();
//    getEvent();
});


function getEvent() {
    if (data.uid == null || data.sessionID == null) {
        return;
    }
    $.ajax({
        type: "GET",
        url: "/api2/session/event",
        timeout: 30000,
        data: {uid: data.uid, sessionID: data.sessionID},
        success: function (event, textStatus) {
            eventLoop(event)
            getEvent();
        },
        complete: function (XMLHttpRequest, textStatus) {
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            if (textStatus == "timeout") {
                getEvent();
            }
        }
    });
}

function eventLoop(event) {
    if (event.eventID == "bind_server") {
        alert("bind_server");
    }
}


/*************************************** ***************************************
 *    bind token
 *************************************** ***************************************/

$(document).ready(function () {
    $("#bindingtoken").click(function () {
        var weixinName = $("#weixinName").val();
        if (weixinName != "" && weixinName != "请输入公众平台帐号名称") {
            bindingtoken(weixinName)
            function bindingtoken(weixinName) {
                $.ajax({
                    type: "get",
                    url: "/api2/weixin/bindingtoken?",
                    data: {
                        weixinName: weixinName, uid: data.uid, accesskey: "XXXXXX"
                    },
                    success: function (data) {
                        if (data["提示信息"] == "微信公众账号正在绑定") {
                            logindata.localSettings.bindingWeixinName = weixinName;
                            logindata.localSettings.bindingToken = data.token;
                            location.href = "step_1.html";
                        }
                    }
                });
            }
        }
        else {
            $("#weixinName").val("请输入公众平台帐号名称");
        }
    });
});

$(document).ready(function () {
    $("#bindingToken").val(logindata.localSettings.bindingToken);
});


/*************************************** ***************************************
 *    get Weixins
 *************************************** ***************************************/
$(document).ready(function () {
    getWeixins();
});
function getWeixins() {
    $.ajax({
        type: "GET",
        url: "/api2/weixin/getall",
        data: {
            uid: data.uid,
            accesskey: data.accesskey
        },
        success: function (serverData) {
            console.log(serverData);
            data.weixins = serverData.weixins;
            var nTemplate = getTemplate("weixin_list");
            if (nTemplate == null) {
                return;
            }
            var innerHtml = nTemplate.template.render();
            nTemplate.templateDiv.html(innerHtml);
            nTemplate.templateDiv.removeClass("hide");


            {
                String.format = function (src) {
                    if (arguments.length == 0) return null;
                    var args = Array.prototype.slice.call(arguments, 1);
                    return src.replace(/\{(\d+)\}/g, function (m, i) {
                        return args[i];
                    });
                };
                var dragSrcEl = null;
                function handleDragStart(e) {
                    this.style.opacity = '0.2';
                    dragSrcEl = this;
                    var appid = $(this).attr("appid");
                    this.classList.add('moving');
                }
                function handleDragOver(e) {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                    return false;
                }
                function handleDragEnter(e) {
                    // this / e.target is the current hover target.
                    this.classList.add('over');
                }
                function handleDragEnd(e) {
                    // this/e.target is the source node.
                    this.style.opacity = '0.9';
                    [].forEach.call(cols, function (col) {
                        col.classList.remove('over');
                        col.classList.remove('moving');
                    });
                    $(".circle_out").removeClass("over");
                    $(".circle_out").removeClass("moving");
                }
                var cols = document.querySelectorAll('.out_frame');
                [].forEach.call(cols, function (col) {
                    col.setAttribute('draggable', 'true');
                });
                $(".out_frame").bind("dragstart", handleDragStart);
                $(".out_frame").bind("dragenter", handleDragEnter);
                $(".out_frame").bind("dragend", handleDragEnd);
                /******************************
                 处理circle_out
                 *****************************/
                $(".circle_out").bind("dragover", function (e) {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                    $(this).addClass("over");
                });
                $(".circle_out").bind("dragleave", function () {
                    $(this).removeClass("over");
                });

                $(".circle_out").bind("drop", function (arg) {
                    if ($(dragSrcEl).hasClass("out_frame")) {
//                        alert($(dragSrcEl).attr("appid"));
                        var appid = $(dragSrcEl).attr("appid");
                        append_circle($(this), appid);
                    }
                });

                $(".circle_out").bind("dragend", function () {
                    $(".circle_out").removeClass("over");
                    $(".circle_out").removeClass("moving");

                });
                function append_circle(circle, appid) {
                    var amount = parseInt(circle.attr("amount"));
                    var button=document.createElement("div");
                    button.setAttribute("class","circel_ele circel_ele_"+(++amount));
                    button.setAttribute("title","微信订餐管理");
                    button.setAttribute('draggable', 'true');
                    var img = document.createElement("img");
                    img.setAttribute("src","/static/images/face.jpg");
                    $(button).append(img);
                    circle.append(button);
                    circle.attr("amount", amount);

                    $.ajax({
                        type: "GET",
                        url: "/api2/weixin/bindapp",
                        data: {uid: "16", accesskey: "123", weixinopenid: $($(".circle_out")[0]).attr("weixinOpenID"), appid: appid},
                        success: function (event, data) {
                            if (data["提示信息"] == "微信公众账号添加应用成功") {
                            }
                            else{

                            }
                        }
                    });

                    digui($(button));

                }
                function digui(qq){
                    qq.bind("drag", function (e) {
                        qq.remove();
                        $.ajax({
                            type: "GET",
                            url: "/api2/weixin/unbindapp",
                            data: {uid: "16", accesskey: "123", weixinopenid: $($(".circle_out")[0]).attr("weixinOpenID"), appid: $(this).attr("appid")},
                            success: function (event, data) {
                                if (data["提示信息"] == "微信公众账号移除应用成功") {
                                }
                                else{

                                }
                            }
                        });
                        var circle= $($(".circle_out")[0]);
                        var amount1 = parseInt(circle.attr("amount"));
                        circle.attr("amount", amount1 - 1);
                        //先删除所有ele
                        var all = $(".circel_ele");
                        all.remove();
                        //重新排列
                        for(var i=1; i<amount1; i++){
                            var button1=document.createElement("div");
                            button1.setAttribute("class","circel_ele circel_ele_"+(i));
                            button1.setAttribute("title","微信订餐管理");
                            button1.setAttribute('draggable', 'true');
                            var img1 = document.createElement("img");
                            img1.setAttribute("src","/static/images/logo_app.png");
                            $(button1).append(img1);
                            circle.append(button1);
                            digui($(button1));
                        }
                    });
                }

                for(var acc=0;acc<$(".circel_ele").length;acc++){
                    var temp = $($(".circel_ele")[acc]);
                    temp.bind("drag", function (e) {
                        $(this).remove();
                        $.ajax({
                            type: "GET",
                            url: "/api2/weixin/unbindapp",
                            data: {uid: "16", accesskey: "123", weixinopenid: $($(".circle_out")[0]).attr("weixinOpenID"), appid: $(this).attr("appid")},
                            success: function (event, data) {
                                if (data["提示信息"] == "微信公众账号移除应用成功") {
                                }
                                else{

                                }
                            }
                        });

                        var circle= $(".circle_out");
                        var amount1 = parseInt(circle.attr("amount"));
                        circle.attr("amount", amount1 - 1);
                        //先删除所有ele
                        var all = $(".circel_ele");
                        all.remove();
                        //重新排列
                        for(var i=1; i<amount1; i++){
                            var button1=document.createElement("div");
                            button1.setAttribute("class","circel_ele circel_ele_"+(i));
                            button1.setAttribute("title","微信订餐");
                            button1.setAttribute('draggable', 'true');
                            var img1 = document.createElement("img");
                            img1.setAttribute("src","/static/images/face.jpg");
                            $(button1).append(img1);
                            circle.append(button1);
                            digui($(button1));
                        }
                    });
                }
            }


//            registerWeixinListEvent();
        }
    });
}

function registerWeixinListEvent() {

    $(".app_delete").click(function () {
        var appid = $(this).attr("appid");
        console.log(appid);
        deleteApp(appid);
    });
}


/*************************************** ***************************************
 *    add App
 *************************************** ***************************************/
$(document).ready(function () {

    $("#app_add").click(function () {
        var name = $("#app_name").val();
        var description = $("#app_description").val();
        if (name != "") {
            addApp(name, description);
        }
        else {
            alert("应用名称不能为空！");
        }
    });

    function addApp(name, description) {
        readJS(function (script) {
            $.ajax({
                type: "POST",
                url: "/api2/app/add?",
                data: {
                    uid: data.uid,
                    accesskey: data.accesskey,
                    script: script,
                    app: JSON.stringify({
                        name: name,
                        description: description,
                        icon: "http:///baiud.com/fsf.jpg",
                        type: "public"
                    })
                },
                success: function (data) {
                    console.log(data);
                }
            });
        })
    }

    $('.js_upload_js').click(function () {

        $("#input_js").val("");
        $("#input_js").trigger("click");
    });

    $("#input_js").change(function () {
        var files = this.files;
        for (var i = 0, file; file = files[i]; i++) {
            filename = file.name;
            $("#upload_file_name").html(filename);
            break;
        }
    });
    function readJS(next) {
        var file = $("#input_js")[0].files[0];
        var jsReader = new FileReader();
        jsReader.onload = function (e) {
            var urlData = this.result;
            var script = getScript(urlData)
            next(script);
        };
        jsReader.readAsDataURL(file);
    }

    function getScript(urlData) {
        if (urlData.indexOf("data:application/x-javascript;base64,") != 0) {
            alert("脚本格式不正确");
        }
        var script = urlData.substr(37);
        return script;
    }
});}

/*************************************** ***************************************
 *    bind app    unbind app
 *************************************** ***************************************/

$(document).ready(function () {
    bindapp();
//    unbindapp();
});
function bindapp() {
    $.ajax({
        type: "GET",
        url: "/api2/weixin/bindapp?",
        data: {
            "appid": 36,
            "weixinopenid": "gh_c6cd8a443586"
        },
        success: function (data) {
            alert(JSON.stringify(data));
        }
    });
}


//function unbindapp() {
//    $.ajax({
//        type: "GET",
//        url: "/api2/weixin/unbindapp?",
//        data: {
//            "appid": 36,
//            "weixinopenid": "gh_c6cd8a443586"
//        },
//        success: function (data) {
//            alert(JSON.stringify(data));
//        }
//    });
//}
