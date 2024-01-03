const path = require('path');
const { env } = require('process');
const webpack = require('webpack');
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '.env')
})
module.exports = {

    plugins: [
        new webpack.DefinePlugin({
            GOOGLE_CLIENT_ID: JSON.stringify(process.env.GOOGLE_CLIENT_ID)
        })
    ],
    entry: {
        bundle: ["@babel/polyfill", path.resolve(__dirname, './src/index.js')]
    },
    output: {
        path: __dirname + '/public'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']               
            },
            {
                test: /\.(mp3)$/,
                loader: 'url-loader'
            },
            {
                test: /\.(jpg|png|gif|svg)$/,
                use: ['file-loader']
            },
            { 
                test: /\.css$/, 
                use: ['style-loader', 'css-loader'] 
            },
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    devtool: 'source-map'
}