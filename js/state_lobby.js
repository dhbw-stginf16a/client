/**
 * Created by andreas on 13.06.17.
 */
/*
TODO diplay game ID maybe in a (readOnly) TextField
    maybe also a copy to clipboard button
TODO add start Game Button if leader of the game
 */

/**
 * Displays a prompt to copy the gameId from
 * @param text
 */
function copyToClipboard(text) {
    window.prompt("Copy to clipboard: Ctrl+C, Enter", text); //TODO add MAC support
}

var lobbyState = {
    _maxTeams: 4,

    preload: function () {},

    /**
     * Initializes the state lobby
     * @param gameCode the gameCode of this game
     * @param playerName the playersName
     * @param isLeader true if this player is the leader of the game
     */
    init: function (gameCode, playerName, isLeader) {
        /*import {Socket} from "phoenix";

        socketStateLobby = new Socket("ws://localhost:4000/socket", {params: {token: window.userToken}});*/
        console.log('state_lobby: received: ', gameCode, playerName);
        if(gameCode === null || gameCode ===  undefined || playerName === undefined || playerName === null){ // this means that something went wrong in joining the game

        } else {
            this._players = [];
            this._gameCode = gameCode;
            this._playerName = playerName;

            //Add this player to be displayed first
            this.updatePlayers([{name: playerName, id: 0/*TODO add right id here (This is in the response of join_game)*/, team:1}]);

            //Heading of Lobby
            this._nameLabel = game.add.text(game.world.centerX, 80, 'Brettprojekt Lobby: ' + gameCode, { font: '50px Arial', fill: '#ffffff' });
            this._nameLabel.anchor.setTo(0.5, 0.5);

            //change team button
            this._changeTeamButton = game.add.button(100, game.world.height - 100, 'change_team', this.changeTeam, this, 1, 0, 2);
            this._changeTeamButton.anchor.setTo(0, 0);

            //startGame button TODO only show for gameLeader
            this._startGameButton = game.add.button(100, game.world.height - 100, 'change_team', this.startGame, this, 1, 0, 2);
            this._startGameButton.anchor.setTo(0, 0);
            this._startGameButton.visible = false;

            //copy gameCode
            this._CopyButton = game.add.button(game.world.width, 0, 'copy', function () {copyToClipboard(this._gameCode);}, this, 1, 0, 2);
            this._CopyButton.anchor.setTo(1, 0);

            this._initializeCorrect = true;
        }
        //TODO join the gameChannel and hear on updatePlayers
    },

    /**
     * Gets callen if the Websocket sends an update of type lobby_update
     * @param event the event holding the new values
     */
    updateFromWebsocket: function(event){
        console.log('lobby-state: received lobby_update', event);
        this._maxTeams = event.max_teams;
        if( this._maxTeams < this._players[0].team){
            //TODO update Team
            this._players[0].team = 1;
            this.updatePlayers([this._players[0]]);
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
     * TODO add readiness to each player
     * @param editPlayers the updated player list
     */
    updatePlayers: function(editPlayers){
        const lineHeight = 20;
        const offset = 120;
        const xOfName = 200;
        const xOfTeam = 500;
        const thisFontStyle = { font: 'bold 18px Arial'};
        const colors = {
            1:'#F00',
            2:'#0F0',
            3:'#F0F',
            4:'#FF0',
            5:'#00F', 6:'#0FF', 7:'#500', 8:'#050', 9:'#505', 10:'#550', 11:'#005', 12:'#055'};

        for(const editedPlayerID in editPlayers){
            const editedPlayer = editPlayers[editedPlayerID];
            let found = null;
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

            thisFontStyle.fill = colors[editedPlayer.team];

            if(found !== null){
                found._lobbyViewName.setStyle(thisFontStyle);
                found._lobbyViewTeam.setStyle(thisFontStyle);
                found._lobbyViewTeam.text = found.team = editedPlayer.team;
            } else {
                this._players.push(editedPlayer);
                thisFontStyle.fill = colors[editedPlayer.team];
                const positionY = offset + this._players.length * lineHeight;
                /*console.log('state-lobby:', thisFontStyle, lineHeight, offset, positionY);
                console.log('state-lobby:', editedPlayer);*/
                editedPlayer._lobbyViewName = game.add.text(xOfName, positionY, editedPlayer.name, thisFontStyle);
                editedPlayer._lobbyViewName.anchor.setTo(0);
                editedPlayer._lobbyViewTeam = game.add.text(xOfTeam, positionY, editedPlayer.team, thisFontStyle);
                editedPlayer._lobbyViewTeam.anchor.setTo(0);
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
     * Sets the team to the given ID
     * @param newTeam the new Team to set to
     * @throws Error if the newTeam is out of bounds
     */
    setTeam: function (newTeam) {
        if(newTeam > this._maxTeams || newTeam < 1){
            throw new Error('team out of bounds[1,'+this._maxTeams+']: ' + newTeam);
        }
        //TODO sendChange
        this._players[0].team = newTeam;
        this.updatePlayers([this._players[0]]);
    },

    /**
     * gets called by phaser and displays an error if something went wrong is init()
     */
    create: function () {
        console.log('state_lobby: create was called');
        if(this._initializeCorrect !== true){
            let nameLabel;

            nameLabel = game.add.text(game.world.centerX, 80, 'Error Please try again', { font: '50px Arial', fill: '#ffffff' });
            nameLabel.anchor.setTo(0.5, 0.5);
            console.error('state_lobby: The gameCode was null or undefined');
        }
    },

    update: function () {},

    startGame: function () {
        //TODO
        game.state.start('play');
    }
};
