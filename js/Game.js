
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    var player;
    var bad;
    var platforms;
    var stars;
    var cursors;
    var score;
    var scoreText;
    var timeText;
    var time;
    var bad_go;
    var debugText;
};

BasicGame.Game.prototype = {

	create: function () {

        this.score = 0;
        this.time = 0;
        this.physics.startSystem(Phaser.Physics.ARCADE);
		this.add.sprite(0, 0, 'sky');

        //platforms
        this.platforms = this.add.group();
        platforms = this.platforms;
        platforms.enableBody = true;
        
        var ground = platforms.create(0, this.world.height - 64, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;

        var ledge = platforms.create(400, 400, 'ground');
        ledge.body.immovable = true;
        ledge = platforms.create(-150, 250, 'ground');
        ledge.body.immovable = true;

        //player
        // this.player = this.add.sprite(this.world.width/2, this.world.height/2, 'shpere');
        // this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        // this.player.animations.add('right', [3, 2, 1, 0], 10, true);

        this.player = this.add.sprite(this.world.width/2, this.world.height/2, 'dude');
        this.physics.arcade.enable(this.player);
        this.player.body.bounce.y = 0.3;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.player.frame = 4;

        this.bad = this.add.sprite(0, 200, 'bad');
        this.physics.arcade.enable(this.bad);
        this.bad.body.bounce.y = 0.3;
        this.bad.body.gravity.y = 300;
        this.bad.body.collideWorldBounds = true;
        this.bad.animations.add('left', [0, 1], 10, true);
        this.bad.animations.add('right', [2, 3], 10, true);

        //stars
        this.stars = this.add.group();
        var stars = this.stars;
        stars.enableBody = true;
        for (var i = 0; i < 12; i++)
        {
            //  Create a star inside of the 'stars' group
            var star = stars.create(i * 70, 50, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 6;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        this.cursors = this.input.keyboard.createCursorKeys();
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.timeText = this.add.text(400, 16, 'time: 0', { fontSize: '32px', fill: '#000' });
        this.debugText = this.add.text(550, 16, 'x: 0', { fontSize: '8px', fill: '#000' });

        this.bad_go = 'right';

	},

	update: function () {
        var player = this.player;
        var cursors = this.cursors;
        var game = this.game;
        game.physics.arcade.collide(this.player, this.platforms);
        game.physics.arcade.collide(this.stars, this.platforms);
        game.physics.arcade.overlap(player, this.stars, this.collectStar, null, this);
        game.physics.arcade.overlap(player, this.bad, this.killPlayer, null, this);

        game.physics.arcade.collide(this.bad, this.platforms);
	    
        player.body.velocity.x = 0;

        this.debugText.text = this.bad_go + ' : ' + this.bad.body.x ;  
        if(this.bad.body.x > 200 && this.bad_go == 'right'){
            this.bad_go = 'left';
        } 
        else if(this.bad.body.x < 10 && this.bad_go == 'left'){
            this.bad_go = 'right';
        } 
        if(this.bad_go == 'left'){
            this.bad.body.velocity.x = -100;    
            this.bad.animations.play('left');
        } 
        else{
            this.bad.body.velocity.x = 100;    
            this.bad.animations.play('right');
        } 

        if (cursors.left.isDown)
        {
            //  Move to the left
            player.body.velocity.x = -150;

            player.animations.play('left');
        }
        else if (cursors.right.isDown)
        {
            //  Move to the right
            player.body.velocity.x = 150;

            player.animations.play('right');
        }
        else
        {
            //  Stand still
            player.animations.stop();

            //player.frame = 4;
        }
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -350;
        }
        this.timeText.text = 'Time: ' + ++this.time;
	},

    collectStar: function (player, star) {
        star.kill();
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;   
        if(this.score == 100) this.quitGame('collectStar');
    },

    killPlayer: function (player, star) {
        player.kill();
        this.quitGame('killPlayer');
    },

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
