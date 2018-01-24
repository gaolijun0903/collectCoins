var ruleText = [
'1.  每位用户第一次进入游戏时获得一次免费游戏机会；',
'2.  用户每打一次车，会获得一次游戏机会，邀请好友参加游戏后，双方各获得一次游戏机会，每个用户每天最多获得4次通过邀请得到的游戏机会，且每位用户只能在一天内被邀请一次；',
'3.  当游戏开始后，在60秒内，左右滑动汽车，每得到一个金币加100分，撞到障碍物游戏结束；',
'4.  游戏结束后，可根据所获得金币数所对应的积分获取奖励，所获奖品请在“我的奖品”页面查看；',
'5.  奖品对应积分为：3000分可获得——9.5折优惠券一张，5000分可获得——9折优惠券一张，7000分以上可获得——8.5折优惠券一张，所获优惠券可用于用车费的部分抵扣，优惠券使用规则请参见易到App个人中心优惠券页面。'
]

$("#close_rule").click(function(){
	$('#rule').fadeOut(300);
})
$("#close_prize").click(function(){
	$('#prize').fadeOut(300);
})

var telInput = $('#login-tel'),   //手机号输入框
	msgInput = $('#login-msgcode'),   //短信验证码输入框
	captchaInput = $('#login-captchacode'),  //图片验证码输入框
	
	getmsgcodeBtn = $('#login-getmsgcode'),  //获取短线验证码按钮
	getcaptchaBtn = $('#login-getcaptchacode'),  //获取图片验证码
	
	loginBtn = 	$('#login-btn'),  //登录按钮
	helphimBtn = $('#helphim'),  //助力按钮
	need_imgcode = 0,
	
	cellphone,
	captcha,
	msgcode;
        	
var isYidao = document.cookie.indexOf("_app_token_v3");
//isYidao = 1; //TODO
var inApp = isYidao===-1 ? false : true;
   
var gameToken = '';
var goldNum = 0;

initData();

function initData(){
	$.ajax({
        type:'get',
        url: testUrl + 'getCommon',
        dataType:'jsonp',
        success:function(data) {
            //console.log(data);
            if(data.code==200){
                alert('已登录');
				gameNum = data.result.gameNum;
                shareToken = data.result.shareToken;
                //toshare
                /*ajaxShare({
                    url:'http://www.yongche.com/cms/page/christmaslogin.html?shareToken='+shareToken,
                    title:'金币大作战',
                    description:'金币大作战'
                })*/
                
            }else if(data.code==403) {//未登录
                console.log('未登录');
                $('#loginMask').show();
                /*if(inApp){
                	//端内登录地址
                }else{
                	$('#loginMask').show();
                }*/
            }else if(data.code==504) {//不在活动期间
                console.log('不在活动期间');
                
            }else if(data.code==500) {//用户信息为空
                console.log('用户信息为空');
                
            }else if(data.code==507) {//访问频率过快
                console.log('访问频率过快');
                
            } 
        },
        error:function(err){
            alert(err.msg)
        }
	});
}

startGame()
function startGame(){//开始游戏
	$.ajax({
        type:'get',
        url: testUrl + 'startGame',
        dataType:'jsonp',
        success:function(data) {
            //console.log(data);
            if(data.code==200){
                alert('startGame');
				gameToken = data.result.gameToken;
				
				
            }else if(data.code==403) {//未登录
                console.log('未登录');
                $('#loginMask').show();
                
            }else if(data.code==504) {//不在活动期间
                console.log('不在活动期间');
                
            }else if(data.code==500) {//用户信息为空
                console.log('用户信息为空');
                
            }else if(data.code==507) {//访问频率过快
                console.log('访问频率过快');
                
            } 
        },
        error:function(err){
            alert(err.msg)
        }
	});
}


//endGame()
function endGame(){//游戏结束
	$.ajax({
        type:'get',
        url: testUrl + 'endGame?gameToken='+gameToken+'&goldNum='+goldNum,
        dataType:'jsonp',
        success:function(data) {
            //console.log(data);
            if(data.code==200){
                alert('endGame');
				
				
            }else if(data.code==400) {//参数不正确
                console.log('参数不正确');
                
            }else if(data.code==401) {//请从正常渠道参与游戏
                console.log('请从正常渠道参与游戏');
              
                
            }else if(data.code==504) {//不在活动期间
                console.log('不在活动期间');
                
            }else if(data.code==500) {//用户信息为空
                console.log('用户信息为空');
                
            }else if(data.code==503) {//访问频率过快
                console.log('服务器正在偷懒，请稍后重试');
                
            } 
        },
        error:function(err){
            alert(err.msg)
        }
	});
}



