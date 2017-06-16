/**
 * Created by andreas on 13.06.17.
 */
var lobbyState = {
    preload: function () {

    },

    create: function () {
        var nameLabel = game.add.text(game.world.centerX, 80, 'Brettprojekt Lobby', { font: '50px Arial', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);

        //Adding a textarea at the center of the screen (default width of the textarea is 150)
        var input = game.add.inputField(game.world.width*0.5 - 75, game.world.height*0.5);
        input.setText("Random Text");
        //The textarea can be styled this way
        /*var password = game.add.inputField(10, 90, {
            font: '18px Arial',
            fill: '#212121',
            fontWeight: 'bold',
            width: 150,
            padding: 8,
            borderWidth: 1,
            borderColor: '#000',
            borderRadius: 6,
            placeHolder: 'Password',
            type: PhaserInput.InputType.password
        });*/
    },

    update: function () {

    }
};
