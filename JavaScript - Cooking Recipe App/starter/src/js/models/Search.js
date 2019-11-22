// We're going to use ES6 classes in order to describe the data
// model for the search.
// The data model for the search is basically just the query and the search results.

// Note that it's a convention to use the same name
// for the variable the package is bound to when importing it.
import axios from 'axios';

// Importing the Spoonacular API key from our config file
import key from '../config';

// We're only going to export one thing from Search.js, that being
// the Search class, so we use the syntax "export default"
export default class Search 
{
    // Remember, in JavaScript's ES6 classes, the constructor method
    // for a class is called constructor().
    constructor(query)
    {
        this.query = query;
    }

    // When defining methods inside of a class in JavaScript,
    // there's no need to use the function keyword. You can still
    // use keywords such as async or static to define asynchronous 
    // or static methods (and other such keywords.)
    async getResults()
    {

        // Usually, we would use the fetch() method to
        // make AJAX (Asynchronous Java And XML) requests,
        // but it turns out that the method doesn't actually
        // work with some older browsers.

        // Instead, we're going to use an HTTP request library called Axios,
        // which you can install using npm:
        //  npm install axios --save

        // Note that axios provides methods you can use in your
        // actual code, so it's a dependecy, not a development tool.
        
        // The axios() function can be used to make HTTP requests.
        // It works on all browsers, unlike the fetch() API, and does
        // many things that fetch() doesn't, such as automatically returning
        // JSON strings and being better at error handling.

        // Here we pass the API's URL for the search function. Note that when
        // adding parameters to URL searches, we first append a question mark (?)
        // to the end of the desired API function's URL, and then write the parameters
        // in the same order they appear in the API documentation.

        // Like fetch(), axios() returns a Promise, and since we're using an
        // async function, we have access to the await keyword.

        // Recall that error handling in JavaScript is done using try/catch blocks.
        try 
        {
            const result = await axios(`https://api.spoonacular.com/recipes/search?apiKey=${key}&query=${this.query}&number=15`);
            this.results = result.data.results;
            //console.log(this.results);
        }
        catch (error)
        {
            alert(error);
        }
    }
};