var gameNum = '- -', //游戏次数 -初始化值， 
	gameToken = '', //游戏token -初始值， 
	isLogin = false,
	inApp = navigator.userAgent.indexOf("YongChe")<=0 ? false : true;

var telInput = $('#login-tel'),   //手机号输入框
	msgInput = $('#login-msgcode'),   //短信验证码输入框
	captchaInput = $('#login-captchacode'),  //图片验证码输入框
	getmsgcodeBtn = $('#login-getmsgcode'),  //获取短线验证码按钮
	getcaptchaBtn = $('#login-getcaptchacode'),  //获取图片验证码
	loginBtn = 	$('#login-btn'),  //登录按钮
	need_imgcode = 0,
	cellphone,
	captcha,
	msgcode;


//document.cookie='_app_token_v3=XTDOwAJVYQ4fTB9z8QRo1jcuPrfkBBwPhlzs8j_79RU';    //16800120011
// kKtwZA2vYwxbJBA5P-eiivWuFrHLWLBF-ECli2a-5WA
var httpHead = 'https://testing-market.Yongche.org'; //线下接口
//var httpHead = 'https://market.yongche.com'; //线上接口

//活动规则页\我的奖励页\引导页\登录页---  “关闭按钮”
$(".close_btn").click(function(){
	$('.mask').fadeOut(300);
})

//“再玩一次”
$("#playagin").click(function(){
	if(gameNum<=0){
		return 
	}
	$('#over').hide();
	gameNum--;
	game.state.start('play');
	startGame();
	getCommon(1);
})

//结束页关闭返回首页
$('#close_over').click(function(){
	$('.mask').fadeOut(300);
	getCommon();
	//game.state.start('created');
})

//端外分享箭头指引
$('#sharearrow').click(function(){
	$(this).hide();
})
//“分享给朋友”
$('#sharetofriend').click(shareFn);
function shareFn() {
	if(inApp){//端内分享
		ga('send', 'event', 'share_button', 'click', 'shareClickChristmas');
	    Tools.shareThisPage();
	}else{
		$('#sharearrow').show();
	}
} 
/*var wShare = {};
wShare.shareImg = 'http://i3.yongche.name/media/g2/M03/1C/07/rBEBJVpy8iOIZZJkAACTrvpjzssAAK79AKaJ5sAAJPG404.png';
wShare.shareTitle = '快来参加易到金币大作战';
wShare.shareContent = '参与游戏赢用车券啦';
wShare.shareUrl = 'http://www.yongche.com/cms/page/glj.html?shareToken=';

        */
window.onresize = function(){
 //alert('change')
}

var shareToken1 = GetQueryString('shareToken');
function initData(){
	if(shareToken1){
        helphimFn();
    } else{
        getCommon();
    }
            
}
function getCommon(isagin){
	$.ajax({
        type:'get',
        url: httpHead + '/Miscellaneous/Activityusergame/getCommon',
        dataType:'jsonp',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data) {
            alert('getCommon'+data.code);
            if(data.code==200){
                isLogin = true;
				gameNum = data.result.gameNum;
                if(!isagin){getMyPrizelist();}
                if(inApp){
                	if(!isagin){
                		//端内分享配置
		                ajaxShare({
		                    url:'http://www.yongche.com/cms/page/glj.html?shareToken='+data.result.shareToken,
		                    shareimg:'http://i3.yongche.name/media/g2/M03/1C/07/rBEBJVpy8iOIZZJkAACTrvpjzssAAK79AKaJ5sAAJPG404.png',
		                    title:'金币大作战',
		                    description:'金币大作战'
		                })
                	}
                }
            }else if(data.code==403) {//未登录
                console.log('未登录');
                isLogin = false;
            }else if(data.code==504) {//不在活动期间
                console.log('不在活动期间');
                
            }else if(data.code==500) {//用户信息为空
                console.log('用户信息为空');
                
            }else if(data.code==507) {//访问频率过快
                console.log('访问频率过快');
                
            } 
            if(!isagin){game.state.start('created');}
        },
        error:function(err){
            console.log(err.msg)
        }
	});
}
function getMyPrizelist(){
	$.ajax({
        type:'get',
        url: httpHead + '/Miscellaneous/Activityusergame/getAwardList',
        dataType:'jsonp',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data) {
            alert('getMyPrizelist'+data.code);
            if(data.code==200){
                updateMyPrizelist(data.result);//更新我的奖品列表  
            }else if(data.code==403) {//未登录
                toastMsg('未登录');
            }
        },
        error:function(err){
            console.log(err.msg)
        }
	});
}

function startGame(){//开始游戏
	$.ajax({
        type:'get',
        url: httpHead + '/Miscellaneous/Activityusergame/startGame',
        dataType:'jsonp',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data) {
            alert('startGame'+data.code);
            if(data.code==200){
				gameToken = data.result.gameToken;
            }else if(data.code==403) {//未登录
                console.log('未登录');
            }else if(data.code==504) {//不在活动期间
                console.log('不在活动期间');
            }else if(data.code==500) {//用户信息为空
                console.log('用户信息为空');
            }else if(data.code==507) {//访问频率过快
                console.log('访问频率过快');
            } 
        },
        error:function(err){
            console.log(err.msg)
        }
	});
}

function endGame(gameToken,goldNum){//游戏结束
	$.ajax({
        type:'get',
        url: httpHead + '/Miscellaneous/Activityusergame/endGame?gameToken='+gameToken+'&goldNum='+goldNum,
        dataType:'jsonp',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data) {
            //alert('endGame'+data.code);
            if(data.code==200){
				updateoverData(data.result)
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
            console.log(err.msg)
        }
	});
}

