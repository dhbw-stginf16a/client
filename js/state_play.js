/**
 * Created by andreas on 11.06.17.
 */
let game;

//--------- Global Vars for the PlayState
let categories = ["category1", "category2", "category3"];
let tween = null;
let popup;
let button;
//--------- Global Vars for the Playfield
const amountOfPositions = 84;
let positions = [1,2];
//--------- Global Vars for Left Panel


//--------- Global Vars for the Popup Window
//Time available for answering the questions (in seconds)
const time = 60;
//progressBar object
let progressBar;
//Value between 0 and 1
let progress;
//Time when the Question Windows was opened
let startTime;
//Position of the Elements
let ph, pw;
//Stores if the question popup is open or not
let running;

//font styles
let pointsStyle;
let categoryStyle;
let smallStyle;

/**
 * Converts the given string to a number assuming it is a string of form #XXXXXX
 * where X = [0-9A-Fa-f]
 * @param stringToConvert
 */
function convertHexcodeToDecimal(stringToConvert) {
    stringToConvert = stringToConvert.toUpperCase();
    let newNumber = 0;
    for (let i = 1; i <= 6; i++) {
        const char = stringToConvert.charAt(i);
        newNumber = (newNumber << 4);
        if (char >= '0' && char <= '9') {
            newNumber += (char - 0);
        } else if (char === 'A') {
            newNumber += 10;
        } else if (char === 'B') {
            newNumber += 11;
        } else if (char === 'C') {
            newNumber += 12;
        } else if (char === 'D') {
            newNumber += 13;
        } else if (char === 'E') {
            newNumber += 14;
        } else if (char === 'F') {
            newNumber += 15;
        }
    }
    return newNumber;
}

