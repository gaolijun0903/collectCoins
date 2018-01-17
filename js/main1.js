// 实际应用场景改为window.innerWidth和window.innerHeight。
// 这里是为了方便查看示例。
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
	        game.load.image('bg', 'images/bg.png');//游戏页面的背景
	        game.load.image('bg1', 'images/bg1.png');//开始页面的背景
	        game.load.image('dude1', 'images/dude1.png');  //开始页面的人物
            game.load.spritesheet('dude', 'images/dude.png', 32, 48); //游戏页面移动的人物
	        game.load.image('startbtn', 'images/startbtn.png'); //开始游戏按钮
	        game.load.image('rulebtn', 'images/rulesbtn.png'); //活动规则按钮
	        game.load.image('myprizebtn', 'images/myprizebtn.png'); //我的奖品按钮
	        game.load.image('sharebtn', 'images/sharebtn.png'); //我的奖品按钮
	       
	        game.load.image('bomb', 'images/bomb.png');
	        game.load.image('five', 'images/five.png');
	        game.load.image('three', 'images/three.png');
	        game.load.image('one', 'images/one.png');
	        game.load.audio('bgMusic', 'audio/bgMusic.mp3');
	        game.load.audio('scoreMusic', 'audio/addscore.mp3');
            game.load.audio('bombMusic', 'audio/boom.mp3');
            
            
	        game.load.image('obstacle', 'assets/pipe.png');
	        game.load.image('star', 'assets/star.png');
	        
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
    	var button;
    	this.create = function() {
            // 添加背景
	        var bg = game.add.image(0, 0, 'bg1');
	        bg.width = game.world.width;
	        bg.height = game.world.height;
	        // 添加标题
	        var title = game.add.text(game.world.centerX, game.world.height * 0.25, '一战到底赢大奖', {
	            fontSize: '40px',
	            fontWeight: 'bold',
	            fill: '#f2bb15'
	        });
	        title.anchor.setTo(0.5, 0.5);
	        // 添加主角
	        var man = game.add.sprite(game.world.centerX, game.world.height * 0.75, 'dude1');
	        var manImage = game.cache.getImage('dude1');
	        man.width = game.world.width * 0.2;
	        man.height = man.width / manImage.width * manImage.height;
	        man.anchor.setTo(0.5, 0.5);
	        // 添加"开始游戏"按钮
	        startButton = game.add.button(game.world.centerX, game.world.centerY, 'startbtn', onStart, this, 2, 1, 0);
	        startButton.anchor.setTo(0.5, 0.5);
	        function onStart(){
	        	game.state.start('play');
	        }
	        // 添加"活动规则"按钮
	        ruleButton = game.add.button(0, 0, 'rulebtn', showRules, this, 2, 1, 0);
	        function showRules(){
	        	$('#rule').show();
	        }
	        // 添加"我的奖品"按钮
	        prizeButton = game.add.button(0, 0, 'myprizebtn', showPrizes, this, 2, 1, 0);
	        var prizeButtonx = game.world.width - prizeButton.width - prizeButton.width / 2;
	        var prizeButtony = prizeButton.height / 2;
	        prizeButton.reset(prizeButtonx, prizeButtony);
	        function showPrizes(){
	        	$('#prize').show();
	        }
	        // 添加"分享 "按钮
	        startButton = game.add.button(game.world.centerX, game.world.height, 'sharebtn', onShare, this, 2, 1, 0);
	        startButton.anchor.setTo(0.5, 1.5);
	        function onShare(){
	        	alert('分享')
	        }
        }
    },
    // 游戏场景
    play: function() {
    	var grassBeltWidth = 50,
    		scoreMusic,
        	bombMusic,
        	bgMusic;
    	// 障碍物和奖励的速度
		var obstacle_velocity = 300;
		var	star_velocity = 300;
		// x滑动的最小触发距离
		var minTouchDis = width / 8;
    	this.create = function(){
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
	        game.physics.arcade.enable(this.car);
	        // 创建动画
	    	this.car.animations.add('left', [0, 1, 2, 3], 10, true);
	  		this.car.animations.add('right', [5, 6, 7, 8], 10, true);
	  		this.car.animations.play('left');
	  		
	        // 添加时间
			this.remainTime = 30;
	        var style = { font: "20px Arial", fill: "#ffffff" };
	        this.remainTimeText = this.game.add.text(20, 20, "时间: "+this.remainTime, style);
			
			// 添加分数
			this.score = 0;
	        var style = { font: "20px Arial", fill: "#ffffff" };
	        this.scoreText = this.game.add.text(20, 20, "分数: "+this.score, style);
	        this.scoreText.x = game.world.width - this.scoreText.width - this.scoreText.width;
	        
	        // 创建一个group，包含20个障碍物
	        this.obstacles = game.add.group();
	        this.obstacles.enableBody = true;
	        this.obstacles.createMultiple(15, 'obstacle');
	        
	        // 创建一个group，包含10个奖励星星
	        this.stars = game.add.group();
	        this.stars.enableBody = true;
	        this.stars.createMultiple(20, 'star');
	       
	        // 触摸按下的开始x坐标
	        this.startX = 0;
	        // 监听按下事件
			this.game.input.onDown.add(function(pointer) {
				//console.log(1);
				this.startX = pointer.x;
				//console.log('startX-->'+this.startX);
			},this);
			// 监听离开事件
			this.game.input.onUp.add(function(pointer) {
				//console.log(2);
				//console.log('endXStartx-->'+this.startX);
				//console.log('endX-->'+pointer.x);
				//console.log('offset-->'+(pointer.x - this.startX))
				if(pointer.x - this.startX > minTouchDis){
					this.moveCar('right');
				}else if(pointer.x - this.startX< -minTouchDis){
					this.moveCar('left');
				}
				this.startX = 0;
			},this);
			// 监听滑动事件
			this.game.input.addMoveCallback(function(pointer, x, y, isTap) {
				//console.log('addMoveCallback--',3);
			},this);
			
			
			game.onPause.add(function(){
	    		//alert('暂停');
	    		$('#leadPage').show();
	    	})
			$("#close_leadPage").click(function(){
				$('#leadPage').hide();
				game.paused = false;
			})
			game.paused = true;
			
	        // 定时器，创建障碍物和奖励
	        this.timer = this.game.time.events.loop(400, this.add_move_sprite, this); 
	        // 定时器，减少时间
	        this.reduceTimer = this.game.time.events.loop(1000, this.reduceTime, this); 
    	},
    	this.update = function(){
    		// 小车和障碍物的碰撞监听
    		game.physics.arcade.overlap(this.car, this.obstacles, this.crashCarFunc, null, this);
    		// 小车和奖励的碰撞监听
    		game.physics.arcade.overlap(this.car, this.stars, this.eatStarFunc, null, this);
    	},
    	this.moveCar = function(moveType){
	    	// 获取小车的当前x位置
	    	var curCarX = this.car.world.x;
    		var	halfRoadWidth = (game.world.width-grassBeltWidth*2)/6;
        	var lRoadCenter =  grassBeltWidth+ halfRoadWidth*1-this.car.width/2;//左车道中心
        	var cRoadCenter =  grassBeltWidth+ halfRoadWidth*3-this.car.width/2;//中车道中心
        	var rRoadCenter =  grassBeltWidth+ halfRoadWidth*5-this.car.width/2;//右车道中心
	    	if(moveType == "left"){
	    		//console.log("左滑");
	    		if(curCarX === cRoadCenter){
		    		this.car.x = lRoadCenter;
		    	}else if(curCarX === rRoadCenter){
		    		this.car.x = cRoadCenter;
		    	}
	    	}else if(moveType == "right"){
	    		//console.log("右滑");
	    		if(curCarX === lRoadCenter){
		    		this.car.x = cRoadCenter;
		    	}else if(curCarX === cRoadCenter){
		    		this.car.x = rRoadCenter;
		    	}
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
		        // 添加障碍物的速度，从上往下移动
		        obstacle.body.velocity.y = obstacle_velocity; 
		        // kill超出边界的障碍物
		        obstacle.checkWorldBounds = true;
		        obstacle.outOfBoundsKill = true;
	        }
	    },
	    this.add_one_star = function(){
	    	// 从group中获取第一个死亡的对象
	        var star = this.stars.getFirstDead();
	        if(star){
	        	// 障碍物从跑道的3个位置掉落
	        	// 随机[0,2]的整数,确定下落的跑道
	    		var num = Math.floor(Math.random()*3);
	    		var	halfRoadWidth = (game.world.width-grassBeltWidth*2)/6;
	    		var x = grassBeltWidth+ halfRoadWidth*(num*2+1)-star.width/2;
		  		var y = -star.height;
	        	// 重新设置位置
		        star.reset(x, y);
		        // 添加障碍物的速度，从上往下移动
		        star.body.velocity.y = star_velocity; 
		        // kill超出边界的障碍物
		        star.checkWorldBounds = true;
		        star.outOfBoundsKill = true;
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
			        // 添加障碍物的速度，从上往下移动
			        star.body.velocity.y = star_velocity; 
			        // kill超出边界的障碍物
			        star.checkWorldBounds = true;
			        star.outOfBoundsKill = true;
		        }
	     	}
	    	
	    },
	    this.add_move_sprite = function(){
	    	// 随机[0,1]的整数，确定是创建障碍物还是星星
	    	var starNum = Math.floor(Math.random()*400);
	    	console.log("starNum====",starNum)
	    	
	    	if(starNum <= 10){
	    		this.add_n_star(2);
	    	}else if(starNum>10 && starNum <= 15){
	    		this.add_n_star(5);
	    	}else if(starNum>15 && starNum <= 20){
	    		this.add_n_star(3);
	    	}else if(starNum>20 && starNum <= 200){
	    		this.add_one_obstacle();
	    	}else{
	    		this.add_one_star();
	    	}
	    },
	    this.reduceTime = function(){
	    	--this.remainTime;
	        this.remainTimeText.text = "时间: "+this.remainTime;
	        // 结束场景
	        if(this.remainTime <= 0){ 
	        	// 移除定时器
	        	this.game.time.events.remove(this.timer);
	        	this.game.time.events.remove(this.reduceTimer);
				game.state.start('over', true, false, this.score); 
	        }
	    },
	    this.crashCarFunc = function(car, obstacle){
	    	//console.log("碰到了障碍物-翻车");
	    	// 播放音效
    		bombMusic.play();
	    	car.animations.play('right');
	    	//让星星和障碍停止运动
	    	this.obstacles.forEach(function(item){
	    		item.body.velocity.y = 0;
	    	})
	    	this.stars.forEach(function(item){
	    		item.body.velocity.y = 0;
	    	})
	    	//是否可以改成让游戏暂停？效果不好
	    	/*game.paused = true;//暂停
	    	game.onPause.add(function(){
	    		//alert('暂停')
	    	})*/
	    	// 移除定时器
        	this.game.time.events.remove(this.timer);
        	this.game.time.events.remove(this.reduceTimer);
        	this.game.time.events.add(1000, function(){
        		game.state.start('over', true, false, this.score);
        	}, this);
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
	        // 添加背景
	        var bg = game.add.image(0, 0, 'bg1');
	        bg.width = game.world.width;
	        bg.height = game.world.height;
	        // 添加文本
	        var title = game.add.text(game.world.centerX, game.world.height * 0.25, '游戏结束', {
	            fontSize: '40px',
	            fontWeight: 'bold',
	            fill: '#f2bb15'
	        });
	        title.anchor.setTo(0.5, 0.5);
	        var scoreStr = '你的得分是：'+score+'分';
	        var scoreText = game.add.text(game.world.centerX, game.world.height * 0.4, scoreStr, {
	            fontSize: '30px',
	            fontWeight: 'bold',
	            fill: '#f2bb15'
	        });
	        scoreText.anchor.setTo(0.5, 0.5);
	        var remind = game.add.text(game.world.centerX, game.world.height * 0.6, '点击任意位置再玩一次', {
			    fontSize: '20px',
			    fontWeight: 'bold',
			    fill: '#f2bb15'
			});
			remind.anchor.setTo(0.5, 0.5);
			// 添加点击事件
			game.input.onTap.add(function() {
			    game.state.start('play');
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