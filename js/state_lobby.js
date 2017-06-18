/**
 * Created by andreas on 13.06.17.
 */
/*
TODO diplay game ID maybe in a (readOnly) TextField
    maybe also a copy to clipboard button
TODO add start Game Button if leader of the game
 */
var lobbyState = {

    preload: function () {

    },

    init: function (gameCode, playerName) {
        /*import {Socket} from "phoenix";

        socketStateLobby = new Socket("ws://localhost:4000/socket", {params: {token: window.userToken}});*/
        console.log('state_lobby: received: ', gameCode, playerName);
        if(gameCode === null || gameCode ===  undefined || playerName === undefined || playerName === null){ // this means that something went wrong in joining the game

        } else {
            this._players = [{}];
            this.updatePlayers([{name: playerName, id: 0/*TODO add right id*/, team:1}]);

            nameLabel = game.add.text(game.world.centerX, 80, 'Brettprojekt Lobby: ' + gameCode, { font: '50px Arial', fill: '#ffffff' });
            nameLabel.anchor.setTo(0.5, 0.5);
            this._initializeCorrect = true;
        }
        //TODO join the gameChannel and hear on updatePlayers
    },

    updatePlayers: function(editPlayers){
        const lineHeight = 20;
        const offset = 120;
        const xOfName = 200;
        const xOfTeam = 500;
        const thisFontStyle = { font: 'bold 18px Arial'};

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
            const colors = {
                1:'#F00',
                2:'#0F0',
                3:'#F0F',
                4:'#FF0'};
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
            }
        }
    },

    changeTeam: function () {
        //TODO
        const newTeam = this._players[0].team === 4 ? 1 : this._players[0].team + 1;
    },

    create: function () {
        console.log('state_lobby: create was called');
        if(this._initializeCorrect !== true){
            let nameLabel;

            nameLabel = game.add.text(game.world.centerX, 80, 'Error Please try again', { font: '50px Arial', fill: '#ffffff' });
            nameLabel.anchor.setTo(0.5, 0.5);
            console.error('state_lobby: The gameCode was null or undefined');
        }
    },

    update: function () {

    },

    startGame: function () {
        //TODO
        game.state.start('play');
    }
};
