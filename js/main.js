// 初始化Phaser，并创建一个和屏幕相同大小的场景
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var obstacle_velocity = 100;
var	star_velocity = 100;
var game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS, 'game_div');
var game_state = {};

// 创建一个main state
game_state.main = function() { };  
game_state.main.prototype = {
    // 最先被调用，主要加载图片音频资源
    preload: function() { 
        this.game.stage.backgroundColor = '#71c5cf';
        this.game.load.image('car', 'assets/bird.png');
        this.game.load.image('obstacle', 'assets/pipe.png');
        this.game.load.image('star', 'assets/star.png');
        
        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    },
    create: function() {
    	// 开启物理世界
    	game.physics.startSystem(Phaser.Physics.ARCADE);
    	
        //this.car = this.game.add.sprite(0,0,'car');
        this.car = this.game.add.sprite(32, game.world.height - 150, 'dude');
        var carWidth = this.car.width;
        var carHeight = this.car.height;
        // 设置car位置
        var posX = game.world.width * (1-(5-(1*2))/6) - carWidth / 2;
	  	var posY = game.world.height - carHeight - carHeight / 3;
        this.car.x = posX;
        this.car.y = posY;
        game.physics.arcade.enable(this.car);
        // 创建动画
    	this.car.animations.add('left', [0, 1, 2, 3], 10, true);
  		this.car.animations.add('right', [5, 6, 7, 8], 10, true);
  		this.car.animations.play('left');
        
        // 创建一个group，包含20个障碍物
        this.obstacles = game.add.group();
        this.obstacles.enableBody = true;
        this.obstacles.createMultiple(20, 'obstacle');
        
        // 创建一个group，包含10个奖励星星
        this.stars = game.add.group();
        this.stars.enableBody = true;
        this.stars.createMultiple(10, 'star');
       
        // 定时器，创建障碍物
        this.timer = this.game.time.events.loop(1000, this.add_obstacles, this); 
        // 触摸按下的开始x坐标
        this.startX = 0;
        // 监听按下事件
		this.game.input.onDown.add(function(pointer) {
			console.log(1);
			this.startX = pointer.x;
			console.log('startX-->'+this.startX);
		},this);
		// 监听离开事件
		this.game.input.onUp.add(function(pointer) {
			console.log(2);
			console.log('endXStartx-->'+this.startX);
			console.log('endX-->'+pointer.x);
			console.log('offset-->'+(pointer.x - this.startX))
			if(pointer.x - this.startX>100){
				this.moveCar('right');
			}else if(pointer.x - this.startX<-100){
				this.moveCar('left');
			}
			this.startX = 0;
		},this);
		// 监听滑动事件
		this.game.input.addMoveCallback(function(pointer, x, y, isTap) {
			console.log(3);
		},this);
		
		// 添加分数
		this.score = 0;
        this.scoreText = "分数: "+this.score;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.scoreText = this.game.add.text(20, 20, "分数: 0", style);  
    },
    update: function() {
    	// 小车和障碍物的碰撞监听
    	game.physics.arcade.overlap(this.car, this.obstacles, this.collectCarFunc, null, this);
    	// 小车和奖励的碰撞监听
    	game.physics.arcade.overlap(this.car, this.stars, this.eatStarFunc, null, this);
    },
    moveCar: function(moveType){
    	// 获取小车的当前x位置
    	var curCarX = this.car.world.x;
    	if(moveType == "left"){
    		console.log("左滑");
    		if(curCarX === game.world.width*(1-(5-(1*2))/6)-this.car.width/2){
	    		this.car.x = game.world.width*(1-(5-(0*2))/6)-this.car.width/2;
	    	}else if(curCarX === game.world.width*(1-(5-(2*2))/6)-this.car.width/2){
	    		this.car.x = game.world.width*(1-(5-(1*2))/6)-this.car.width/2;
	    	}
    	}else if(moveType == "right"){
    		console.log("右滑");
    		var curCarX = this.car.world.x;
    		if(curCarX === game.world.width*(1-(5-(0*2))/6)-this.car.width/2){
	    		this.car.x = game.world.width*(1-(5-(1*2))/6)-this.car.width/2;
	    	}else if(curCarX === game.world.width*(1-(5-(1*2))/6)-this.car.width/2){
	    		this.car.x = game.world.width*(1-(5-(2*2))/6)-this.car.width/2;
	    	}
    	}
    },
    add_one_obstacle: function(){
    	// 从group中获取第一个死亡的对象
        var obstacle = this.obstacles.getFirstDead();
        if(obstacle){
        	// 障碍物从跑道的3个位置掉落
        	// 随机[0,2]的整数,确定下落的跑道
    		var num = Math.floor(Math.random()*3);
        	var x = game.world.width*(1-(5-(num*2))/6)-obstacle.width/2;
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
    add_one_star: function(){
    	// 从group中获取第一个死亡的对象
        var star = this.stars.getFirstDead();
        if(star){
        	// 障碍物从跑道的3个位置掉落
        	// 随机[0,2]的整数,确定下落的跑道
    		var num = Math.floor(Math.random()*3);
        	var x = game.world.width*(1-(5-(num*2))/6)-star.width/2;
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
    add_obstacles: function(){
    	// 随机[0,1]的整数，确定是创建障碍物还是星星
    	var starNum = Math.floor(Math.random()*2);
    	if(starNum === 0){
    		this.add_one_star();
    	}else{
    		this.add_one_obstacle();
    	}
    },
    collectCarFunc: function(car, obstacle){
    	obstacle.kill();
    	console.log("碰到了障碍物+减分");
    	this.score -= 1;
    	if(this.score < 0){
    		this.score = 0;
    	}
        this.scoreText.text = '分数: ' + this.score;  
         this.car.animations.play('right');
    },
    eatStarFunc: function(car, star){
    	star.kill();
    	console.log("吃到奖励+加分");
    	
    	this.score += 1;
        this.scoreText.text = '分数: ' + this.score; 
        this.car.animations.play('left');
    }
};

game.state.add('main', game_state.main);  
game.state.start('main'); 