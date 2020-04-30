const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split('.');
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            inject: false,
        })
    })
}

const htmlPlugins = generateHtmlPlugins('./src/html')

module.exports = {
    entry: [
        './src/js/index.js',
        './src/scss/style.scss'
    ],
    output: {
        filename: './js/bundle.js'
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src/js'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { name: 'img/[name].[ext]' }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 100000,
                            name: "[name].[ext]",
                            useRelativePath: true,
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(sass|scss)$/,
                include: path.resolve(__dirname, 'src/scss'),
                use: ExtractTextPlugin.extract({
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "resolve-url-loader"
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.html$/,
                include: path.resolve(__dirname, 'src/html'),
                use: ['raw-loader']
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: './css/style.bundle.css',
            allChunks: true,
        }),
        new CopyWebpackPlugin([
            {
                from: './src/favicon',
                to: './favicon'
            },
            {
                from: './src/img',
                to: './img'
            }
        ]),
    ].concat(htmlPlugins)
};
