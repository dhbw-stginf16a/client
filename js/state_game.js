/**
 * Created by andreas on 11.06.17.
 */
// Initialise Phaser
var game = new Phaser.Game(1024, 576, Phaser.AUTO, null);

//split url to get GET parameters
const $_GET = {};
const args = location.search.substr(1).split(/&/);
for (let i=0; i<args.length; i++) {
    const tmp = args[i].split(/=/);
    if (tmp[0] != "") {
        $_GET[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp.slice(1).join("").replace("+", " "));
    }
}
console.log('GET_Parameters:', $_GET);

// Add all the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('lobby', lobbyState);

// Start the 'boot' state
game.state.start('boot');