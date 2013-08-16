/**
 * Created with JetBrains WebStorm.
 * User: Admin
 * Date: 13-8-9
 * Time: 上午11:12
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function(){
    var nowBindWeixins = window.sessionStorage.getItem("nowBindWeixins");
    if(nowBindWeixins != null){
        var nowWeixinName = window.localStorage.getItem("nowWeixinName");
        for(var key in JSON.parse(nowBindWeixins)){
            if(JSON.parse(nowBindWeixins)[key].weixinName == nowWeixinName){
                getAllWeixinUser(JSON.parse(nowBindWeixins)[key].weixinOpenID);
            }
        }
    }
    //发送Ajax请求,获取微信会员列表信息并显示
    function getAllWeixinUser(weixinOpenID){
        $.ajax({
            type:"GET",
            url:"/api2/user/getall?",
            data:{
                "weixinopenid":weixinOpenID
            },
            success:function(serverData){
                if(serverData["提示信息"] == "获得所有关注用户成功"){
                    var weixin_user = getTemplate("weixin_user");
                    $(".wixinMemberTable").html(weixin_user.render(serverData["users"]));
                    for(var i=0;i<$(".idsubstr").length;i++){
                        var id = $($(".idsubstr")[i]).html();
                        $($(".idsubstr")[i]).html(id.substr(0,9)+"...");
                    }
                }
            }
        });
    }
});
//根据id获取模版
function getTemplate(id) {
    var tenjin = nTenjin;
    var templateDiv = $('.templates #' + id).parent();
    var string = templateDiv.html();
    string = string.replace(/\<\!\-\-\?/g, "<?");
    string = string.replace(/\?\-\-\>/g, "?>");
    string = string.replace(/比较符号大于/g, ">");
    string = string.replace(/比较符号兄小于/g, "<");
    var template = new tenjin.Template();
    template.convert(string);
    return template;
}
