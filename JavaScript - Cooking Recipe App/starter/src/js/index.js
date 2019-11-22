// Global app controller

// Example of a basic import statement in ES6.
// Recall that when we import a module in JavaScript,
// We don't need to include the .js after the module's name
//import statement from './models/Search'

// If we want to import a NAMED EXPORT from another file, it works
// in a slightly different way:

//import { add, mult, ID } from './views/searchView';

// Note that by default,
// you must use the EXACT SAME NAMES for the named exports
// as you used in the file you're importing them from!

// However, it's also possible to give the imported data a different name
// in the file you're importing them to by using the as keyword:

// import { add as function1, mult as function2, ID as num } from './views/searchView';

// FURTHERMORE, it's also possible to import EVERYTHING from a given module. Example:

// import * as searchView from './views/searchView';

// This is similar to DJANGO syntax, except you have to include the "as" keyword. In JavaScript,
// the universal import will bring over all the exports of the specified file and store them
// in an object. At that point, you can access each export as a prototype using the specified
// name (to the right of the as keyword) and the dot operator!

// searchView.add(1, 2);
// searchView.multiply(5, 10);

//console.log(`Using imported functions! ${add(ID, 2)} and ${mult(3, 5)}\n ${statement}`)

///////////////////////////////////////////////////////////////////////////////////////////////

// We must import the methods we want to use in our
// JavaScript files from packages we install (such as Axios).
// Fortunately, this works very similarly to how importing
// methods from our own modules works.

// Let's import our Search class from Search.js
import Search from './models/Search';

// Import the Recipe class from Recipe.js
import Recipe from './models/Recipe';

// We need to import ALL of the functions of our
// searchView file.
import * as searchView from './views/searchView';

// Import all functions of the recipeView file
import * as recipeView from './views/recipeView';

// We'll also import the DOM elements object we declared in
// views/base.js. This file will serve as the central location
// of all the elements we will need to select on our DOM. It's best
// to do it this way because it makes your code more modular. This way,
// if you change your HTML file at some point in the future, you can just
// change the querySelector calls in base.js rather than having to go to
// EVERY SINGLE call to querySelector and changing them there.
import { elements, renderSpinner, clearSpinner } from './views/base';

/* * GLOBAL APP STATE *
* - Search object (search query, search results, etc)
* - Current recipe object
* - Shopping list object
* - Liked recipes
*/
const state = {};

// We need a function that will be called from within the callback function
// of the event listener for the search bar.
// Note that you can put the async keyword next to the parameter list in an arrow
// function as shown below! That's cool.

/* SEARCH CONTROLLER */
const controlSearch = async () =>
{
    // 1. Get the query from the view
    const query = searchView.getInput();
    
    // 2. If a query exists, create a new search object
    // and add it to the state
    if (query)
    {
        state.search = new Search(query);

        // 3. Prepare the User Interface for results (spinner, 'load screen')
        searchView.clearInput();
        searchView.clearResults();

        // The parent element we have to pass in to renderSpinner()
        // is actually the results element (see index.html), NOT
        // result__list, because that's an unordered list (ul) element, 
        // not a div.
        renderSpinner(elements.searchResults);

        try
        {
            // 4. Actually search for the recipes.
            await state.search.getResults();

            // 5. Render results on the UI.
            clearSpinner();
            searchView.renderResults(state.search.results);
        }
        catch (error)
        {
            console.log("Error in search!");
            // Even if we have an error, we still want
            // to clear the spinner.
            clearSpinner();
        }
    }
}

// REMEMBER: Event Listeners are something that should be put into the CONTROLLER,
// because that's where we're going to delegate what people want to happen when
// a certain event occurs or a user submits a form

elements.searchForm.addEventListener('submit', event =>
{
    event.preventDefault();

    // We want to keep the functionality of our controllers nice and modular
    // so that we can make corrections and/or pinpoint bugs easily in future
    controlSearch();
});


// We need to make the event handlers for the Page buttons, but
// we've got a problem: the page buttons aren't on the UI by default;
// they appear only once a search has been performed, and only when necessary
// (when there are more results than the allotted results per page)

// So what do we do? We have to use EVENT DELEGATION again, i.e. we have
// to attach event listener(s) to elements that ARE already on the page
// by default and then try to figure out where our click actually happened
// so we can handle the event we actually want to handle.

