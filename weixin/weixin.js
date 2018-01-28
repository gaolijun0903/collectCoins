//端内分享相
var Tools;
function ajaxShare(obj){
    // 分享变量设置
    var _protocolLink = "yongche://share?";
    var _protocolLinkFriend = "yongche://shareToFriend?";
    var _protocolLinkTimeline = "yongche://shareToTimeline?";

    // 分享地址
    //var query = encodeURIComponent("&language="+obj.activity_language+"&sendName="+obj.sendName+"&sendMoney="+obj.sendMoney+"&sendIphone="+obj.sendIphone+"&headImg="+obj.headImg);
    var shareRead_link = encodeURIComponent(obj.url);

    // 分享的图片
    var shareRead_pics = encodeURIComponent("http://i3.yongche.Name/media/g2/M01/1A/35/rBEBJVo82ViIBg3PAAAydsM-krwAAKcAAK_ajsAADKO105.jpg");

    // 分享的标题
    var shareRead_title = encodeURIComponent(obj.title);
    // 分享的内容
    var shareRead_content = encodeURIComponent(obj.description);
    // 分享的需要生成二维码地址
    var shareRead_codeUrl = encodeURIComponent("://m.yongche.com");
    var shareRead_sourceType = 42; //1-截图分享 42-图文分享
    var shareRead_callback = "share_callback";

    Tools = {
        shareThisPage:function(){
            var _str = "link="+shareRead_link+"&pics="+shareRead_pics+"&title="+shareRead_title+"&content="+shareRead_content+"&sourceType="+shareRead_sourceType+"&callback="+shareRead_callback+"&codeUrl="+shareRead_codeUrl;
            var _tmpOpenLink = _protocolLink + _str;
            window.location.href = _tmpOpenLink;
        },
        shareThisPageToFriend:function(){
            var _str = "link="+shareRead_link+"&pics="+shareRead_pics+"&title="+shareRead_title+"&content="+shareRead_content+"&sourceType="+shareRead_sourceType+"&callback="+shareRead_callback+"&codeUrl="+shareRead_codeUrl;
            var _tmpOpenLink = _protocolLinkFriend + _str;
            window.location.href = _tmpOpenLink;
        },
        shareThisPageToTimeline:function(){
            var _str = "link="+shareRead_link+"&pics="+shareRead_pics+"&title="+shareRead_title+"&content="+shareRead_content+"&sourceType="+shareRead_sourceType+"&callback="+shareRead_callback+"&codeUrl="+shareRead_codeUrl;
            var _tmpOpenLink = _protocolLinkTimeline + _str;
            window.location.href = _tmppenLOink;
        }
    };
    var _str = "link="+shareRead_link+"&pics="+shareRead_pics+"&title="+shareRead_title+"&content="+shareRead_content+"&sourceType="+shareRead_sourceType+"&from=iframe&callback="+shareRead_callback;
    var _tmpOpenLink = _protocolLink + _str;
    console.log(_tmpOpenLink);
}
	
//微信二次分享	       
(function ($) {
    $.fn.wxShare = function (oParam) {
        var shareImg = oParam.shareImg;
        var shareTitle = oParam.shareTitle;
        var shareContent = oParam.shareContent;
        var shareUrl = oParam.shareUrl;
        $.ajax({
            url:"//weixin.yongche.com/wechat/jssdk/config?url="+encodeURIComponent(window.location.href),
            method:'get',
            dataType:'jsonp'
        }).done(function(data){
            console.log(data);
            if(data.code==200){
                wx_share(data.result);
            }
        }).fail(function(error){
            //console.log(error)
        });
        function wx_share(jsData) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: jsData.appId, // 必填，公众号的唯一标识
                timestamp: jsData.timestamp, // 必填，生成签名的时间戳
                nonceStr: jsData.nonceStr, // 必填，生成签名的随机串
                signature: jsData.signature,// 必填，签名，见附录1
                jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ','onMenuShareWeibo'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function(){
                var shareData =
                    {
                        link:shareUrl,
                        imgUrl:shareImg,
                        title:shareTitle,
                        desc:shareContent,
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    };
                wx.onMenuShareAppMessage(shareData);
                wx.onMenuShareTimeline(shareData);
                wx.onMenuShareQQ(shareData);
                //alert('ok');
            });
        }
    }

    window.wxShareFn = function(oParam){
        $.fn.wxShare(oParam);
    }

})(jQuery);
	
//GA
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-18761483-4', 'auto');  ga('send', 'pageview');
  