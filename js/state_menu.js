/**
 * Created by andreas on 11.06.17.
 */
/*
TODO add URL join support
 */
var menuState = {

    create: function () {
        // Add a background image
        // game.add.image(0, 0, 'background');
        // Display the name of the game
        let nameLabel = game.add.text(game.world.centerX, 80, 'Brettprojekt Menu', { font: '50px Arial', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);

        //Add Start Button
        let startButton = game.add.button(game.world.centerX, game.world.centerY, 'button', this.start, this, 1, 0, 2);
        startButton.anchor.set(0);

        let startWithGameCode = game.add.button(game.world.centerX, game.world.centerY + 100, 'button', this.startFromCode, this, 1, 0, 2);
        startWithGameCode.anchor.set(0);

        this._inputGameCode = game.add.inputField(game.world.centerX - 200, game.world.centerY + 100, {
            font: '18px Arial',
            fill: '#000',
            width: 150,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 5,
            placeHolder: 'GameId'
        });

        this._inputPlayerName = game.add.inputField(game.world.centerX - 200, game.world.centerY, {
            font: '18px Arial',
            fill: '#000',
            width: 150,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 5,
            placeHolder: 'Name'
        });

        this._inputGameCode.focusOutOnEnter = false;
        this._inputPlayerName.focusOutOnEnter = false;
    },

    start: function () {
        //Go to the play state
        game.state.start('lobby');
        //TODO create Game
    },
    
    startFromCode: function () {
        const playerName = this._inputPlayerName.text.text;
        console.log('state-menu: value of name', playerName);
        if(playerName !== null && playerName !== undefined && playerName !== ''){
            //Go to the play state
            const gameCode = this._inputGameCode.text.text;
            console.log('state-menu: value of gameCode', gameCode);
            if(gameCode !== null && gameCode !== undefined && gameCode !== ''){
                game.state.start('lobby', true, false, gameCode, playerName, true);
            }
        }
    }
};