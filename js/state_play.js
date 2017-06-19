/**
 * Created by andreas on 11.06.17.
 */

var tween = null;
var popup;
var button;
//Time available for answering the questions (in seconds)
const time = 60;
var progressBar;
var progress;
var startTime;
var ph, pw;
var running;

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
        if(running){
            var d = new Date;
            var timeNow = d.getTime();

            progress = (timeNow - startTime) / (time * 1000);
            console.log("progress: " + progress);

            if(progress > 1){
                //When Time is over raise Event
                running = false;
                this.onTimeOver();
            }
            else {
                progressBar.clear();
                progressBar.beginFill('0x000000',1);
                progressBar.drawRoundedRect(-pw, -ph, 750,27,10);
                progressBar.endFill();
                progressBar.beginFill('0x999999',1);
                progressBar.drawRoundedRect(-pw + 1,-ph + 1,748*progress,25,10);
                progressBar.endFill();
            }
        }
    },

    openPopup: function () {
        console.log("open popup");
        //make popup visible
        popup.visible = true;

        //
        var d = new Date;
        startTime = d.getTime();
        running = true;

        if ((tween !== null && tween.isRunning) || popup.scale.x === 1)
        {
            return;
        }

        //  Create a tween that will pop-open the window, but only if it's not already tweening or open
        tween = game.add.tween(popup.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);
    },

    closePopup: function () {
        console.log("close popup");

        running = false;

        if (tween && tween.isRunning || popup.scale.x === 0.1)
        {
            return;
        }

        //Create a tween that will close the window, but only if it's not already tweening or closed
        //tween = game.add.tween(popup.scale).to( { x: 0.1, y: 0.1 }, 500, Phaser.Easing.Elastic.In, true);

        //make popup invisible on close
        popup.visible = false;
        popup.scale.setTo(0.1);
    },

    initPopup: function () {
        //Add Start Button
        var startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', this.openPopup, this, 1, 0, 2);
        startButton.anchor.set(0.5);

        //  You can drag the pop-up window around
        popup = game.add.sprite(game.world.centerX, game.world.centerY, 'popup_bg');
        popup.alpha = 0.9;
        popup.anchor.set(0.5);
        popup.inputEnabled = true;
        popup.input.enableDrag();
        popup.visible = false;

        //  Position the close button to the top-right of the popup sprite (minus 8px for spacing)
        pw = (popup.width / 2) - 30;
        ph = (popup.height / 2) - 8;

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
        var text_question = game.make.text(5, 20, 'How much is the fish?', { font: '50px Arial', fill: '#ffffff' });
        question.addChild(text_question);

        //Position the answer left field
        pw = (popup.width / 2) - 15;
        ph = (popup.height / 2) - 200;

        var answer_left = game.make.button(-pw, -ph, 'answer_left', this.onWrongAnswerClicked, this, 1, 0, 2);
        var text_left = game.make.text(5, 20, 'a', { font: '50px Arial', fill: '#ffffff' });
        answer_left.addChild(text_left);

        answer_left.inputEnabled = true;
        answer_left.useHandCursor = true;

        pw = (popup.width / 2) - 15;
        ph = (popup.height / 2) - 350;

        var answer_left2 = game.make.button(-pw, -ph, 'answer_left', this.onRightAnswerClicked, this, 1, 0, 2);
        var text_left2 = game.make.text(5, 20, 'c', { font: '50px Arial', fill: '#ffffff' });
        answer_left2.addChild(text_left2);

        pw = (popup.width / 2) - 410;
        ph = (popup.height / 2) - 200;

        var answer_right = game.make.button(-pw, -ph, 'answer_right', this.onWrongAnswerClicked, this, 1, 0, 2);
        var text_right = game.make.text(60, 20, 'b', { font: '50px Arial', fill: '#ffffff' });
        answer_right.addChild(text_right);

        pw = (popup.width / 2) - 410;
        ph = (popup.height / 2) - 350;

        var answer_right2 = game.make.button(-pw, -ph, 'answer_right', this.onWrongAnswerClicked, this, 1, 0, 2);
        var text_right2 = game.make.text(60, 20, 'd', { font: '50px Arial', fill: '#ffffff' });
        answer_right2.addChild(text_right2);


        pw = (popup.width / 2) - 20;
        ph = (popup.height / 2) - 20;
        //
        progressBar = game.make.graphics(0,0);
        progressBar.lineStyle(2, '0x000000');

        //  Add the child elements to the popup window image
        popup.addChild(closeButton);
        popup.addChild(question);
        popup.addChild(answer_left);
        popup.addChild(answer_left2);
        popup.addChild(answer_right);
        popup.addChild(answer_right2);
        popup.addChild(progressBar);

        //  Hide it awaiting a click
        popup.scale.set(0.1);
    },

    onRightAnswerClicked: function () {
        console.log("Right answer clicked");
    },

    onWrongAnswerClicked: function() {
        console.log("wrong answer clicked");
    },

    onQuestionReceived: function () {
        this.openPopup();
    },

    onTimeOver: function () {
        console.log("Time is Over");
    }
};