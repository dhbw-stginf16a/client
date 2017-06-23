var path = require('path');
var webpack = require('webpack');
//look into https://github.com/orange-games/phaser-input/issues/7
 module.exports = {
     entry: './js/state_game.js',
     resolve: {
         alias: {
             pixi: path.join(__dirname, 'node_modules/phaser-ce/build/custom/pixi.js'),
             phaser: path.join(__dirname, 'node_modules/phaser-ce/build/custom/phaser-split.js'),
             p2: path.join(__dirname, 'node_modules/phaser-ce/build/custom/p2.js'),
             'phaser-input': path.join(__dirname, 'node_modules/@orange-games/phaser-input/build/phaser-input.js')
         }
     },
     output: {
         path: path.resolve(__dirname, 'build'),
         filename: 'main.bundle.js'
     },
     module: {
         rules: [
             { test: /pixi\.js/, use: ['expose-loader?PIXI'] },
             { test: /phaser-split\.js$/, use: ['expose-loader?Phaser'] },
             { test: /p2\.js/, use: ['expose-loader?p2'] },
             { test: /phaser\-input\.js$/, use: 'exports-loader?PhaserInput=PhaserInput' },
             { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
             { test: /\.ts$/, loader: 'ts-loader' }
         ],
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