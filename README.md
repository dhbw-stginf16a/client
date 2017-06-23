# Project Management Web Client

This Client uses the Web Gameengine Phaser.

- Game State
- Boot State
- Load State
- Menu State
- Lobby State
- Play State


##Setup
###1. Install node.js and npm:
https://nodejs.org/en/

###2. Install dependencies
Please go in the root of you project an perform the following commands:
```
npm install babel-cli babel-core --save-dev
npm install babel-preset-es2015 --save-dev
npm install babel-loader webpack --save-dev
npm install exports-loader --save-dev
npm install @orange-games/phaser-input --save-dev
npm install phaser-ce
npm install phaser --save-dev
npm install expose-loader
```

Maybe needed:
```
npm install pixi.js
npm install phaser-input
```

##Run Server
1. Run Webpack ```npm run webpack```.
1. Run server ```npm start``` you will need ```npm install http-server --save-dev``` to do so.