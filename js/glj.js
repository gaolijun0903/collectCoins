var gameNum = '--'; //游戏次数 -初始化值， TODO 后ajax获取
var shareToken = ''; //分享-初始值， TODO 后ajax获取
var gameToken = ''; //游戏token -初始值， TODO 后ajax获取
var isLogin = false;

//document.cookie='_app_token_v3=XTDOwAJVYQ4fTB9z8QRo1jcuPrfkBBwPhlzs8j_79RU';
var httpHead = 'https://testing2-market.Yongche.org'; //线下接口
//var httpHead = 'https://market.yongche.com'; //线上接口

//活动规则页“关闭按钮”
$("#close_rule").click(function(){
	$('#rule').fadeOut(300);
})
//我的奖励页“关闭按钮”
$("#close_prize").click(function(){
	$('#prize').fadeOut(300);
})
//引导页“关闭按钮”
$("#close_leadPage").click(function(){
	$('#leadPage').fadeOut(300);
})
//“再玩一次”
$("#playagin").click(function(){
	if(gameNum<=0){
		return 
	}
	$('#over').hide();
	gameNum--;
	game.state.start('play');
	
})
//“分享给朋友”
$('#sharetofriend').click(shareFn);
function shareFn() {
	alert('shareFn分享');//TODO
	if(inApp){//端内分享
		alert('端内分享')
		//ga('send', 'event', 'share_button', 'click', 'shareClickChristmas');
	    //Tools.shareThisPage();
	}else{
		alert('请点右上角分享');
	}
} 
var wShare = {};
wShare.shareImg = 'http://i2.yongche.Name/media/g2/M03/1A/35/rBEBJVo84_iIZPtgAAAydsM-krwAAKcBQLESpgAADKO907.jpg';
wShare.shareTitle = '金币大作战';
wShare.shareContent = '金币大作战';
wShare.shareUrl = window.location.href;
//wxShareFn(wShare);  //微信二次分享
        

window.onresize = function(){
 //alert('change')
}

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
   

function initData(){
	$.ajax({
        type:'get',
        url: httpHead + '/Miscellaneous/Activityusergame/getCommon',
        dataType:'jsonp',
        success:function(data) {
            //console.log(data);
            if(data.code==200){
                alert('已登录');
                game.state.start('created');
                isLogin = true;
				gameNum = data.result.gameNum;
                shareToken = data.result.shareToken;
                //toshare
                //端内分享配置
                /*ajaxShare({
                    url:'http://www.yongche.com/cms/page/christmaslogin.html?shareToken='+shareToken,
                    title:'金币大作战',
                    description:'金币大作战'
                })*/
                
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
        },
        error:function(err){
            alert(err.msg)
        }
	});
}

//startGame()
function startGame(){//开始游戏
	$.ajax({
        type:'get',
        url: httpHead + '/Miscellaneous/Activityusergame/startGame',
        dataType:'jsonp',
        success:function(data) {
            //console.log(data);
            if(data.code==200){
                alert('startGame');
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
            alert(err.msg)
        }
	});
}


//endGame()
function endGame(gameToken,goldNum){//游戏结束
	$.ajax({
        type:'get',
        url: httpHead + '/Miscellaneous/Activityusergame/endGame?gameToken='+gameToken+'&goldNum='+goldNum,
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


var shareToken = GetQueryString('shareToken');
helphimBtn.click(helphimFn);
function helphimFn() { //助力
    $.ajax({
        url: httpHead + '/Miscellaneous/Activityusergame/helpUser?shareToken=' +shareToken,
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
        url: httpHead + '/activity/Webuser/Login?cellphone='+cellphone+'&code='+msgcode+'&captcha='+captcha,
        type:'get',
        dataType:'jsonp',
        success:function(data) {
            console.log(data);
            if(data.code==200){
				alert('登录成功');
				initData();//登录成功后再次初始化数据
                if(shareToken){
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
        url:httpHead+'/activity/Webuser/getCode?cellphone='+cellphone+'&captcha='+captcha,
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
	//endGame(gameToken,score);//把分数传给后台TODO
	var result = {
		'score': 2000,
		'totalscore' :9888,
		'defeat': 68,
		'gamenum': gameNum, //数据返回后更新游戏次数 TODO
		'name': '239874098',
		'deadtime': '2018.2.26'
	}
	updateoverData(result)
}
function updateoverData(data){
	$('#totalscore').text(data.totalscore); //游戏总分
	$('#defeat').text(data.defeat); //击败多少人
	$('#gameNum').text(data.gamenum);//游戏次数
	if(data.gamenum<=0){
		$('.playagin').addClass('noagin');
	}
	if(data.score<3000){
		$('.winer').hide()
		$('.loser').show();
	}else{
		$('.loser').hide();
		$('.winer').children('.discount').remove();
		var levelclass = ''
		if(data.score<5000){
			levelclass = 'discount95';
		}else if(data.score<7000){
			levelclass = 'discount90';
		}else{
			levelclass = 'discount85';
		}
		var str = '<div class="discount '+ levelclass +' "><div >仅限<span id="over-owner">'+ data.name +'</span>使用</div><div>有效期至<span id="over-deadtime">'+ data.deadtime +'</span></div></div>';
		$('.winer').append($(str));
		
		$('.winer').show();
	}
	
}
