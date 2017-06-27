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
            this._maxTeams = joinGameResp.team_size;
            game.global.gameSpecificData.authToken = joinGameResp.auth_token;
            game.global.gameSpecificData.userID = joinGameResp.user_id;

            //Add this player to be displayed first
            this.updatePlayers([{
                name: this._playerName,
                id: joinGameResp.user_id,
                team: 1,
                ready: false
            }]);

            game.global.gameSpecificData.channel = game.global.websocket.channel("game:" + gameCode, {auth_token: game.global.gameSpecificData.authToken});
            game.global.gameSpecificData.channel.join()
                .receive('ok', this.channelJoinSucess).receive('error', console.log(console.error()));

            //Heading of Lobby
            this._nameLabel = game.add.text(game.world.centerX, 80, 'Brettprojekt Lobby: ' + gameCode, { font: '50px Arial', fill: '#ffffff' });
            this._nameLabel.anchor.setTo(0.5, 0.5);

            //change team button
            this._changeTeamButton = game.add.button(100, game.world.height - 100, 'change_team', this.changeTeam, this, 1, 0, 2);
            this._changeTeamButton.anchor.setTo(0, 0);

            //startGame button TODO only show for gameLeader
            this._startGameButton = game.add.button(game.world.width - 100, game.world.height - 100, 'start_game', this.startGame, this, 1, 0, 2);
            this._startGameButton.anchor.setTo(1, 0);
            this._startGameButton.visible = true; //TODO change back to false

            //copy gameCode
            this._CopyButton = game.add.button(game.world.width, 0, 'copy', function () {copyToClipboard(this._gameCode);}, this, 1, 0, 2);
            this._CopyButton.anchor.setTo(1, 0);

            this._initializeCorrect = true;
        }
        //TODO join the gameChannel and hear on updatePlayers
    },

    channelJoinSucess: function (event) {
        console.log('state-lobby: successfully joined game channel', event);
        game.global.gameSpecificData.channel.on('lobby_update', this.updateFromWebsocket);
    },

    /**
     * Gets callen if the Websocket sends an update of type lobby_update
     * @param event the event holding the new values
     */
    updateFromWebsocket: function(event){
        console.log('lobby-state: received lobby_update', event);
        this._maxTeams = event.max_teams;
        if( this._maxTeams < this._players[0].team){
            this.setTeam(1);
        }
        if(this._startGameButton !== undefined){
            this._startGameButton.visible = event.startable;//TODO only show for leader
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
        const lineHeight = 20;
        const offset = 120;
        const xOfName = 200;
        const xOfTeam = 500;
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

            thisFontStyle.fill = game.global.teamColors[editedPlayer.team];
            readyStyle.fill = game.global.colorReady[editedPlayer.ready];
            const stringReady = editedPlayer.ready ? 'ready' : 'unready';

            if(found !== null){
                found._lobbyViewName.setStyle(thisFontStyle);

                found._lobbyViewTeam.setStyle(thisFontStyle);
                found._lobbyViewTeam.text = found.team = editedPlayer.team;

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
                editedPlayer._lobbyViewTeam = game.add.text(xOfTeam, positionY, editedPlayer.team, thisFontStyle);
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
        const newTeam = this._players[0].team >= this._maxTeams ? 1 : this._players[0].team + 1;
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
        if(newTeam > this._maxTeams || newTeam < 1){
            throw new Error('team out of bounds[1,'+this._maxTeams+']: ' + newTeam);
        }
        this._players[0].team = newTeam;
        this.updatePlayers([this._players[0]]);
        game.global.gameSpecificData.channel.push('select_team', {
            auth_token: game.global.gameSpecificData.authToken,
            team: newTeam
        });
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

    startGame: function () {
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
