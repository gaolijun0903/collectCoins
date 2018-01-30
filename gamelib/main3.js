// current --3.0
// v3.0
//点击屏幕任意位置，可拖动主角
//生成障碍和金币的方法合二为一
var width = window.innerWidth;  
var height = window.innerHeight; 
var spicJson = {"frames":[{"filename":"coinbg","frame":{"x":2,"y":201,"w":112,"h":41},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":112,"h":41},"sourceSize":{"w":112,"h":41}},{"filename":"crash","frame":{"x":2,"y":244,"w":93,"h":76},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":93,"h":76},"sourceSize":{"w":93,"h":76}},{"filename":"garbagecan","frame":{"x":170,"y":174,"w":81,"h":61},"rotated":false,"trimmed":true,"spriteSourceSize":{"x":0,"y":12,"w":81,"h":61},"sourceSize":{"w":81,"h":81}},{"filename":"loadingbar","frame":{"x":2,"y":66,"w":176,"h":12},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":176,"h":12},"sourceSize":{"w":176,"h":12}},{"filename":"loadingbg","frame":{"x":2,"y":2,"w":188,"h":62},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":188,"h":62},"sourceSize":{"w":188,"h":62}},{"filename":"myprizebtn","frame":{"x":180,"y":79,"w":65,"h":48},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":65,"h":48},"sourceSize":{"w":65,"h":48}},{"filename":"one","frame":{"x":2,"y":322,"w":36,"h":74},"rotated":false,"trimmed":true,"spriteSourceSize":{"x":9,"y":0,"w":36,"h":74},"sourceSize":{"w":52,"h":74}},{"filename":"playcount","frame":{"x":170,"y":298,"w":49,"h":49},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":49,"h":49},"sourceSize":{"w":49,"h":49}},{"filename":"plus100","frame":{"x":97,"y":310,"w":45,"h":13},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":45,"h":13},"sourceSize":{"w":45,"h":13}},{"filename":"roadblock","frame":{"x":192,"y":2,"w":59,"h":75},"rotated":false,"trimmed":true,"spriteSourceSize":{"x":12,"y":2,"w":59,"h":75},"sourceSize":{"w":81,"h":81}},{"filename":"rulesbtn","frame":{"x":177,"y":129,"w":58,"h":43},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":58,"h":43},"sourceSize":{"w":58,"h":43}},{"filename":"sharebtn","frame":{"x":2,"y":80,"w":173,"h":39},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":173,"h":39},"sourceSize":{"w":173,"h":39}},{"filename":"startbtn","frame":{"x":2,"y":121,"w":173,"h":35},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":173,"h":35},"sourceSize":{"w":173,"h":35}},{"filename":"stone","frame":{"x":170,"y":237,"w":81,"h":59},"rotated":false,"trimmed":true,"spriteSourceSize":{"x":0,"y":11,"w":81,"h":59},"sourceSize":{"w":81,"h":81}},{"filename":"three","frame":{"x":116,"y":234,"w":52,"h":74},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":52,"h":74},"sourceSize":{"w":52,"h":74}},{"filename":"timerbg","frame":{"x":2,"y":158,"w":112,"h":41},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":112,"h":41},"sourceSize":{"w":112,"h":41}},{"filename":"two","frame":{"x":116,"y":158,"w":52,"h":74},"rotated":false,"trimmed":false,"spriteSourceSize":{"x":0,"y":0,"w":52,"h":74},"sourceSize":{"w":52,"h":74}}],"meta":{"app":"http://www.texturepacker.com","version":"1.0","image":"littlepic.png","format":"RGBA8888","size":{"w":256,"h":512},"scale":"1","smartupdate":"$TexturePacker:SmartUpdate:58acf86a3872a15ce4999f79014e07a7$"}};

// 创建游戏实例
var game = new Phaser.Game(width, height, Phaser.CANVAS, 'game',true);

