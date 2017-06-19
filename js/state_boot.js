/**
 * Created by andreas on 11.06.17.
 */
var bootState = {

    preload: function () {
        //Add Phaser Input plugin
        game.add.plugin(PhaserInput.Plugin);

        //Load the Image
        game.load.image('progressBar', 'assets/progressBar.png');

        // Set the type of scaling to 'show all'
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // to add a blue color to the page, to hide the white borders we have uncomment
        //document.body.style.backgroundColor = '#3498db';
        // Center the game on the screen
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        //Force Landscape mode
        game.scale.forceLandscape = true;
    },
    create: function () {
        game.stage.backgroundColor = '#3498db';
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //Start the load state
        game.state.start('load');
    }

};