elements.searchResPages.addEventListener('click', event =>
{
    // There are actually multiple different "elements" related
    // to the buttons for the next and previous pages; how do
    // we tell JavaScript that we want to go to the next/previous
    // page irrespective of where exactly on the next/prev button the
    // user clicks?

    // JavaScript provides the method closest(), which works on all DOM elements
    // and returns the closest ancestor of the current element (or the current element itself)
    // which matches the selectors given in parameter. If no such ancestor exists, the method
    // returns null.
    const button = event.target.closest('.btn-inline');
    
    if (button)
    {
        // We need to know what page we're going to.
        // We can read this from the HTML data element
        // we put onto the buttons in renderButton().
        // We use dataset.goto to read this particular
        // value.
        const goToPage = parseInt(button.dataset.goto, 10);

        // We're going to display the results corresponding
        // to a different page, so clear the display!
        searchView.clearResults();

        // Display the results that correspond to the page 
        // we want to display.
        searchView.renderResults(state.search.results, goToPage);
    }
});

/* RECIPE CONTROLLER */

//const recipe = new Recipe(559251);
//recipe.getRecipe();
//console.log(recipe);

// The actual recipe controller method
const controlRecipe = async () =>
{
    // Let's actually get the hash from the url.
    
    // window.location refers to the ENTIRE URL.
    // If we use the .hash property of window.location,
    // we get the hash.

    // Let's remove the hash symbol, since all we want is the ID.
    const id = window.location.hash.replace('#', '');
    console.log(id);

    // Now let's check whether we have an ID
    if (id)
    {
        // Prepare UI for changes

        // Clear the currently displayed
        // recipe
        recipeView.clearRecipe();

        // Remember we need to pass in the parent element
        // so that the spinner knows where it has to appear
        renderSpinner(elements.recipe);

        // Highlight the selected recipe
        // but ONLY if a search has been conducted
        if (state.search) searchView.highlightSelected(id);

        // Create new Recipe object
        state.recipe = new Recipe(id);

        try
        {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();

            // ******************************************
            // NOTE THAT THE FUNCTION BELOW CAN'T BE USED
            // IF YOU'RE USING THE SPOONACULAR API.
            // THIS IS BECAUSE SPOONACULAR'S ingredients
            // ARRAY FOR RECIPES IS STRUCTURED DIFFERENTLY
            // FROM THE food2fork ONE THAT THE LECTURER USES.
            // JUST IGNORE IT!
            // THE MEASURES AND SUCH ARE ALREADY PARSED
            // IN THE SPOONACULAR API ANYWAY!

            //state.recipe.parseIngredients();

            // *******************************************

            // Render the recipe
            console.log(state.recipe);
            
            // As before, we clear the spinner before actually
            // displaying the recipe
            clearSpinner();

            // Use renderRecipe() to show the recipe
            recipeView.renderRecipe(state.recipe);
        }
        catch (error)
        {
            alert("Error processing recipe!");
        }
    }
};

// We're going to add an event listener to the global object in JavaScript, which
// is the browser. We use the variable called window to refer to the global object.
//window.addEventListener('hashchange', controlRecipe);

// We need an event listener for the load event so that pages get loaded
// properly WITHOUT hash changes (suppose a user saves a page to his bookmarks
// and then tries to load it later; nothing would show up on the app, because
// the way we had it set up, recipes only showed on hash changes!)
//window.addEventListener('load', controlRecipe);

// It's actually possible to append MULTIPLE EVENTS to the SAME EVENT LISTENER
// using only ONE LINE OF CODE!
// The way you do it is you simply create an array containing the strings that
// correspond all the events you want the event listener to listen for, and call
// the forEach() function on that array as follows:
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener('click', event =>
{
    // We can't use the closest() method for this event handler
    // because there are several elements that may be considered
    // as "closest" to the recipe element (the increase button, decrease button,
    // like button, etc..)

    // Instead we will use the matches() method to test exactly which
    // button was pressed.
    // Note that the * next to an element in CSS means "that element or
    // any of its children"

    // We'll handle decreases first. Before we do anything, we 
    // have to make sure the current servings value is greater
    // than 1 (can't have 0 or less servings of a dish, doesn't make sense)
    if (event.target.matches('.btn-decrease, .btn-decrease *'))
    {
        if (state.recipe.servings > 1)
        {
            // Decrease button is clicked
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if (event.target.matches('.btn-increase, .btn-increase *'))
    {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    console.log(state.recipe);
});