/**
 * Created by andreas on 11.06.17.
 */
var menuState = {
    create: function () {
        // Add a background image
        // game.add.image(0, 0, 'background');
        // Display the name of the game
        var nameLabel = game.add.text(game.world.centerX, 80, 'Brettprojekt Menu', { font: '50px Arial', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);

        //Add Start Button
        var startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', this.start, this, 1, 0, 2);
        startButton.anchor.set(0.5);
    },

    start: function () {
        //Go to the play state
        game.state.start('lobby');
    }
};