//点击登录按钮
loginBtn.click(function() {
    cellphone = telInput.val();
    msgcode = msgInput.val();
    captcha = captchaInput.val();
    if(!checkMobile(cellphone)){
        alert('请输入正确手机号');
        return false;
    }
    if(need_imgcode==1 && !captcha){
        alert('请输入图形验证码');
        return false;
    }
    if(!msgcode){
        alert('请输入短信验证码');
        return false;
    }
   
    $.ajax({
        url:'https://market.yongche.com/activity/Webuser/Login?cellphone='+cellphone+'&code='+msgcode,
        type:'get',
        dataType:'jsonp',
        success:function(data) {
            console.log(data);
            if(data.code==200){
				alert('登录成功');
                if(invite){
                   helphimFn();
                    
                } else{
                    alert('邀请人未参与该活动');
                    
                }
            } else{
                alert(data.code,data.msg)
            }
        },
        error:function(err){
            alert(data.msg)
        }
    })
});
        
        
getmsgcodeBtn.click(function () {//获取短信验证码
    cellphone = telInput.val();
    captcha = captchaInput.val();
    var isverify = checkMobile(cellphone);//检测手机号是否合法
    if(!isverify){
        alert('请输入正确的手机号');
        return false;
    }
    console.log(need_imgcode);
    if(need_imgcode == 1){//需要图形验证码
        console.log(captcha);
        if(!captcha){
            alert('请输入图形验证码');
            return false;
        }
        getMsgCode(cellphone,captcha);
    }else{
    	getMsgCode(cellphone,captcha);
    }
})

function getMsgCode(cellphone,captcha) {//获取短信验证码接口
	console.log(111)
    $.ajax({
        type:'get',
        url:'https://market.yongche.com/activity/Webuser/getCode?cellphone='+cellphone+'&captcha='+captcha,
        dataType:'jsonp',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data) {
            console.log(data);
            if(data.code==401){
                need_imgcode = 1;
                $(".login-captchacode-wrapper").show();
            } else if(data.code == 200){
                var count = 59;
                var countdown = setInterval(CountDown, 1000);
                function CountDown() {
                    getmsgcodeBtn.attr("disabled", true);
                    getmsgcodeBtn.css("background","#999");
                    getmsgcodeBtn.val(count + "s");
                    if (count == 0) {
                        getmsgcodeBtn.val("获取验证码").removeAttr("disabled");
                        getmsgcodeBtn.css("background","#E92C2A");
                        clearInterval(countdown);
                    }
                    count--;
                }
            } else if(data.code == 429) {
                if(need_imgcode==1){
                    getcaptchaFn();
                }
                alert('请求次数过多,请稍后重试')
            } else if(data.code == 400){
                alert('图形验证码错误');
                if(data.isUpdate == 1){
                    getcaptchaFn();
                }
            } else if(data.code == 449) {
                alert('请求太频繁');
                if(need_imgcode==1){
                    getcaptchaFn();
                }
            }
        },
        error:function(err){
            alert(err.msg)
        }
    })
}

getcaptchaBtn.click(getcaptchaFn);
function getcaptchaFn() {//获取图形验证码
    getcaptchaBtn.attr('src','https://market.yongche.com/activity/Webuser/getCaptcha?t='+new Date().getTime());
}

var shareToken = GetQueryString('shareToken');
helphimBtn.click(helphimFn);
function helphimFn() { //助力
    $.ajax({
        url: testUrl + 'helpUser?shareToken=' +shareToken,
        type:'get',
        dataType:'jsonp',
        success:function(data) {
            console.log(data);
            alert('您已为好友增加抽奖次数，赶快来参与活动吧！');
        },
        error:function(err){
            alert(err.msg)
        }
    });
    
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function checkMobile(number){//检查手机号
    if(!(/^1(3[0-9]|4[57]|5[0-35-9]|7[0135678]|8[0-9]|6[8])\d{8}$/.test(cellphone))){
        return false;
    }
    return true;
}