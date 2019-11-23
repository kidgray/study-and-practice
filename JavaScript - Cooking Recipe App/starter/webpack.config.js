/*
In a Webpack configuration file, all you have to do is just create one object
in which you specify your desired settings (configuration) for Webpack.
*/

// In order to use the absolute path that we need for the path
// property of the output object (see below), we need to use
// a built-in Node package.

// The require() method allows us to include a built-in Node module (in this case,
// it's the 'path' module). This package contains a method that we can use to obtain
// an absolute path. 

const path = require('path');

// This is the include directive for our Webpack HTML Plugin.
const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports is the Node.js syntax we use to export the configuration
// object. This is done so that webpack can actually take the object and work with it.
module.exports = 
{
    // In order to make a Webpack configuration file,
    // we need to know 4 core concepts about Webpack:

    // 1. ENTRY POINT
    // The entry point is the file where Webpack will start looking
    // for all the dependencies (this should be your project's dependencies) 
    // that it has to bundle together

    // NOTE: Recall that in the console, dot (.) refers to the CURRENT FOLDER,
    // while two dots (..) refers to the PARENT FOLDER (of the current directory).

    // You can use an index.js file as an entry file.
    entry: 
    [
        // It's possible to have multiple entry points. Simply
        // pass them in as an array.
        '@babel/polyfill',
        './src/js/index.js',
    ],

    // 2. Output
    // The OUTPUT property tells Webpack where it should save our bundled files.
    // Typically, for the output property, we pass in an OBJECT that contains the
    // path to the directory where we want to save the bundled files.
    output: 
    {
        // In the object, we want 2 properties:
        //  path: this tells us the path to the directory where we want to save the output
        //  the path must be an ABSOLUTE PATH, i.e. the entire path name starting from the root folder

        //  filename: what we want our bundled file to be called.
        //  a good name is "bundle.js".



        // Note that in the path property, we use the resolve() method of the path
        // package (which we included above). The __dirname is a variable from Node.js
        // that contains the absolute path of the current directory.

        // We use the resolve() method to join the absolute path of the current directory
        // to the absolute path of the directory that we want to store our output in.

        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    // Starting in Webpack 4, we have something called the Production
    // and the Development mode. 

    //      - DEVELOPMENT MODE simply builds our bundle
    //        without minifying our code
    //
    //      - PRODUCTION MODE automatically enables
    //        optimizations such as minification and tree shaking,
    //        which reduces the final bundle's file size.
    //
    // Note that this can be specified directly in the NPM script
    // that you use to run webpack. This is convenient because
    // you can create two scripts, one for development (that uses the development mode) 
    // and one for your final build (that uses the production mode)
    // Simply write:
    // ....
    // 'dev': 'webpack mode development'
    // 'build': 'webpack mode production'
    // See webpack config file for details.

    // These are the configuration settings for the
    // Webpack Development Server. Like with the output
    // settings, we pass it an object that contains our
    // actual settings.
    devServer: 
    {
        // 1. CONTENT BASE
        // Here we specify the folder from which
        // the Webpack server will serve our files.
        // In our case, we use the distribution (dist) folder,
        // since that's the folder that contains all our final
        // files (the ones which we would send to the client
        // if this were a real project.)
        contentBase: './dist/'
    },

    // 3. Loaders
    // LOADERS in Webpack allow us to import ("load") many different files.
    // It also allows us to PROCESS them. Examples of this are converting SASS
    // to CSS Code or ES6 code to ES5 JavaScript.

    // 4. Plugins
    // The property that denotes all the plugins that we'll be using
    // with Webpack. The plugins property takes an array that lists
    // every plugin we're using. 
    plugins: 
    [
        // The reason we're using the new keyword here
        // is that the variable HtmlWebpackPlugin which
        // we used to include our plugin is actually like
        // a function constructor; we therefore need to use
        // the new keyword in order to instantitate it here.
        new HtmlWebpackPlugin
        (
            // Note that it's very common in JavaScript
            // to pass configuration options through objects,
            // like we've been doing in this entire file.
            {
                // Every time we bundle our JavaScript files,
                // we want to copy our source HTML into the
                // distribution folder (dist) and include the
                // script to our JavaScript bundle.

                // So, this is the name of the file we want to copy:
                filename: 'index.html',
                // Then we use the template property to
                // indicate our starting ("template") HTML file,
                // which in our case is the one from our src folder.
                template: './src/index.html'
            }
        )
    ],
    module:
    {
        // This property should receive an array
        // containing the names of all the loaders
        // we want to use.
        rules: 
        [
            // Each loader is itself an object, since
            // it takes various config settings
            {
                // Each loader needs a test property,
                // which takes a regular expression value
                // that looks for all our JavaScript files (i.e. file that end in .js):
                test: /\.js$/,
                // The exclude property denotes which folders or files
                // should be excluded from the test above. We need to exclude
                // the files in node_modules, because if we don't, Babel would
                // convert ALL of the THOUSANDS of .js files in the node_modules
                // folder, which is unnecessary; we only want Babel to convert our
                // project's files.
                exclude: /node_modules/,
                // All of the .js files will use the Babel loader, so
                // we need to set up the use property, which takes an object
                use:
                {
                    // The use property has a loader property
                    // that takes the loader that we want to use.
                    // In this case that's the babel loader.
                    loader: 'babel-loader'
                }
            }
        ]
    }
};  