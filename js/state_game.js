/**
 * Created by andreas on 11.06.17.
 */
//import 'pixi'
//import 'p2'
//import * as Phaser from './lib/phaser'
import {Socket} from "phoenix-socket";

// Initialise Phaser
var game = new Phaser.Game(1920, 1080, Phaser.AUTO, null);

let bootState = require('./state_boot');
let loadState = require('./state_load');
let menuState = require('./state_menu');
let playState = require('./state_play');
let lobbyState = require('./state_lobby');

console.log('state-game all StateObjects:', bootState, loadState, menuState, playState, lobbyState);
//Global vars
game.global = {

    //Colors
    /*Grau: R51 G51 B51
     Cyan: R41 G171 B226
     Weiß: R242 G242 B242
     Orange: R247 G147 B30*/
    colors: {
        grau: '#333333',
        cyan: '#29abe2',
        weiss: '#f2f2f2',
        orange: '#f7931e'
    },

    colorReady: {true: '#00FF00', false: '#FF0000'},

    teamColors: {
        1: '#FF0000',
        2: '#00FF00',
        3: '#FF00FF',
        4: '#FFFF00',
        5: '#0000FF',
        6: '#00FFFF',
        7: '#550000',
        8: '#005500',
        9: '#550055',
        10: '#555500',
        11: '#000055',
        12: '#005555'
    },

    GET: {},

    websocket: {},

    //Hold all channel object that should be hold over states at this point this is only the main Channel
    channel: {},

    //Holds all data that get deprecated after a game ended and is used in lobby and play
    gameSpecificData: {
        authToken: undefined,
        userID: undefined,
        channel: undefined
    }
};

//Join the main Channel of the websocket and store a refference to both the socket and the channel in game.global
//game.global.websocket = new Socket("ws://cerium.lschuermann.xyz:64231/socket", {params: {token: undefined}});
game.global.websocket = new Socket("wss://api.brettprojekt.online/socket", {params: {token: undefined}});
game.global.websocket.connect();

game.global.channel.main = game.global.websocket.channel("main", {});

game.global.channel.main.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.error("Unable to join", resp) });

//split url to get GET parameters
const args = location.search.substr(1).split(/&/);
for (var i = 0; i < args.length; i++) {
    const tmp = args[i].split(/=/);
    if (tmp[0] != "") {
        game.global.GET[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp.slice(1).join("").replace("+", " "));
    }
}
console.log('GET_Parameters:', game.global.GET);

// Add all the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('lobby', lobbyState);

// Start the 'boot' state
game.state.start('boot', true, false, game);