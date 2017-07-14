/**
 * Created by andreas on 13.06.17.
 */
/*
 TODO add go ready button
    maybe also a copy to clipboard button
 */

let game;

/**
 * Displays a prompt to copy the gameId from
 * @param text
 */
function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text); //TODO add MAC support
}

module.exports = {
    _maxTeams: 4,

    preload: function () {},

    /**
     * Initializes the state lobby
     * @param gameState the gameObject
     * @param gameCode the gameCode of this game
     * @param isLeader true if this player is the leader of the game
     * @param joinGameResp the response of the websocket Request join_game
     */
    init: function (gameState, gameCode, isLeader, joinGameResp) {
        //TODO interpret joinGameResp
        game = gameState;

        game.global.gameSpecificData = {};

        console.log('state_lobby: received: ', gameCode, game.global.playerName, isLeader, joinGameResp);
        if (gameCode == null || game.global.playerName == null || joinGameResp == null) { // this means that something went wrong in joining the game
            console.error('invalid parameters');
        } else {
            this._players = [];
            this._gameCode = gameCode;
            this._playerName = game.global.playerName;
            this._maxTeams = joinGameResp.team_count;
            game.global.gameSpecificData.authToken = joinGameResp.auth_token;
            game.global.gameSpecificData.userID = joinGameResp.user_id;

            //Add this player to be displayed first
            this.updatePlayers([{
                name: this._playerName,
                id: joinGameResp.player_id,
                team: 1,
                ready: false
            }]);

            game.global.gameSpecificData.channel = game.global.websocket.channel("game:" + gameCode, {auth_token: game.global.gameSpecificData.authToken});
            game.global.gameSpecificData.channel.on('lobby_update', this.updateFromWebsocket.bind(this));
            game.global.gameSpecificData.channel.on('round_preparation', this.roundPreparationStartGame.bind(this));
            game.global.gameSpecificData.channel.join()
                .receive('ok', this.channelJoinSuccess.bind(this))
                .receive('error', e => console.log('state-lobby: failed to join gameChannel', e));

            //Heading of Lobby
            this._nameLabel = game.add.text(game.world.centerX, 80, 'Qzoo Lobby: ' + gameCode, { font: '50px Arial', fill: '#f7931e' });
            this._nameLabel.anchor.setTo(0.5, 0.5);

            //change team button
            this._changeTeamButton = game.add.button(100, game.world.height - 100, 'change_team', this.changeTeam, this, 1, 0, 2);
            this._changeTeamButton.anchor.setTo(0, 0);

            //startGame button TODO only show for gameLeader
            this._startGameButton = game.add.button(game.world.width - 100, game.world.height - 100, 'start_game', this.startGame, this, 1, 0, 2);
            this._startGameButton.anchor.setTo(1, 0);
            this._startGameButton.visible = true; //TODO change back to false

            this._startGameButton = game.add.button(0, 0, 'start_game', this.startGameDummy, this, 1, 0, 2);
            this._startGameButton.anchor.setTo(0, 0);

            this._toggleReadyButton = game.add.button(game.world.width / 2, game.world.height - 100, 'readyButton', this.toggleReady, this, 1, 0, 2);
            this._toggleReadyButton.anchor.setTo(0.5, 0);

            //copy gameCode
            this._CopyButton = game.add.button(game.world.width, 0, 'copy', function () {copyToClipboard(this._gameCode);}, this, 1, 0, 2);
            this._CopyButton.anchor.setTo(1, 0);

            this._initializeCorrect = true;

            //frame
            var posx = 150;
            var posy = 100;
            var controllRECT = game.add.graphics(0, 0);
            controllRECT.lineStyle(2,0xF2F2F2,1);
            controllRECT.beginFill(0x333333,0);
            controllRECT.drawRect(posx,posy,530,850);

            var graphics = game.add.graphics(0,0);
            graphics.lineStyle(2, 0xF2F2F2, 1);


            graphics.moveTo(posx+5,posy+90);
            graphics.lineTo(posx+525,posy+90);
        }
    },

    /**
     * This gets toggled by the response of the game channel join.
     *
     * It triggers an forced lobby_update
     * @param event the data from the websocket answer
     */
    channelJoinSuccess: function (event) {
        console.log('state-lobby: successfully joined game channel', event);
        game.global.gameSpecificData.channel.push('trigger_lobby_update', {
            auth_token: game.global.gameSpecificData.authToken
        }).receive('error', e => console.error('state_lobby: SetTeamReceiveError', e));
    },

    /**
     * Gets callen if the Websocket sends an update of type lobby_update
     * @param event the event holding the new values
     */
    updateFromWebsocket: function(event){
        console.log('state_lobby: received lobby_update', event, this);
        if (event.max_teams !== undefined) {
            this._maxTeams = event.max_teams;
        }
        if( this._maxTeams < this._players[0].team){
            this.setTeam(1);
        }
        if(this._startGameButton !== undefined){
            this._startGameButton.visible = true;//TODO only show for leader
        }
        this.updatePlayers(event.players);
    },

    /**
     * Updates the shown player list with the new Teams and Colors
     *
     * the given list doesn't have to contain all players
     * @param editPlayers the updated player list
     */
    updatePlayers: function(editPlayers){
        console.log('state_lobby: Received new PlayerList', editPlayers);
        const lineHeight = 20;
        const offset = 210;
        const xOfName = 200;
        const xOfTeam = 400;
        const xOfReady = 525;
        const thisFontStyle = { font: 'bold 18px Arial'};
        const readyStyle = {font: 'bold 18px Arial'};

        for(const editedPlayerID in editPlayers){
            const editedPlayer = editPlayers[editedPlayerID];
            var found = null;
            for(const oldPlayerID in this._players){
                const oldPlayer = this._players[oldPlayerID];
                if(oldPlayer.id === editedPlayer.id){
                    if(found !== null){
                        console.error('state-lobby: Multiple Players with same id: ' , oldPlayer , ' and ' , found);
                    } else {
                        found = oldPlayer;
                    }
                }
            }

            thisFontStyle.fill = "#f2f2f2";

            game.add.text(xOfName, offset-90, "Name", thisFontStyle);
            game.add.text(xOfTeam, offset-90, "Team", thisFontStyle);
            game.add.text(xOfReady, offset-90, "Ready?", thisFontStyle);

            thisFontStyle.fill = game.global.teamColors[editedPlayer.team + 1];
            readyStyle.fill = game.global.colorReady[editedPlayer.ready];
            const stringReady = editedPlayer.ready ? 'ready' : 'unready';






            if(found !== null){
                found._lobbyViewName.setStyle(thisFontStyle);

                found._lobbyViewTeam.setStyle(thisFontStyle);
                found._lobbyViewTeam.text = (found.team = editedPlayer.team) - (-1);

                found._lobbyViewReadiness.text = stringReady;
                found._lobbyViewReadiness.setStyle(readyStyle);
            } else {
                this._players.push(editedPlayer);
                const positionY = offset + this._players.length * lineHeight;
                /*console.log('state-lobby:', thisFontStyle, lineHeight, offset, positionY);
                console.log('state-lobby:', editedPlayer);*/

                //show the name on screen
                editedPlayer._lobbyViewName = game.add.text(xOfName, positionY, editedPlayer.name, thisFontStyle);
                editedPlayer._lobbyViewName.anchor.setTo(0);

                //show team on screen
                editedPlayer._lobbyViewTeam = game.add.text(xOfTeam, positionY, editedPlayer.team - (-1), thisFontStyle);
                editedPlayer._lobbyViewTeam.anchor.setTo(0);

                //show readiness on screen
                editedPlayer._lobbyViewReadiness = game.add.text(xOfReady, positionY, stringReady, readyStyle);
                editedPlayer._lobbyViewReadiness.anchor.setTo(0);

                console.log('state-lobby: A new player was added to the list:', editedPlayer);
            }
        }
    },

    /**
     * Increments the team by 1 and flips around at the teamSize stored in this._maxTeams
     */
    changeTeam: function () {
        console.log('state_lobby: wanted to change the team', this._players);
        const newTeam = (this._players[0].team + 1) % this._maxTeams;
        this.setTeam(newTeam);
    },

    /**
     * Sets the team to the given team
     *
     * Also updates the list viewed to the user
     * @param newTeam the new Team to set to
     * @throws Error if the newTeam is out of bounds
     */
    setTeam: function (newTeam) {
        if (newTeam >= this._maxTeams || newTeam < 0) {
            throw new Error('team out of bounds[0,' + (this._maxTeams - 1) + ']: ' + newTeam);
        }
        this._players[0].team = newTeam;
        this.updatePlayers([this._players[0]]);
        game.global.gameSpecificData.channel.push('set_team', {
            auth_token: game.global.gameSpecificData.authToken,
            team: newTeam
        }).receive('ok', e => console.log('state_lobby: SetTeamReceiveOk', e)).receive('error', e => console.error('state_lobby: SetTeamReceiveError', e));
    },

    /**
     * Toggles the readiness of the player at position 0 in this.players and broadcasts the change to the server
     */
    toggleReady: function () {
        this._players[0].ready = !this._players[0].ready;
        this.updatePlayers([this._players[0]]);
        game.global.gameSpecificData.channel.push('set_ready', {
            auth_token: game.global.gameSpecificData.authToken,
            ready: this._players[0].ready
        }).receive('ok', e => console.log('state_lobby: readyOk', e)).receive('error', e => console.error('state_lobby: readyError', e));
    },

    /**
     * gets called by phaser and displays an error if something went wrong is init()
     */
    create: function () {
        console.log('state_lobby: create was called');
        if(this._initializeCorrect !== true){
            var nameLabel;

            nameLabel = game.add.text(game.world.centerX, 80, 'Error Please try again', { font: '50px Arial', fill: '#ffffff' });
            nameLabel.anchor.setTo(0.5, 0.5);
            console.error('state_lobby: The gameCode was null or undefined');
        }
    },

    update: function () {},

    /**
     * Gets called if the round_preparation is triggered and starts the play state.
     * @param event the paylod from the websocket
     */
    roundPreparationStartGame: function (event) {
        if (this._startedGame !== true) {
            const newPlayer = [];
            for (const i in this._players) {
                if (this._players[i] != null) {
                    newPlayer.push({
                        name: this._players[i].name,
                        team: this._players[i].team,
                        id: this._players[i].id,
                        ready: false
                    });
                }
            }
            game.state.start('play', true, false, game, newPlayer, event);
            this._startedGame = true;
        }
    },

    /**
     * Starts the game by triggering the round_preparation on the Server
     */
    startGame: function () {
        game.global.gameSpecificData.channel.push('start_game', {
            auth_token: game.global.gameSpecificData.authToken
        }).receive('ok', e => console.log('state_lobby: startGameOk', e)).receive('error', e => console.error('state_lobby: startGameError', e));
    },

    startGameDummy: function () {
        const newPlayer = [];
        for (const i in this._players) {
            if (this._players[i] != null) {
                newPlayer.push({
                    name: this._players[i].name,
                    team: this._players[i].team,
                    id: this._players[i].id,
                    ready: false
                });
            }
        }
        game.state.start('play', true, false, game, newPlayer);
        //TODO websocket
    }
};
