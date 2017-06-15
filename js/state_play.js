/**
 * Created by andreas on 11.06.17.
 */

var tween = null;
var popup;
var button;

var playState = {
    preload: function () {

    },

    create: function () {
        //Show Name of the screen
        var nameLabel = game.add.text(game.world.centerX, 80, 'Brettprojekt Play State', { font: '50px Arial', fill: '#ffffff' });
        nameLabel.anchor.setTo(0.5, 0.5);

        //init popup window for the questions
        this.initPopup();
    },

    update: function () {

    },

    openPopup: function () {
        console.log("open popup");
        //make popup visible
        popup.visible = true;

        if ((tween !== null && tween.isRunning) || popup.scale.x === 1)
        {
            return;
        }

        //  Create a tween that will pop-open the window, but only if it's not already tweening or open
        tween = game.add.tween(popup.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
    },

    closePopup: function () {
        console.log("close popup");
        //make popup invisible on close
        popup.visible = false;

        if (tween && tween.isRunning || popup.scale.x === 0.1)
        {
            return;
        }

        //  Create a tween that will close the window, but only if it's not already tweening or closed
        tween = game.add.tween(popup.scale).to( { x: 0.1, y: 0.1 }, 500, Phaser.Easing.Elastic.In, true);
    },

    initPopup: function () {
        //Create Button to show popup
        button = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', this.openPopup, this, 1, 0, 2);
        button.input.useHandCursor = true;
        button.anchor.set(0.5);

        //  You can drag the pop-up window around
        popup = game.add.sprite(game.world.centerX, game.world.centerY, 'popup_bg');
        popup.alpha = 0.9;
        popup.anchor.set(0.5);
        popup.inputEnabled = true;
        popup.input.enableDrag();
        popup.visible = false;

        //  Position the close button to the top-right of the popup sprite (minus 8px for spacing)
        var pw = (popup.width / 2) - 30;
        var ph = (popup.height / 2) - 8;

        //  And click the close button to close it down again
        var closeButton = game.make.sprite(pw, -ph, 'close');
        closeButton.inputEnabled = true;
        closeButton.input.priorityID = 1;
        closeButton.input.useHandCursor = true;
        closeButton.events.onInputDown.add(this.closePopup, this);

        //Position the question field
        pw = (popup.width / 2) - 15;
        ph = (popup.height / 2) - 50;

        var question = game.make.sprite(-pw, -ph, 'question');

        //Position the answer left field
        pw = (popup.width / 2) - 15;
        ph = (popup.height / 2) - 200;

        var answer_left = game.make.button(-pw, -ph, 'answer_left', this.onAnswerClicked, this, 1, 0, 2);
        answer_left.inputEnabled = true;
        answer_left.useHandCursor = true;

        pw = (popup.width / 2) - 15;
        ph = (popup.height / 2) - 350;

        var answer_left2 = game.make.button(-pw, -ph, 'answer_left', this.onAnswerClicked, this, 1, 0, 2);

        pw = (popup.width / 2) - 410;
        ph = (popup.height / 2) - 200;

        var answer_right = game.make.button(-pw, -ph, 'answer_right', this.onAnswerClicked, this, 1, 0, 2);

        pw = (popup.width / 2) - 410;
        ph = (popup.height / 2) - 350;

        var answer_right2 = game.make.button(-pw, -ph, 'answer_right', this.onAnswerClicked, this, 1, 0, 2);

        //  Add the child elements to the popup window image
        popup.addChild(closeButton);
        popup.addChild(question);
        popup.addChild(answer_left);
        popup.addChild(answer_left2);
        popup.addChild(answer_right);
        popup.addChild(answer_right2);

        //  Hide it awaiting a click
        popup.scale.set(0.1);
    },

    onAnswerClicked: function () {
        console.log("answer clicked");
    }
};

//Only difference to a Button constructor is the label parameter...
LabelButton = function(game, x, y, key, label, callback, callbackContext, overFrame, outFrame, downFrame, upFrame){
    Phaser.Button.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
    //Style how you wish...
    this.style = {
        'font': '10px Arial',
        'fill': 'black'    };
    this.label = new Phaser.Text(game, 0, 0, "Label", this.style);
    this.addChild(this.label);
    this.setLabel("Label");
};

LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton;
LabelButton.prototype.setLabel = function(label) {
    this.label.setText(label);
    this.label.x = Math.floor((this.width - this.label.width)*0.5);
    this.label.y = Math.floor((this.height - this.label.height)*0.5);
};