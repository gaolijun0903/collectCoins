// v2.0
//控制主角方式，改为拖动，只可横向拖动，简化定时器（合二为一）
var width = window.innerWidth;  
var height = window.innerHeight; 

// 创建游戏实例
var game = new Phaser.Game(width, height, Phaser.AUTO, '#game');

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
	        game.load.image('bg1', 'images/bg1.png');//首页-背景
	        game.load.image('title', 'images/title.png');  //首页-标题
	        game.load.image('startbtn', 'images/startbtn.png'); //首页-开始游戏按钮
	        game.load.image('rulebtn', 'images/rulesbtn.png'); //首页-活动规则按钮
	        game.load.image('myprizebtn', 'images/myprizebtn.png'); //首页-我的奖品按钮
	        game.load.image('sharebtn', 'images/sharebtn.png'); //首页-分享按钮 、  结束页-分享按钮
	        game.load.spritesheet('dude', 'images/dude.png', 32, 48); //游戏主角
	        
	        game.load.image('bg', 'images/bg.png');//游戏页-背景
	        game.load.image('header', 'images/header.png');//游戏页-头部背景
	        game.load.image('star', 'images/star.png'); //游戏页-星星
	        game.load.image('bomb', 'images/bomb.png'); //游戏页-炸弹
	        game.load.image('five', 'images/five.png'); //游戏页-加分图片 （开始倒计时暂用）
	        game.load.image('three', 'images/three.png');//游戏页-加分图片 （开始倒计时暂用）
	        game.load.image('one', 'images/one.png');//游戏页-加分图片 （开始倒计时暂用）
	        game.load.spritesheet('mute-play', 'images/mute-play.png', 41, 22); //游戏页-静音及播放
	        game.load.audio('bgMusic', 'audio/bgMusic.mp3');  //游戏页-背景音乐
	        game.load.audio('scoreMusic', 'audio/addscore.mp3');  //游戏页-加分音乐
            game.load.audio('bombMusic', 'audio/boom.mp3');  //游戏页-爆炸音乐
            
            game.load.image('discount', 'images/discount.png'); //结束页-优惠券
	        game.load.image('replaybtn', 'images/replaybtn.png'); //结束页-再玩一次
	        
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
            	game.state.start('created');
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
	        var bg = game.add.image(0, 0, 'bg1');
	        bg.width = game.world.width;
	        bg.height = game.world.height;
	        
	        // 添加静音按钮  播放
	        muteButton = game.add.button(game.world.centerX, 30, 'mute-play', onMute, this, 0, 0, 0);
	        this.judgeMute();
	        muteButton.anchor.setTo(0.5, 0.5);
	        function onMute(){
	        	this.soundManager.mute =  !this.soundManager.mute;
	        	this.judgeMute();
	        }
	        
	        // 添加标题
	        var title = game.add.text(game.world.centerX, game.world.height * 0.25, '一战到底赢大奖', {
	            fontSize: '40px',
	            fontWeight: 'bold',
	            fill: '#f2bb15'
	        });
	        title.anchor.setTo(0.5, 0.5);
	       
	        // 添加主角
	        var man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude');
	        var manImage = game.cache.getImage('dude');
	        man.width = game.world.width * 0.2;
	        man.height = game.world.width * 0.2;
	        man.anchor.setTo(0.5, 0.5);
	        man.animations.add('left', [0, 1, 2, 3], 10, true);
	  		man.animations.add('right', [5, 6, 7, 8], 10, true);
	  		man.animations.play('right');
	       
	        // 添加"开始游戏"按钮
	        startButton = game.add.button(game.world.centerX, game.world.centerY, 'startbtn', onStart, this, 2, 1, 0);
	        startButton.anchor.setTo(0.5, 0.5);
	        function onStart(){
	        	game.state.start('play');
	        }
	        
	        // 添加"活动规则"按钮
	        ruleButton = game.add.button(0, 0, 'rulebtn', showRules, this, 2, 1, 0);
	        function showRules(){
	        	$('#rule').fadeIn(100);
	        }
	        // 添加"我的奖品"按钮
	        prizeButton = game.add.button(0, 0, 'myprizebtn', showPrizes, this, 2, 1, 0);
	        var prizeButtonx = game.world.width - prizeButton.width - prizeButton.width / 2;
	        var prizeButtony = prizeButton.height / 2;
	        prizeButton.reset(prizeButtonx, prizeButtony);
	        function showPrizes(){
	        	$('#prize').fadeIn(100);
	        }
	        // 添加"分享 "按钮
	        shareButton = game.add.button(game.world.centerX, game.world.height, 'sharebtn', onShare, this, 2, 1, 0);
	        shareButton.anchor.setTo(0.5, 1.5);
	        function onShare(){
	        	alert('分享')
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
    	var grassBeltWidth = 50,
    		scoreMusic,
        	bombMusic,
        	bgMusic,
        	muteButton;
        // 是否正在触摸
		var touching = false;
        var preX = 0;
    	// 障碍物和奖励的速度
		var move_velocity = 200;
		// x滑动的最小触发距离
		var minTouchDis = width / 8;
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
    		// 添加背景
	        var bg = game.add.image(0, 0, 'bg');
	        bg.width = game.world.width;
	        bg.height = game.world.height;
    		// 开启物理世界
	    	//game.physics.startSystem(Phaser.Physics.ARCADE);
	    	//添加主角
	        this.car = this.game.add.sprite(32, game.world.height - 150, 'dude');
	        var carWidth = this.car.width;
	        var carHeight = this.car.height;
	        var posX = game.world.width * (1-(5-(1*2))/6) - carWidth / 2;
		  	var posY = game.world.height - carHeight - carHeight / 3;
	        this.car.x = posX;
	        this.car.y = posY;
	        this.car.anchor.setTo(0.5, 0.5);
	        game.physics.arcade.enable(this.car);
	        this.car.width = 60;
          	this.car.height= 60;
          	this.car.body.setSize(40,40,0,0); 
	        
	        // 创建动画
	    	this.car.animations.add('left', [0, 1, 2, 3], 10, true);
	    	this.car.animations.add('center', [4], 1, true);
	  		this.car.animations.add('right', [5, 6, 7, 8], 10, true);
	  		this.car.animations.play('center');
	  		
	  		// 创建一个group，包含20个障碍物
	        this.obstacles = game.add.group();
	        this.obstacles.enableBody = true;
	        this.obstacles.createMultiple(15, 'bomb');
	        this.obstacles.forEach(function(item){
	        	item.width = 50;
	        	item.height= 50;
	        	item.body.setSize(40,40,0,0);
	        	// kill超出边界的障碍物
		        item.checkWorldBounds = true;
		        item.outOfBoundsKill = true;
	        })
	        
	        // 创建一个group，包含10个奖励星星
	        this.stars = game.add.group();
	        this.stars.enableBody = true;
	        this.stars.createMultiple(20, 'star');
	        this.stars.forEach(function(item){
	        	// kill超出边界的障碍物
		        item.checkWorldBounds = true;
		        item.outOfBoundsKill = true;
	        })
	       
	       	// 添加头部背景
	        var bg = game.add.image(0, 0, 'header');
	        bg.width = game.world.width;
	        bg.height = 90;
	        
	        // 添加时间
			this.remainTime = 60;
	        var style = { font: "20px Arial", fill: "#ffffff" };
	        this.remainTimeText = this.game.add.text(20, 20, "时间: "+this.remainTime, style);
			
			// 添加分数
			this.score = 0;
	        var style = { font: "20px Arial", fill: "#ffffff" };
	        this.scoreText = this.game.add.text(20, 20, "分数: "+this.score, style);
	        this.scoreText.x = game.world.width - this.scoreText.width - this.scoreText.width;
	        
	        // 添加静音按钮  播放
	        muteButton = game.add.button(game.world.centerX, 30, 'mute-play', onMute, this, 0, 0, 0);
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
			    // 要判断是否点住主角，避免瞬移
    			if (Math.abs(pointer.x - this.car.x) < this.car.width / 2 && Math.abs(pointer.y - this.car.y) < this.car.height / 2){
    				 touching = true;
    			}
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
    		// 小车和奖励的碰撞监听
    		game.physics.arcade.overlap(this.car, this.stars, this.eatStarFunc, null, this);
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
	    	var imgArr = ['one','three','five'];
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
	    	// 随机[0,10)的整数，确定是创建障碍物还是星星
	    	var starNum = Math.floor(Math.random()*10);
	    	if(starNum <= 1){
	    		this.add_n_star(2);
	    	}else if(starNum <= 4){
	    		this.add_n_star(1);
	    	}else{
	    		this.add_one_obstacle();
	    	}
	    },
	    this.add_one_obstacle = function(){
	    	// 从group中获取第一个死亡的对象
	        var obstacle = this.obstacles.getFirstDead();
	        if(obstacle){
	        	// 障碍物从跑道的3个位置掉落
	        	// 随机[0,2]的整数,确定下落的跑道
	    		var num = Math.floor(Math.random()*3);
	        	var	halfRoadWidth = (game.world.width-grassBeltWidth*2)/6;
	        	var x = grassBeltWidth+ halfRoadWidth*(num*2+1)-obstacle.width/2;
		  		var y = -obstacle.height;
	        	// 重新设置位置
		        obstacle.reset(x, y);
	        }
	    },
	    this.add_n_star = function(n){
	     	// 障碍物从跑道的3个位置掉落
        	// 随机[0,2]的整数,确定下落的跑道
    		var num = Math.floor(Math.random()*3);
	     	for(var i=0;i<n;i++){
	     		// 从group中获取第一个死亡的对象
		        var star = this.stars.getFirstDead();
		        if(star){
		    		var	halfRoadWidth = (game.world.width-grassBeltWidth*2)/6;
		    		var x = grassBeltWidth+ halfRoadWidth*(num*2+1)-star.width/2;
			  		var y = (star.height+10)*(n-i-1);;
		        	// 重新设置位置
			        star.reset(x, y);
		        }
	     	}
	    },
	    this.timerCallback = function(){
	    	this.add_move_sprite();
	    	this.reduceTime();
	    },
	    this.reduceTime = function(){
	    	this.remainTime -= 0.5;
	    	//console.log(this.remainTime+"===="+parseInt(this.remainTime));
	        this.remainTimeText.text = "时间: "+parseInt(this.remainTime);
	        //随着时间进行，速度越来越快
	        var v = move_velocity + (60-this.remainTime)*20;
	        this.obstacles.forEachAlive(function(item){
	    		item.body.velocity.y = v;
	    	});
	    	this.stars.forEachAlive(function(item){
	    		item.body.velocity.y = v;
	    	});
	        // 结束场景
	        if(this.remainTime <= 0){ 
	        	this.allStopMove();
		    	//添加时间到的闹铃声音
		    	alert('时间到')
	        	game.time.events.add(1000, function(){
	        	 	game.state.start('over', true, false, this.score); 
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
	    	this.stars.forEach(function(item){
	    		item.body.velocity.y = 0;
	    	})
	    	//取消滑动监听，主角不可移动
	    	this.game.input.deleteMoveCallback(this.moveCallback,this);
	    },
	    this.crashCarFunc = function(car, obstacle){
	    	obstacle.kill();
	    	this.allStopMove();
	    	// 播放音效
    		bombMusic.play();
	    	car.animations.play('right');
	    	
	    	// 添加爆炸图片
		    var goal = game.add.image(obstacle.x, obstacle.y, 'five');
		    var goalImg = game.cache.getImage('five');
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
		            game.state.start('over', true, false, that.score); 
		        });
		    });
		    //在此把分数发送给后台
	    },
	    this.eatStarFunc = function(car, star){
	    	//console.log("吃到奖励+加分");
	        // 添加得分图片
		    var goal = game.add.image(star.x, star.y, 'one');
		    var goalImg = game.cache.getImage('one');
		    goal.width = star.width;
		    goal.height = goal.width / (goalImg.width / goalImg.height);
		    goal.alpha = 0;
		    // 添加过渡效果
		    var showTween = game.add.tween(goal).to({
		        alpha: 1,
		        y: goal.y - 20
		    }, 100, Phaser.Easing.Linear.None, true, 0, 0, false);
		    showTween.onComplete.add(function() {
		        var hideTween = game.add.tween(goal).to({
		            alpha: 0,
		            y: goal.y - 20
		        }, 100, Phaser.Easing.Linear.None, true, 200, 0, false);
		        hideTween.onComplete.add(function() {
		            goal.kill();
		        });
		    });
		    // 更新分数
		   	this.score += 1;
        	this.scoreText.text = '分数: ' + this.score; 
		    // 清除star
		    star.kill();
		    // 播放音效
    		scoreMusic.play();
	    }
    },
    // 结束场景
    over: function() {
    	var score = 0;
	    this.init = function() {
	        score = arguments[0];
	    }
	    this.create = function() {
	    	// 声音管理类
    		this.soundManager = game.sound;
	        // 添加背景
	        var bg = game.add.image(0, 0, 'bg1');
	        bg.width = game.world.width;
	        bg.height = game.world.height;
	        
	        // 添加静音按钮  播放
	        muteButton = game.add.button(game.world.centerX, 30, 'mute-play', onMute, this, 0, 0, 0);
	        this.judgeMute();
	        muteButton.anchor.setTo(0.5, 0.5);
	        function onMute(){
	        	this.soundManager.mute =  !this.soundManager.mute;
	        	this.judgeMute();
	        }
	        
	        // 添加文本
	        var title = game.add.text(game.world.centerX, game.world.height * 0.2, '游戏得分', {
	            fontSize: '28px',
	            fontWeight: 'bold',
	            fill: '#f2bb15'
	        });
	        title.anchor.setTo(0.5, 0.5);
	        var scoreStr = score+'分';
	        var scoreText = game.add.text(game.world.centerX, game.world.height * 0.25, scoreStr, {
	            fontSize: '30px',
	            fontWeight: 'bold',
	            fill: '#f2bb15'
	        });
	        scoreText.anchor.setTo(0.5, 0.5);
	        //超过98%用户
	        title.anchor.setTo(0.5, 0.5);
	        var scoreStr = '超过98%用户';
	        var scoreText = game.add.text(game.world.centerX, game.world.height * 0.3, scoreStr, {
	            fontSize: '20px',
	            fontWeight: 'bold',
	            fill: '#f2bb15'
	        });
	        scoreText.anchor.setTo(0.5, 0.5);
	        // 添加文本“恭喜获得”
	        var title = game.add.text(game.world.centerX, game.world.height * 0.4, '恭喜获得', {
	            fontSize: '20px',
	            fontWeight: 'bold',
	            fill: '#f2bb15'
	        });
	        title.anchor.setTo(0.5, 0.5);
	        
	        //优惠券
	        var discount = game.add.image(game.world.centerX, game.world.height * 0.5, 'discount');
	        discount.width = game.world.width*0.6;
	        discount.height = 60;
	        discount.anchor.setTo(0.5, 0.5);
	        
	        // 添加"再玩一次 "按钮
	        replayButton = game.add.button(game.world.centerX, game.world.height * 0.75, 'replaybtn', onReplay, this, 2, 1, 0);
	        replayButton.anchor.setTo(0.5, 0.5);
	        function onReplay(){
	        	game.state.start('play');
	        }
			
			 // 添加"分享 "按钮
	        startButton2 = game.add.button(game.world.centerX, game.world.height * 0.85, 'sharebtn', onShare2, this, 2, 1, 0);
	        startButton2.anchor.setTo(0.5, 1.5);
	        function onShare2(){
	        	alert('分享')
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
    }
};

// 添加场景到游戏示例中
Object.keys(states).map(function(key) {
	game.state.add(key, states[key]);
});

// 启动游戏
game.state.start('preload');