// 定义场景
var states = {
	// boot场景
	boot: function(){
		this.preload = function(){
			// 加载游戏资源
			game.load.image('loadingbg', '//i1.yongche.name/media/g2/M02/1B/3C/rBEBP1psgt2IQiGTAAAoFpSO9-sAAK3pwDtc0IAACgu105.png');
	        game.load.image('loadingbar', '//i2.yongche.name/media/g2/M02/1A/29/rBEBP1psgt2IFDjJAAADk5OHafEAAKXpgP__FUAAAOr234.png');
		},
		this.create = function(){
			game.add.image(0,0,'loadingbg');
		},
		this.render = function(){
			game.state.start('preload');
		}
	},
	// 加载场景
    preload: function() {
    	this.preload = function() {
    		console.log("preload");
	        var loadingbg = game.add.sprite(game.world.centerX,game.world.centerY,"loadingbg");
	        var loadingbar = game.add.sprite(0,0,"loadingbar");
	        loadingbar.reset(game.world.centerX-loadingbar.width/2,game.world.centerY);
	        loadingbg.anchor.setTo(0.5, 0.5);
	        loadingbar.anchor.setTo(0, -1.05);
	        
	        game.load.setPreloadSprite(loadingbar);
	        
	        // 加载游戏资源
	        game.load.image('homepagebg', '//i1.yongche.name/media/g2/M02/1B/3C/rBEBJVpsgt6IHjdVAAUk18WQAk8AAK3pwDoAbIABSTv734.png');//首页-背景
	        game.load.image('playbg', '//i2.yongche.name/media/g2/M02/1B/3C/rBEBJVpshD-IRIH5AAwuu5PgIhoAAK3pwF50ssADC7T160.png');//游戏页-背景
	        game.load.spritesheet('dude', '//i2.yongche.name/media/g2/M04/1B/3F/rBEBP1pu2gyIW3vsAAAltAReuR4AAK5CwM909gAACXM672.png', 66, 105); //游戏页-游戏主角
	        game.load.spritesheet('coin', '//i2.yongche.name/media/g2/M02/1B/3C/rBEBP1psgt2IIJy2AAA9w4g5HbIAAK3pwDnR-UAAD3b307.png', 81, 81); //游戏页-金币
	        game.load.spritesheet('mute-play', '//i3.yongche.name/media/g2/M02/1B/3C/rBEBJVpsgt6IVvREAAANsPV9iJMAAK3pwDt1CMAAA3I754.png', 32, 23); //游戏页-静音及播放
	        game.load.audio('bgMusic', 'audio/bgMusic.mp3');  //游戏页-背景音乐
	        game.load.audio('scoreMusic', 'audio/addscore.mp3');  //游戏页-加分音乐
            game.load.audio('bombMusic', 'audio/boom.mp3');  //游戏页-爆炸音乐
            //game.sound.usingWebAudio = false;
			//game.sound.usingAudioTag = true;
            game.load.atlas("spic", "//i1.yongche.name/media/g2/M02/1B/3C/rBEBJVpshD-IM3RqAAEK2zr4or4AAK3pwGGQR4AAQrz533.png", null,spicJson);//精灵图

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
	        ruleButton = game.add.button(game.world.width -60-9 , 20,'spic',  showRules, this, 'rulesbtn','rulesbtn', 'rulesbtn');
	        function showRules(){
	        	$('#rule').fadeIn(100);
	        }
	        // 添加"我的奖品"按钮
	        prizeButton = game.add.button(16, 16,'spic', showPrizes, this, 'myprizebtn', 'myprizebtn', 'myprizebtn');
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
	        startButton = game.add.button(game.world.centerX, game.world.height-90, 'spic', onStart, this,'startbtn','startbtn','startbtn');
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
	        shareButton = game.add.button(game.world.centerX, game.world.height-35, 'spic', onShare, this, 'sharebtn', 'sharebtn', 'sharebtn');
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
	            shareFn();//'分享'
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
        	move_velocity = 200, // 障碍物和奖励的速度
        	minTouchDis = width / 8, // x滑动的最小触发距离
        	obstaclesTypes = ['stone','roadblock','garbagecan'];
       	
    	this.create = function(){
    		console.log('play-create')
    		this.touching = false; // 是否正在触摸
       		this.isAllStop=false;
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
	        this.car.width = 99;
          	this.car.height= 157.5;
	        this.car.anchor.setTo(0.5, 0.5);
	        game.physics.arcade.enable(this.car);
          	this.car.body.setSize(40,73,13,5);  
	        // 创建动画
	    	this.car.animations.add('left', [4], 10, true);
	    	this.car.animations.add('center', [0,1,2,3], 10, true);
	  		this.car.animations.add('right', [5], 10, true);
	  		this.car.animations.add('over', [6], 10, true);
	  		this.car.animations.play('center');
	  		
	        // 创建一个group，包含coin  stone  roadblock  garbagecan
	        this.obstacles = game.add.group();
	        this.obstacles.enableBody = true;
	       
	       	// 添加时间背景
	        var timerbg = game.add.image(19, 16,'spic', 'timerbg');
	        // 添加时间
			this.remainTime = 60;
	        var style = { font: "20px Arial", fill: "#ffffff" };
	        this.remainTimeText = this.game.add.text(62, 25, "01：00", style);
			
			// 添加次数背景
	        var timerbg = game.add.image(game.world.centerX, 42, 'spic','playcount');
	        timerbg.anchor.setTo(0.5, 0.5);
	        // 添加次数
	        var style = { font: "22px Arial", fill: "#ffffff" };
	        this.remainCountText = this.game.add.text(game.world.centerX, 42, gameNum, style);
	        this.remainCountText.anchor.setTo(0.5, 0.5);
	        
			// 添加分数背景
	        var coinbg = game.add.image(game.world.width-19-112, 16, 'spic','coinbg');
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
			game.input.onDown.add(this.onDownCb,this);
			// 监听离开事件
			this.game.input.onUp.add(this.onUpCb,this);
			
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
		this.render = function() {
		    game.debug.bodyInfo(this.car, 32, 32);// 在坐标（32，32）位置显示文本debug信息
		    game.debug.body(this.car);// 绘制矩形body
		    this.obstacles.forEach(function(item){
		    	game.debug.body(item);// 绘制矩形body
		    })
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
		this.onDownCb = function(pointer) {
			touching = true;
		},
		this.onUpCb = function(pointer) {
			touching = false;
			if(this.isAllStop){
				return
			}
			this.car.animations.play('center');
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
	    	// 添加3,2,1图片
		    var goal = game.add.image(game.world.centerX, game.world.centerY,'spic', numImg);
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
		    var	halfRoadWidth = (game.world.width-grassBeltWidth*2)/6;
	    	for(var i=0;i<n;i++){
	        	var obstacle;
	        	var y;
	        	if(type==='coin'){
	        		obstacle = this.obstacles.create(0, 0, type);
		        	// 创建动画
			    	obstacle.animations.add('jump', [0, 1,2,3], 8, true);
			  		obstacle.animations.play('jump');
			  		y = (70)*(n-i-1);
		        }else{
		        	obstacle = this.obstacles.create(0, 0,'spic', type);
		        	y = 0;
		        }
		        var x = grassBeltWidth+ halfRoadWidth*(num*2+1)-obstacle.width/2;
		  		// 重新设置位置
		        obstacle.reset(x, y);
		  		obstacle.type = type;
		  		obstacle.width = 70;
	        	obstacle.height= 70;
	        	obstacle.body.setSize(48,50,15,10);
	        	// kill超出边界的障碍物
		        obstacle.checkWorldBounds = true;
		        obstacle.outOfBoundsKill = true;
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
		    	console.log(this.score);
		    	var that = this;
	        	game.time.events.add(1000, function(){
	        		//that.soundManager.mute = false;
	        		console.log(this.score);
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
	    	this.isAllStop = true;
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
	    		this.car.animations.play('over');
	    		imageName = 'crash';
	    		this.allStopMove();
	    		// 播放音效
	    		bombMusic.play();
	    	}
	    	
	    	// 添加得分或碰撞图片
		    var goal = game.add.image(obstacle.x, obstacle.y,'spic', imageName);
		    goal.alpha = 0;
		    // 添加过渡效果
		    var showTween = game.add.tween(goal).to({
		        alpha: 1,
		        y: goal.y - 20
		    }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
		    var that = this;
		   // console.log(this.score);
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
		        		showOver(that.score);//展示“游戏结束”，并把分数发送给后台 TODO
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
game.state.start('boot');