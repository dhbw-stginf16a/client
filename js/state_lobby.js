/**
 * Created by andreas on 13.06.17.
 */
var lobbyState = {
    preload: function () {

    },

    create: function () {
        var nameLabel = game.add.text(game.world.centerX, 80, 'Brettprojekt Lobby', { font: '50px Arial', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);
    },

    update: function () {

    }
};
