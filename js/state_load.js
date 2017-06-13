/**
 * Created by andreas on 11.06.17.
 */

var loadState = {
    preload: function () {
        // Add a 'loading...' label on the screen
        var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...',
            { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);

        // Display the progress bar
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);

        // Load all our assets
        game.load.spritesheet('button', 'assets/button.png', 120, 40);
        game.load.image('background', 'assets/background.png');
    },
    create: function () {
        //Start the menu state
        game.state.start('menu');
    }
};