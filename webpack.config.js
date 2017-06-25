const path = require('path');
const webpack = require('webpack');
//look into https://github.com/orange-games/phaser-input/issues/7
 module.exports = {
     entry: './js/state_game.js',
     resolve: {
         alias: {
             //pixi: path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
             //phaser: path.join(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
             //p2: path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
             //'phaser-input': path.join(__dirname, 'node_modules/@orange-games/phaser-input/build/phaser-input.js')
         }
     },
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'main.bundle.js'
     },
     module: {
     /*rules: [
             { test:/phaser\-input\.min\.js$/},
             { test:/phaser\.js$/}
         ],*/
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             }
         ],
         noParse: [
             /phaser-ce/
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map',

 };