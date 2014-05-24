
BasicGame.Lose = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.Lose.prototype = {

	create: function () {

		this.add.sprite(0, 0, 'loseBackground');
		//this.add.sprite(this.world.width/2, 40, 'titlepage');

		this.menuButton = this.add.button(this.world.width/2-200, this.world.height/2+100, 'playButton', this.startGame, this);

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		//this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};