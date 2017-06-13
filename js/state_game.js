/**
 * Created by andreas on 11.06.17.
 */
// Initialise Phaser
var game = new Phaser.Game(1024, 576, Phaser.AUTO, null);

// Add all the states
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('lobby', lobbyState);

// Start the 'boot' state
game.state.start('boot');