//点击登录按钮
loginBtn.click(function() {
    cellphone = telInput.val();
    msgcode = msgInput.val();
    captcha = captchaInput.val();
    if(!checkMobile(cellphone)){
        toastMsg('请输入正确手机号');
        return false;
    }
    if(need_imgcode==1 && !captcha){
        toastMsg('请输入图形验证码');
        return false;
    }
    if(!msgcode){
        toastMsg('请输入短信验证码');
        return false;
    }
    $.ajax({
        url: httpHead + '/activity/Webuser/Login?cellphone='+cellphone+'&code='+msgcode+'&captcha='+captcha,
        type:'get',
        dataType:'jsonp',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data) {
            alert('Login'+data.code);
            if(data.code==200){
				$('#loginMask').hide();
				isLogin = true;
                if(shareToken1){
                    helphimFn();
                }else{
                	game.state.start('created');
                }
            } else{
                toastMsg('Login'+data.code,data.msg);
            }
        },
        error:function(err){
            console.log(data.msg)
        }
    })
});

function helphimFn() { //助力
    $.ajax({
        url: httpHead + '/Miscellaneous/Activityusergame/helpUser?shareToken=' +shareToken1,
        type:'get',
        dataType:'jsonp',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data) {
        	alert('help'+data.code);
        	if(data.code==200){
        		toastMsg('您已为好友增加抽奖次数，赶快来参与活动吧！');
        		isLogin = true;
	            gameNum = data.result.gameNum;
	            wShare.shareUrl = 'http://www.yongche.com/cms/page/glj.html?shareToken='+ data.result.shareToken;
	            alert('shareUrl: '+wShare.shareUrl);
	            wxShareFn(wShare);  //微信二次分享
	            game.state.start('created');
	            getMyPrizelist();
        	}else{
        		isLogin = false;
        	}
        	game.state.start('created');
        },
        error:function(err){
            console.log(err.msg);
        }
    });
}
        
getmsgcodeBtn.click(function () {//获取短信验证码
    cellphone = telInput.val();
    captcha = captchaInput.val();
    var isverify = checkMobile(cellphone);//检测手机号是否合法
    if(!isverify){
        toastMsg('请输入正确的手机号');
        return false;
    }
    console.log(need_imgcode);
    if(need_imgcode == 1){//需要图形验证码
        console.log(captcha);
        if(!captcha){
            toastMsg('请输入图形验证码');
            return false;
        }
        getMsgCode(cellphone,captcha);
    }else{
    	getMsgCode(cellphone,captcha);
    }
})

function getMsgCode(cellphone,captcha) {//获取短信验证码接口
    $.ajax({
        type:'get',
        url:httpHead+'/activity/Webuser/getCode?cellphone='+cellphone+'&captcha='+captcha,
        dataType:'jsonp',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data) {
            alert('getMsgCode'+data.code);
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
                toastMsg('请求次数过多,请稍后重试')
            } else if(data.code == 400){
                toastMsg('图形验证码错误');
                if(data.isUpdate == 1){
                    getcaptchaFn();
                }
            } else if(data.code == 449) {
                toastMsg('请求太频繁');
                if(need_imgcode==1){
                    getcaptchaFn();
                }
            }
        },
        error:function(err){
            console.log(err.msg)
        }
    })
}

getcaptchaBtn.click(getcaptchaFn);
function getcaptchaFn() {//获取图形验证码
    getcaptchaBtn.attr('src',httpHead+'/activity/Webuser/getCaptcha?t='+new Date().getTime());
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

//over页面展示
function showOver(score){
	$('#over').show();
	endGame(gameToken,score);//把金币数数传给后台
}
function updateoverData(data){
	$('.winer').children('.discount').remove();
	$('#totalscore').text(data.goldNum); //游戏总分
	$('#defeat').text(data.defeat); //击败多少人
	$('#gameNum').text(data.gamenum);//游戏次数
	if(data.gamenum<=0){
		$('.playagin').addClass('noagin');
	}
	if(data.awardId==''){//优惠券等级
		$('.winer').hide()
		$('.loser').show();
	}else{
		$('.loser').hide();
		var levelclass = '';
		if(data.awardId===4874){
			levelclass = 'discount95';
		}else if(data.awardId===5138 ){
			levelclass = 'discount90';
		}else if(data.awardId===5136){
			levelclass = 'discount85';
		}
		var str = '<div class="discount '+ levelclass +' "></div>';
		$('.winer').append($(str)).show();
	}
}

function updateMyPrizelist(prizelist){
	alert('prizelist.length=='+prizelist.length)
	var str = '', levelclass = '';
	if(prizelist.length<=0){
		$('.prizelist').hide();
		$('.noprize').show();
		return;
	}
	console.log(prizelist.length)
	$('.noprize').hide();
	$('.prizelist').children('.prizeitem').remove();
	prizelist.forEach(function(item){
		if(item.awardId==4874){
			levelclass = 'prize95';
		}else if(item.awardId==5138){
			levelclass = 'prize90';
		}else if(item.awardId===5136){
			levelclass = 'prize85';
		}
		str += '<li class="prizeitem '+ levelclass +'"></li>';
	})
	$('.prizelist').append($(str)).show();
}

function toastMsg(msg){
	$('.toast').fadeIn(100).text(msg);
	setTimeout(function(){
		$('.toast').fadeOut(100)
	},2000)
}
