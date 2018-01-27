// current --3.0
//
var width = window.innerWidth;  
var height = window.innerHeight; 

// 创建游戏实例
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game');

// 定义场景
var states = {
	// 加载场景
    preload: function() {
    	this.preload = function() {
    		console.log("preload");
	        // 设置背景为黑色
	        game.stage.backgroundColor = '#FFFFFF';
	        // 加载游戏资源
	        game.load.crossOrigin = 'anonymous'; // 设置跨域
	        game.load.image('homepagebg', 'images/homepagebg.png');//首页-背景
	        game.load.image('startbtn', 'images/startbtn.png'); //首页-开始游戏按钮
	        game.load.image('rulebtn', 'images/rulesbtn.png'); //首页-活动规则按钮
	        game.load.image('myprizebtn', 'images/myprizebtn.png'); //首页-我的奖品按钮
	        game.load.image('sharebtn', 'images/sharebtn.png'); //首页-分享按钮 、  结束页-分享按钮
	        
	       
	        game.load.image('playbg', 'images/playbg.png');//游戏页-背景
	        game.load.image('timerbg', 'images/timerbg.png');//游戏页-定时器背景
	        game.load.image('playcount', 'images/playcount.png');//游戏页-游戏次数背景
	        game.load.image('coinbg', 'images/coinbg.png');//游戏页-金币数背景
	        game.load.spritesheet('dude', 'images/dude.png', 47, 55); //游戏页-游戏主角
	        game.load.spritesheet('coin', 'images/coin1.png', 162, 162); //游戏页-金币
	        //game.load.spritesheet('coin', 'images/coin.png', 56 ,56); //游戏页-金币
	        game.load.image('stone', 'images/stone.png'); //游戏页-石头
	        game.load.image('roadblock', 'images/roadblock.png');//游戏页-路障
	        game.load.image('garbagecan', 'images/garbagecan.png');//游戏页-垃圾桶
	        game.load.image('crash', 'images/crash.png');  //游戏页-碰撞
	        game.load.image('plus100', 'images/plus100.png'); //游戏页-加分图片 
	        game.load.image('three', 'images/three.png'); //游戏页-开始倒计时
	        game.load.image('two', 'images/two.png');//游戏页-开始倒计时
	        game.load.image('one', 'images/one.png');//游戏页-开始倒计时
	        game.load.spritesheet('mute-play', 'images/mute-play.png', 32, 23); //游戏页-静音及播放
	        game.load.audio('bgMusic', 'audio/bgMusic.mp3');  //游戏页-背景音乐
	        game.load.audio('scoreMusic', 'audio/addscore.mp3');  //游戏页-加分音乐
            game.load.audio('bombMusic', 'audio/boom.mp3');  //游戏页-爆炸音乐
            
            // 添加进度文字
            var progressText = game.add.text(game.world.centerX, game.world.centerY, '0%', {
                fontSize: '60px',
                fill: '#eee'
            });
            progressText.anchor.setTo(0.5, 0.5);
            // 监听加载完一个文件的事件
            game.load.onFileComplete.add(function(progress) {
                progressText.text = progress + '%';
            });
            // 监听加载完毕事件
            game.load.onLoadComplete.add(onLoad);
            // 加载完毕回调方法
            function onLoad() {
            	//ajax请求数据，希望数据返回，并且资源加载完毕后才进入created场景
            	isLogin = true;//TODO ajax获取
            	gameNum = 2;//TODO ajax获取
            	game.state.start('created'); //应放在success里
            	//initData();  TODO
            }
	    }
    },
    // 开始场景
    created: function() {
    	var button,muteButton;
    	this.create = function() {
    		// 声音管理类 
    		this.soundManager = game.sound;
            // 添加背景
	        var bg = game.add.image(0, 0, 'homepagebg');
	        bg.width = game.world.width;
	        bg.height = game.world.height;
	        // 添加"活动规则"按钮
	        ruleButton = game.add.button(game.world.width -60-9 , 20, 'rulebtn', showRules, this, 2, 1, 0);
	        function showRules(){
	        	$('#rule').fadeIn(100);
	        }
	        // 添加"我的奖品"按钮
	        prizeButton = game.add.button(16, 16, 'myprizebtn', showPrizes, this, 2, 1, 0);
	        function showPrizes(){
	        	if(!isLogin){//未登录
	        		//我的奖品、开始游戏 、分享，提示登录；游戏次数为'--'
	        		$('#loginMask').show();
	        		/*if(inApp){  //TODO
                		//端内登录地址
	                }else{
	                	$('#loginMask').show();
	                }*/
	        		return 
	        	}
	        	$('#prize').fadeIn(100);
	        }
	        
	       	// 添加"我有几次游戏机会"
            var gamecountText = game.add.text(game.world.centerX, game.world.height-140, '我有'+ gameNum +'次游戏机会', { fontSize: '18px', fill: '#FFFFFF' });
            gamecountText.anchor.setTo(0.5, 1);
            
	        // 添加"开始游戏"按钮
	        startButton = game.add.button(game.world.centerX, game.world.height-90, 'startbtn', onStart, this);
	        startButton.anchor.setTo(0.5, 1);
	        function onStart(){
	        	if(!isLogin){//未登录
	        		//我的奖品、开始游戏 、分享，提示登录；游戏次数为'--'
	        		$('#loginMask').show();
	        		/*if(inApp){
                		//端内登录地址
	                }else{
	                	$('#loginMask').show();
	                }*/
	        		return 
	        	}
	        	if(gameNum<=0){
	        		alert('分享可获得游戏机会');
	        		return
	        	}
	        	gameNum-=1;
	        	//startGame();  //TODO
	        	game.state.start('play');
	        }
	        
	        // 添加"分享 "按钮
	        shareButton = game.add.button(game.world.centerX, game.world.height-35, 'sharebtn', onShare, this, 2, 1, 0);
	        shareButton.anchor.setTo(0.5, 1);
	        function onShare(){
	        	if(!isLogin){//未登录
	        		//我的奖品、开始游戏 、分享，提示登录；游戏次数为'--'
	        		$('#loginMask').show();
	        		/*if(inApp){
                		//端内登录地址
	                }else{
	                	$('#loginMask').show();
	                }*/
	        		return 
	        	}
	        	alert('分享') //TODO
	            //shareFn();
	        
	        }
	        
	        // 添加静音按钮  播放
	        muteButton = game.add.button(game.world.width-32-14, game.world.height-23-14, 'mute-play', onMute, this, 0, 0, 0);
	        this.judgeMute();
	        muteButton.anchor.setTo(0.5, 0.5);
	        function onMute(){
	        	this.soundManager.mute =  !this.soundManager.mute;
	        	this.judgeMute();
	        }
       },
        this.judgeMute = function(update){
	    	if(update){
	    		if(this.soundManager.mute){
	        		muteButton.angle = 0;
	        	}else{
	        		muteButton.angle += 1;
	        	}
	    	}else{
	    		if(this.soundManager.mute){
	        		muteButton.setFrames(1, 1,1);
	        	}else{
	        		muteButton.setFrames(0, 0,0);
	        	}
	    	}
        }
    },
    // 游戏场景
    play: function() {
    	var grassBeltWidth = 30,
    		scoreMusic,
        	bombMusic,
        	bgMusic,
        	muteButton, 
        	preX = 0,
        	touching = false, // 是否正在触摸
        	move_velocity = 200, // 障碍物和奖励的速度
        	minTouchDis = width / 8, // x滑动的最小触发距离
        	obstaclesTypes = ['stone','roadblock','garbagecan'];
       
    	this.create = function(){
    		// 声音管理类
    		this.soundManager = game.sound;
    		// 添加背景音乐
            if (!bgMusic) {
                bgMusic = game.add.audio('bgMusic');
                bgMusic.loopFull();
            }
            // 缓存其他音乐
            scoreMusic = game.add.audio('scoreMusic');
            bombMusic = game.add.audio('bombMusic');
    		// 添加背景 无限滚动
	       	this.bg = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'playbg'); 
	        game.physics.enable(this.bg, Phaser.Physics.ARCADE); 
	        // 滚动背景的像素宽高
	        this.bgImg = game.cache.getImage('playbg');
	        this.bg.tileScale.x = game.world.width / this.bgImg.width;
	        this.bg.tileScale.y = game.world.height / this.bgImg.height;
    		
	    	//添加主角
	        this.car = this.game.add.sprite(game.world.centerX, game.world.height - 100, 'dude');
	        this.car.width = 120;
          	this.car.height= 140;
	        this.car.anchor.setTo(0.5, 0.5);
	        game.physics.arcade.enable(this.car);
          	this.car.body.setSize(30,60,0,0); 
	        // 创建动画
	    	this.car.animations.add('left', [8], 10, true);
	    	this.car.animations.add('center', [0,2,4,6], 10, true);
	  		this.car.animations.add('right', [12], 10, true);
	  		this.car.animations.add('over', [16], 10, true)
	  		this.car.animations.play('center');
	  		
	        // 创建一个group，包含coin  stone  roadblock  garbagecan
	        this.obstacles = game.add.group();
	        this.obstacles.enableBody = true;
	       
	       	// 添加时间背景
	        var timerbg = game.add.image(19, 16, 'timerbg');
	        // 添加时间
			this.remainTime = 60;
	        var style = { font: "20px Arial", fill: "#ffffff" };
	        this.remainTimeText = this.game.add.text(62, 25, "01：00", style);
			
			// 添加次数背景
	        var timerbg = game.add.image(game.world.centerX, 42, 'playcount');
	        timerbg.anchor.setTo(0.5, 0.5);
	        // 添加次数
	        var style = { font: "22px Arial", fill: "#ffffff" };
	        this.remainCountText = this.game.add.text(game.world.centerX, 42, gameNum, style);
	        this.remainCountText.anchor.setTo(0.5, 0.5);
	        
			// 添加分数背景
	        var coinbg = game.add.image(game.world.width-19-112, 16, 'coinbg');
			// 添加分数
			this.score = 0;
	        var style = { font: "20px Arial", fill: "#ffffff" };
	        this.scoreText = this.game.add.text(game.world.width-19-90, 25, " "+this.score, style);
	        
	        // 添加静音按钮  播放
	        muteButton = game.add.button(game.world.width-32-14, game.world.height-23-14, 'mute-play', onMute, this, 0, 0, 0);
	        this.judgeMute();
	        muteButton.anchor.setTo(0.5, 0.5);
	        function onMute(){
	        	this.soundManager.mute =  !this.soundManager.mute;
	        	this.judgeMute();
	        }
	        
			// 监听滑动事件
			this.game.input.addMoveCallback(this.moveCallback,this);
			// 监听按下事件
			game.input.onDown.add(function(pointer) {
				touching = true;
			},this);
			// 监听离开事件
			this.game.input.onUp.add(function(pointer) {
				touching = false;
				this.car.animations.play('center');
			},this);
			
			//第一次游戏展示引导页
			var that = this;
			var firstplay = window.localStorage.getItem("firstplay");
			if(!firstplay){
				$('#leadPage').fadeIn(100);
				firstplay = window.localStorage.setItem("firstplay",true);
			}else {
				this.ThreeTwoOne();//321开始倒计时
			}
			$("#close_leadPage").click(function(){
				$('#leadPage').fadeOut(100);
				that.ThreeTwoOne();//321开始倒计时
			})
    	},
    	this.update = function(){
    		this.judgeMute(1);
    		// 小车和障碍物的碰撞监听
    		game.physics.arcade.overlap(this.car, this.obstacles, this.crashCarFunc, null, this);
    	},
    	this.moveCallback = function(pointer, x, y, isTap) {
			if (isTap || !touching) return
			if(preX<x){//右划
				this.car.animations.play('right');
			}else if(preX==x){
				this.car.animations.play('center');
			}else if(preX>x){//向左
				this.car.animations.play('left');
			}
			preX = x;
			if( x <= grassBeltWidth + this.car.width/2){
				this.car.x =  grassBeltWidth + this.car.width/2;
			}else if(x >= (game.world.width - grassBeltWidth - this.car.width/2)){
				this.car.x = game.world.width - grassBeltWidth - this.car.width/2;
			}else{
				this.car.x = x;
			}
		},
	    this.ThreeTwoOne = function(numImg){
	    	var num =3;
	    	var imgArr = ['one','two','three'];
	    	var ThreeTwoOneTimer = game.time.events.loop(1000,function(){
	    		if(num<=0){
	    			game.time.events.remove(ThreeTwoOneTimer)
	    			// 监听滑动事件
					//this.game.input.addMoveCallback(this.moveCallback,this);  //放在此处防止倒计时结束前可以拖动主角
	    			// 定时器，倒计时
		        	this.reduceTimer = game.time.events.loop(500, this.timerCallback, this); 
	    			return
	    		}
	    		this.tweenImg(imgArr[num-1]);
	    		num--;
	    	},this)
	    },
	    this.tweenImg = function(numImg){
	    	// 添加得分图片
		    var goal = game.add.image(game.world.centerX, game.world.centerY, numImg);
		    var goalImg = game.cache.getImage(numImg);
		    goal.width = 0;
		    goal.height = 0;
		    goal.anchor.setTo(0.5,0.5);
		    goal.alpha = 0;
		    // 添加过渡效果
		    var showTween = game.add.tween(goal).to({
		        alpha: 1,
		        width : game.world.width/3,
		    	height : game.world.width/3
		    }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
		    showTween.onComplete.add(function() {
		        var hideTween = game.add.tween(goal).to({
		            alpha: 0,
		            width : 0,
		    		height : 0
		        }, 200, Phaser.Easing.Linear.None, true, 200, 0, false);
		        hideTween.onComplete.add(function() {
		            
		        });
		    });
	    },
	   	this.judgeMute = function(update){
	    	if(update){
	    		if(this.soundManager.mute){
	        		muteButton.angle = 0;
	        	}else{
	        		muteButton.angle += 1;
	        	}
	    	}else{
	    		if(this.soundManager.mute){
	        		muteButton.setFrames(1, 1,1);
	        	}else{
	        		muteButton.setFrames(0, 0,0);
	        	}
	    	}
        },
	    this.add_move_sprite = function(){
	    	var starNum = Math.floor(Math.random()*10);
	    	//console.log(starNum)
	    	if(starNum <= 3){
	    		this.addmystones('coin',1);
	    	}else if(starNum <= 5){
	    		this.addmystones('coin',2);
	    	}else if(starNum <= 6){
	    		this.addmystones('stone',1);
	    	}else if(starNum <= 8){
	    		this.addmystones('roadblock',1);
	    	}else{
	    		this.addmystones('garbagecan',1);
	    	}
	    },
	    this.addmystones = function(type,n){
	    	// 随机[0,2]的整数,确定下落的跑道
		    var num = Math.floor(Math.random()*3);
	    	for(var i=0;i<n;i++){
		    	// 从group中获取第一个死亡的对象
		        //var obstacle = this.obstacles.getFirstDead();
		        //if(obstacle){
			  		var obstacle = this.obstacles.create(0, 0, type);
			  		obstacle.width = 70;
		        	obstacle.height= 70;
		        	obstacle.body.setSize(40,40,0,0);
		        	// kill超出边界的障碍物
			        obstacle.checkWorldBounds = true;
			        obstacle.outOfBoundsKill = true;
			  		obstacle.type = type;
		        	var	halfRoadWidth = (game.world.width-grassBeltWidth*2)/6;
		        	var x = grassBeltWidth+ halfRoadWidth*(num*2+1)-obstacle.width/2;
			  		var y = -obstacle.height;
			  		// 重新设置位置
			        obstacle.reset(x, y);
			        if(type==='coin'){
			        	// 创建动画
				    	obstacle.animations.add('jump', [0, 1,2,3], 8, true);
				  		obstacle.animations.play('jump');
			        }
			    //}   
			}
       	},
	    this.timerCallback = function(){
	    	this.add_move_sprite();
	    	this.reduceTime();
	    },
	    this.reduceTime = function(){
	    	this.remainTime -= 0.5;
	    	var timeStr = parseInt(this.remainTime)<10 ? '0'+parseInt(this.remainTime) : parseInt(this.remainTime);
	        this.remainTimeText.text = "00: "+timeStr;
	        //随着时间进行，速度越来越快
	        var v = move_velocity + (60-this.remainTime)*20;
	        this.bg.autoScroll(0, v/(game.world.height / this.bgImg.height));
	        this.obstacles.forEachAlive(function(item){
	    		item.body.velocity.y = v;
	    	});

	        // 结束场景
	        if(this.remainTime <= 0){ 
	        	this.allStopMove();
	        	// 设置背景静止
	    		this.bg.autoScroll(0, 0);
		    	//添加时间到的闹铃声音
		    	alert('时间到')
		    	var that = this;
	        	game.time.events.add(1000, function(){
	        		//that.soundManager.mute = false;
	        		showOver(this.score);//展示“游戏结束”，并把分数发送给后台 TODO
	        	}, this);
	        }
	    },
	    this.allStopMove = function(){
	    	// 移除定时器
        	this.game.time.events.remove(this.reduceTimer);
        	//让星星和障碍停止运动
	    	this.obstacles.forEach(function(item){
	    		item.body.velocity.y = 0;
	    	})
	    	//取消滑动监听，主角不可移动
	    	this.game.input.deleteMoveCallback(this.moveCallback,this);
	    },
	    this.crashCarFunc = function(car, obstacle){
	    	obstacle.kill();
	    	var imageName = '';
	    	if(obstacle.type==='coin'){
	    		imageName = 'plus100';
	    		// 更新分数
			   	this.score += 1;
	        	this.scoreText.text =  this.score; 
			    // 播放音效
	    		scoreMusic.play();
	    	}else{
	    		// 设置背景静止
	    		this.bg.autoScroll(0, 0);
	    		imageName = 'crash';
	    		this.allStopMove();
	    		// 播放音效
	    		bombMusic.play();
	    	}
	    	
	    	// 添加得分或碰撞图片
		    var goal = game.add.image(obstacle.x, obstacle.y, imageName);
		    var goalImg = game.cache.getImage(imageName);
		    goal.width = obstacle.width;
		    goal.height = goal.width / (goalImg.width / goalImg.height);
		    goal.alpha = 0;
		    // 添加过渡效果
		    var showTween = game.add.tween(goal).to({
		        alpha: 1,
		        y: goal.y - 20
		    }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
		    var that = this;
		    showTween.onComplete.add(function() {
		        var hideTween = game.add.tween(goal).to({
		            alpha: 0,
		            y: goal.y - 20
		        }, 100, Phaser.Easing.Linear.None, true, 200, 0, false);
		        hideTween.onComplete.add(function() {
		            goal.kill();
		            if(obstacle.type==='coin') return
		            game.time.events.add(1000, function(){
		            	//that.soundManager.mute = false;
		        		showOver(this.score);//展示“游戏结束”，并把分数发送给后台 TODO
		        		
		        	}, this);
		        });
		    });
	    }
    }
};

// 添加场景到游戏示例中
Object.keys(states).map(function(key) {
	game.state.add(key, states[key]);
});

// 启动游戏
game.state.start('preload');