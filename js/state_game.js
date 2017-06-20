/**
 * Created by andreas on 11.06.17.
 */
// Initialise Phaser
var game = new Phaser.Game(1920, 1080, Phaser.AUTO, null);

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
    }

};

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