module.exports = {
    /*
     this._players stores a array of players of the form {team, id, team, ready}
     this._teamMarkers stores a array of the teamMarkers they contain the field ._position stating there current position on the playfield
     this._positionsPlayingField stores the field of the Playfield in reversed order

     this._pointsDisplay The big points display of the
     */

    preload: function () {

    },

    /**
     * **IMPORTANT**
     * All Assets used here should already be loaded in state-load because preload is called after init
     * @param game The global game handle
     * @param players the player list from the lobby-state
     * @param event the payload from the first round_preparation
     */
    init: function (gameState, players, event) {

        game = gameState;
        console.log('state-play: init was called with: ', gameState, players);

        if (players === undefined) {
            throw new Error('State-lobby: The players received were undefined');
        }
        this._players = players;

        //Show Name of the screen
        let nameLabel = game.add.text(game.world.centerX, 80, 'Brettprojekt Play State', {
            font: '50px Arial',
            fill: '#ffffff'
        });
        nameLabel.anchor.setTo(0.5, 0.5);

        pointsStyle = {
            font: "30px Arial",
            fill: game.global.colors.weiss,
            wordWrap: true,
            wordWrapWidth: 260,
            align: "center"
        };

        /*
         * needs to be different from pointsStyle
         * pointsStyle.fill is changed during below
         */
        categoryStyle = {
            font: "30px Arial",
            fill: game.global.colors.weiss,
            wordWrap: true,
            wordWrapWidth: 260,
            align: "center"
        };

        smallStyle = {
            font: "20px Arial",
            fill: game.global.colors.weiss,
            wordWrap: true,
            wordWrapWidth: 260,
            align: "center"
        };

        //load Playfield
        this.loadPF();
        //load Playermarkers
        this.loadTeammarkers(this._players);

        //load left Panel
        this.loadLP();
        //load right Panel
        this.loadRP();
        //load the two top panels
        this.loadTP();
        this.updateCategories();
        //init popup window for the questions
        this.initPopup();
    },

    create: function () {

    },

    update: function () {

        if(running){
            let d = new Date;
            let timeNow = d.getTime();

            progress = (timeNow - startTime) / (time * 1000);
            //console.log("progress: " + progress);

            if(progress >= 1){
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

    /**
     * Loads the left Panel and draws all stuff needed for it
     */
    loadLP: function () {
        const posx = 20;
        const posy = 20;

        //frame
        let controllRECT = game.add.graphics(0, 0);
        controllRECT.lineStyle(2,0xF2F2F2,1);
        controllRECT.beginFill(0x333333,1);
        controllRECT.drawRect(posx,posy,530,1040);
        
        //points
        game.add.text(posx + 20, posy + 20, "POINTS:", pointsStyle);

        let graphics = game.add.graphics(0,0);
        graphics.lineStyle(2, 0xF2F2F2, 1);


        //Players
        const nicknamePosX = posx + 55;
        const teamPosX = nicknamePosX + 250;
        const pointsPosX = teamPosX + 100;
        const offsetPlayerY = posy + 160;
        const offsetHeadingY = posy + 100 + 10;
        const distanceToNewPlayer = 50;

        graphics.moveTo(posx,posy+90);
        graphics.lineTo(posx+50,posy+90);
        game.add.text(posx+55,posy+75, "Players", smallStyle);
        graphics.moveTo(posx+130,posy+90);
        graphics.lineTo(posx+530,posy+90);

        game.add.text(nicknamePosX, offsetHeadingY, "Nickname", pointsStyle);
        game.add.text(teamPosX, offsetHeadingY, "Team", pointsStyle);
        game.add.text(pointsPosX, offsetHeadingY, "Points", pointsStyle);

        //Points of the players team
        pointsStyle.fill = game.global.teamColors[this._players[0].team - (-1)]; //TODO maybe search properly for the player
        this._pointsDisp = game.add.text(posx + 170, posy + 20, "0", pointsStyle);

        for (let i = 0; i < this._players.length; i++) {
            pointsStyle.fill = game.global.teamColors[this._players[i].team - (-1)];
            this._players[i]._nameDisplay = game.add.text(nicknamePosX, offsetPlayerY + (i * distanceToNewPlayer), this._players[i].name, pointsStyle);
            this._players[i]._teamDisplay = game.add.text(teamPosX, offsetPlayerY + (i * distanceToNewPlayer), this._players[i].team - (-1), pointsStyle);
            this._players[i]._scoreDisplay = game.add.text(pointsPosX, offsetPlayerY + (i * distanceToNewPlayer), amountOfPositions - this._teamMarkers[this._players[i].team]._position, pointsStyle);
        }
    },

    loadRP: function () {
        let cardRECT = game.add.graphics(0, 0);
        cardRECT.lineStyle(2,0xF2F2F2,1);
        cardRECT.beginFill(0x333333,1);
        cardRECT.drawRect(1370,20,530,1040);

    },

    loadTP: function () {
        //basic position values
        const posx = 560;
        const posy = 110;

        //panel for the view of the randomly selected categories
        let leftRECT = game.add.graphics(0,0);

        leftRECT.lineStyle(2,0xF2F2F2,1);
        leftRECT.beginFill(0x333333,1);
        leftRECT.drawRect(posx,posy,400,150);

        //panel for the player to category mapping
        let rightRECT = game.add.graphics(0,0);

        rightRECT.lineStyle(2,0xF2F2F2,1);
        rightRECT.beginFill(0x333333,1);
        rightRECT.drawRect(posx + 400,posy,400,150);
    },

    loadPF: function () {
        let xpos = 0;
        let ypos = 0;
        let lastXpos = 0;
        let lastYpos = 0;
        let offsetX = -20;  //x position of playfield with 0 = middle of screen (+ = right, - = left)
        let offsetY = -190; //y position of playfield with 0 = middle of screen (+ = up, - = down)

        let pRadius = 20;

        let square = game.add.graphics(offsetX + 580, -offsetY+70);
        square.anchor.set(0.5);
        square.lineStyle(2,0xF2F2F2,1);
        square.beginFill(0x333333,1);
        square.drawRect(0,0,800,800);

        let graphics = game.add.graphics(0,0);

        for(let i=0; i<85;i++){
            positions[i] = {x: game.world.centerX+xpos+offsetX, y:game.world.centerY+ypos-offsetY};
            if(i%7 === 0){ //draws special fields (currently every 7th field is special)
                graphics.anchor.set(0.5);
                graphics.beginFill(0x33abe2, 1);
                graphics.lineStyle(2,0xF2F2F2,1);
                graphics.drawRect(game.world.centerX+xpos+offsetX-pRadius/2,game.world.centerY+ypos-offsetY-pRadius/2,pRadius,pRadius);

            }else{     //draws normal fields
                graphics.anchor.set(0.5);
                graphics.beginFill(0xf7931e, 1);
                graphics.lineStyle(2, 0xF2F2F2, 1);
                graphics.drawCircle(game.world.centerX + xpos + offsetX, game.world.centerY + ypos - offsetY, pRadius);
            }


            if (i<2){
                graphics.moveTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY+pRadius/2);
                ypos = ypos+60;
                graphics.lineTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY-pRadius/2);
            }
            if (i>=2 && i<5){
                graphics.moveTo(game.world.centerX+xpos+offsetX+pRadius/2,game.world.centerY+ypos-offsetY);
                xpos = xpos+60;
                graphics.lineTo(game.world.centerX+xpos+offsetX-pRadius/2,game.world.centerY+ypos-offsetY);
            }
            if (i>=5 && i<11){
                graphics.moveTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY-pRadius/2);
                ypos = ypos-60;
                graphics.lineTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY+pRadius/2);
            }
            if (i>=11 && i<17){
                graphics.moveTo(game.world.centerX+xpos+offsetX-pRadius/2,game.world.centerY+ypos-offsetY);
                xpos = xpos-60;
                graphics.lineTo(game.world.centerX+xpos+offsetX+pRadius/2,game.world.centerY+ypos-offsetY);
            }
            if (i>=17 && i<24){
                graphics.moveTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY+pRadius/2);
                ypos = ypos+60;
                graphics.lineTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY-pRadius/2);
            }
            if (i>=24 && i<31){
                graphics.moveTo(game.world.centerX+xpos+offsetX+pRadius/2,game.world.centerY+ypos-offsetY);
                xpos = xpos+60;
                graphics.lineTo(game.world.centerX+xpos+offsetX-pRadius/2,game.world.centerY+ypos-offsetY);
            }
            if (i>=31 && i<39){
                graphics.moveTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY-pRadius/2);
                ypos = ypos-60;
                graphics.lineTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY+pRadius/2);
            }
            if (i>=39 && i<47){
                graphics.moveTo(game.world.centerX+xpos+offsetX-pRadius/2,game.world.centerY+ypos-offsetY);
                xpos = xpos-60;
                graphics.lineTo(game.world.centerX+xpos+offsetX+pRadius/2,game.world.centerY+ypos-offsetY);
            }
            if (i>=47 && i<56){
                graphics.moveTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY+pRadius/2);
                ypos = ypos+60;
                graphics.lineTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY-pRadius/2);
            }
            if (i>=56 && i<65){
                graphics.moveTo(game.world.centerX+xpos+offsetX+pRadius/2,game.world.centerY+ypos-offsetY);
                xpos = xpos+60;
                graphics.lineTo(game.world.centerX+xpos+offsetX-pRadius/2,game.world.centerY+ypos-offsetY);
            }
            if (i>=65 && i<75){
                graphics.moveTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY-pRadius/2);
                ypos = ypos-60;
                graphics.lineTo(game.world.centerX+xpos+offsetX,game.world.centerY+ypos-offsetY+pRadius/2);
            }
            if (i>=75 && i<85){
                graphics.moveTo(game.world.centerX+xpos+offsetX-pRadius/2,game.world.centerY+ypos-offsetY);
                xpos = xpos-60;
                if(i<84)
                graphics.lineTo(game.world.centerX+xpos+offsetX+pRadius/2,game.world.centerY+ypos-offsetY);
            }

        }
        graphics.anchor.set(0.5);
        graphics.beginFill(0x000000, 1);
        graphics.lineStyle(2,0xf2f2f2,1);
        graphics.drawRect(game.world.centerX-140+offsetX,game.world.centerY-20,280,220)
        let style = { font: "90px Arial", fill: "#f2f2f2", wordWrap: true, wordWrapWidth: 260, align: "center"};
        let text = game.add.text(game.world.centerX+offsetX, game.world.centerY+90, "GOAL", style);
        text.anchor.set(0.5);
    },

    /**
     * Initialises the Teammarkers based on the given playerlist
     * @param players the list of players from the lobby state
     */
    loadTeammarkers: function (players) {
        this._teamMarkers = {};
        for (const aktPlayer in players) {
            const player = players[aktPlayer];
            if (player != undefined) {
                const team = player.team;
                if (this._teamMarkers[team] == undefined) {
                    this._teamMarkers[team] = game.add.graphics(0, 0);
                    this._teamMarkers[team].beginFill(convertHexcodeToDecimal(game.global.teamColors[team - (-1)]), 1);
                    this._teamMarkers[team].drawCircle(positions[84].x, positions[84].y, 20);
                    this._teamMarkers[team].inputEnabled = true;
                    this._teamMarkers[team].input.enableDrag();
                    this._teamMarkers[team].anchor.set(team / 4, team / 4);
                    this._teamMarkers[team]._position = amountOfPositions;
                }
            }
        }
        console.log('play-state: loadTeammarkers', this._teamMarkers);

        //moving the Player when mouse is clicked
        game.input.onDown.add(doSomething, this);
        function doSomething() {
            this.moveTeam(0, 1);
            this.updateScores();
        }
    },

    /**
     * Moves the teamMarker by a certain amount
     * @param team the teamID to move (starts at 1)
     * @param amount the amount of score to alter
     */
    moveTeam: function (team, amount) {
        let playerMarker = this._teamMarkers[team];
        //console.log('play-state: movePlayer', playerMarker, amount);
        playerMarker.x = positions[playerMarker._position - amount].x - positions[84].x;
        playerMarker.y = positions[playerMarker._position - amount].y - positions[84].y;
        playerMarker._position = playerMarker._position - amount;
    },

    /**
     * Sets the specific teamMarker to the score named
     * @param team the teamID to move (starts at 1)
     * @param score the score to set to
     */
    setTeam: function (team, score) {
        let playerMarker = this._teamMarkers[team];
        //console.log('play-state: movePlayer', playerMarker, amount);
        playerMarker.x = positions[amountOfPositions - score].x - positions[84].x;
        playerMarker.y = positions[amountOfPositions - score].y - positions[84].y;
        playerMarker._position = amountOfPositions - score;
    },

    /**
     * updates the Scores on the RP to the new values
     */
    updateScores: function () {
        this._pointsDisp.text = amountOfPositions - this._teamMarkers[this._players[0].team]._position;//TODO maybe look properly for the player
        for (let i = 0; i < this._players.length; i++) {
            this._players[i]._scoreDisplay.text = amountOfPositions - this._teamMarkers[this._players[i].team]._position;
        }
    },

    updateCategories: function () {
        console.log("updating categories");

        const posx = 560;
        const posy = 110;

        const leftpanelposx = posx + 20;
        const panelposy = posy + 10;
        const leftdifficultypanelposx = posx + 310;
        const rightpanelposx = posx + 420;
        const solvingPlayerposx = rightpanelposx + 150;

        //left Panel
        game.add.text(leftpanelposx, panelposy, categories[0], categoryStyle);
        game.add.text(leftpanelposx, panelposy + 40, categories[1], categoryStyle);
        game.add.text(leftpanelposx, panelposy + 80, categories[2], categoryStyle);

        let difficulties = ['1','2','3'];


        game.add.text(leftdifficultypanelposx, panelposy + 40, "diff2", categoryStyle);
        game.add.text(leftdifficultypanelposx, panelposy + 80, "diff3", categoryStyle);

        //right panel
        game.add.text(rightpanelposx, panelposy, "Cat_1", categoryStyle);
        game.add.text(rightpanelposx, panelposy + 40, "Cat_2", categoryStyle);
        game.add.text(rightpanelposx, panelposy + 80, "Cat_3", categoryStyle);


        game.add.text(solvingPlayerposx, panelposy, "SolvingP1", categoryStyle);
        game.add.text(solvingPlayerposx, panelposy + 40, "SolvingP2", categoryStyle);
        game.add.text(solvingPlayerposx, panelposy + 80, "SolvingP3", categoryStyle);
    },

    openPopup: function () {
        console.log("open popup");
        //make popup visible
        popup.visible = true;

        //
        let d = new Date;
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
        let startButton = game.add.button(game.world.width*0.9, game.world.height*0.5, 'button', this.openPopup, this, 1, 0, 2);
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
        let closeButton = game.make.sprite(pw, -ph, 'close');
        closeButton.inputEnabled = true;
        closeButton.input.priorityID = 1;
        closeButton.input.useHandCursor = true;
        closeButton.events.onInputDown.add(this.closePopup, this);

        //Position the question field
        pw = (popup.width / 2) - 15;
        ph = (popup.height / 2) - 50;

        let question = game.make.sprite(-pw, -ph, 'question');
        let text_question = game.make.text(5, 20, 'How much is the fish?', { font: '50px Arial', fill: '#f2f2f2' });
        question.addChild(text_question);

        //Position the answer left field
        pw = (popup.width / 2) - 15;
        ph = (popup.height / 2) - 200;

        let answer_left = game.make.button(-pw, -ph, 'answer_left', this.onWrongAnswerClicked, this, 1, 0, 2);
        let text_left = game.make.text(5, 20, 'a', { font: '50px Arial', fill: '#f2f2f2' });
        answer_left.addChild(text_left);

        answer_left.inputEnabled = true;
        answer_left.useHandCursor = true;

        pw = (popup.width / 2) - 15;
        ph = (popup.height / 2) - 350;

        let answer_left2 = game.make.button(-pw, -ph, 'answer_left', this.onRightAnswerClicked, this, 1, 0, 2);
        let text_left2 = game.make.text(5, 20, 'c', { font: '50px Arial', fill: '#f2f2f2' });
        answer_left2.addChild(text_left2);

        pw = (popup.width / 2) - 410;
        ph = (popup.height / 2) - 200;

        let answer_right = game.make.button(-pw, -ph, 'answer_right', this.onWrongAnswerClicked, this, 1, 0, 2);
        let text_right = game.make.text(60, 20, 'b', { font: '50px Arial', fill: '#f2f2f2' });
        answer_right.addChild(text_right);

        pw = (popup.width / 2) - 410;
        ph = (popup.height / 2) - 350;

        let answer_right2 = game.make.button(-pw, -ph, 'answer_right', this.onWrongAnswerClicked, this, 1, 0, 2);
        let text_right2 = game.make.text(60, 20, 'd', { font: '50px Arial', fill: '#f2f2f2' });
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

    onRoundPreparation: function () {

    },

    onCategoryClicked: function () {
        game.global.gameSpecificData.channel.push('set_categories', {
            auth_token: game.global.gameSpecificData.authToken,
            categories: categories
        }).receive('ok', e => console.log('state_lobby: SetCategoryReceiveOk', e)).receive('error', e => console.error('state_play: SetCategoryReceiveError', e));

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