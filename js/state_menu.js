/**
 * Created by andreas on 11.06.17.
 */

let game;

module.exports = {
    create: function () {
        // Add a background image
        // game.add.image(0, 0, 'background');
        // Display the name of the game
        let nameLabel = game.add.text(game.world.centerX, 80, 'Brettprojekt Menu', {
            font: '50px Arial',
            fill: '#ffffff'
        });
        nameLabel.anchor.setTo(0.5, 0.5);

        //Add Start Button
        let startButton = game.add.button(game.world.centerX, game.world.centerY, 'button', this.createGame, this, 1, 0, 2);
        startButton.anchor.set(0);

        let startWithGameCode = game.add.button(game.world.centerX, game.world.centerY + 100, 'button', this.joinGame, this, 1, 0, 2);
        startWithGameCode.anchor.set(0);

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
        this._inputPlayerName.setText(game.global.GET['name']);

        this._inputGameCode.focusOutOnEnter = false;
        this._inputPlayerName.focusOutOnEnter = false;
    },

    init: function (gameState) {
        game = gameState;
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
        this._inputGameCode.setText(game.global.GET['joinGame']);
    },

    createGame: function () {
        //Go to the lobby state
        //game.state.start('lobby');
        const playerName = this._inputPlayerName.text.text;
        console.log('state-menu: value of name', playerName);
        if(playerName !== null && playerName !== undefined && playerName !== '') {
            game.global.channel.main.push('create_game').receive('ok', resp => {this.receiveCreatedGame(resp, playerName)});
        }else{
            console.error('state_menu: Invalid player name');
        }
    },

    joinGame: function () {
        const playerName = this._inputPlayerName.text.text;
        console.log('state-menu: value of name', playerName);
        if(playerName !== null && playerName !== undefined && playerName !== '') {
            //Go to the play state
            const gameCode = this._inputGameCode.text.text;
            console.log('state-menu: value of gameCode', gameCode);
            if (gameCode !== null && gameCode !== undefined && gameCode !== '') {
                this.startFromCode(gameCode, playerName, false);
            }else {
                console.error('state_menu: Invalid gameCode');
            }
        }else{
            console.error('state_menu: Invalid player name');
        }
    },

    /**
     * This gets called after the response of createGame
     * https://github.com/dhbw-stginf16a/documentation/blob/master/api.md#request-main---create_game-create-a-new-game
     *
     * @param resp the websocket response
     * @param playerName the display name of the player
     */
    receiveCreatedGame: function (resp, playerName) {
        console.log('state_menu: response of createGame', resp);
        this.startFromCode(resp.game_id, playerName, true);
    },

    /**
     * Starts the next state
     * @param gameID the gameID to pass
     * @param playerName the playerName
     * @param leader true if the game was created just now
     */
    startFromCode: function (gameID, playerName, leader) {
        //Assembling URL for joining the game
        let newQuerry = '?';
        for(const id in game.global.GET){
            if(id !== 'joinGame'){
                newQuerry += id + '=' + game.global.GET[id] + '&';
            }
        }
        newQuerry+='joinGame='+gameID;

        let newUrl = location.href.replace(location.search, newQuerry);
        if (location.search == "") {
            newUrl = location.href + newQuerry;
        }

        //Joining channel
        game.global.playerName = playerName;

        window.history.pushState({}, gameID, newUrl);
        game.global.channel.main.push('join_game', {username: playerName, game_id: gameID})
            .receive('ok',
                resp =>{
                    game.state.start('lobby', true, false, game, gameID, leader, resp);
                })
            .receive('error', console.error);
        //game.state.start('lobby', true, false, game, gameID, leader);
    }
};