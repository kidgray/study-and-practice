// First we need to import our DOM elements from
// the base.js file.
import { elements } from './base';

// This is the view for the Search model. Here we will define a number of methods
// to read input data relating to searches from the UI.

// We will export those methods using the NAMED EXPORTS system.


// ===== READ INPUT FROM THE SEARCH BAR =====
// First we'll be defining a method that will read the input from the
// input form (search bar).
export const getInput = () => elements.searchInput.value;

// ===== PRINT RESULTS OF SEARCH TO THE LEFT-HAND COLUMN OF THE APP =====
// Now we need to display the results on the UI.

// This auxiliary method will display a single recipe on the UI.

const renderRecipe = recipe =>
{
    // We can use template strings to represent
    // HTML exactly as it looks on HTML files.
    // This is much easier than doing what we did
    // with the budget app.
    const markup = 
    `
        <li>
        <a class="results__link" href="#${recipe.id}">
            <figure class="results__fig">
                <img src="https://spoonacular.com/recipeImages/${recipe.id}-{480x360}.jpg" alt="${limitRecipeTitle(recipe.title)}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="cooking__time">Cooking Time: ${recipe.readyInMinutes} mins</p>
            </div>
        </a>
        </li>
    `;

    // Now that we have our template string, where do we want to render it?
    // Into the result list, of course. 
    // For this, we will use the insertAdjacentHTML() method we used before.
    // Recall that when we insert a new element into a list, we want to put it
    // at the END of the list, so the location we will be using is
    // 'beforeend'.
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
};

// This will be used to clear the search bar after each
// search
export const clearInput = () => 
{
    elements.searchInput.value = '';
};

// This function will be used to clear the results before
// displaying the results of each new search.
export const clearResults = () =>
{
    // To remove all HTML inside of an element,
    // we can simply set the innerHTML property of the
    // element to be the empty string ('').
    
    // In this case, this will delete all the list elements
    // that are in this HTML element (hence clearing the list.)
    elements.searchResultList.innerHTML = '';

    // We also want to clear the page buttons from the UI at
    // this point, so we can use the same methodology as we
    // used above to delete the search result list.
    elements.searchResPages.innerHTML = '';
};

// We need a method that will highlight the recipe
// we have selected.
export const highlightSelected = id =>
{
    // Before we highlight any element, we have to make sure
    // we remove the highlight from any element that already has it
    // (so that we only have one element highlighted at any given time)
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));

    resultsArr.forEach(element =>
        {
            element.classList.remove('results__link--active');
        });

    // We obviously can't put this in base.js
    // because search results don't appear unless
    // a search has actually been conducted, so we
    // have to do it here
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
}

// We can use this function to limit the length of
// the title of a recipe in our UI.
export const limitRecipeTitle = (title, limit = 17) =>
{
            // We'll use this variable to store our
            // new title for the recipe.

            // INTERESTING NOTE: This array variable we're
            // declaring is empty, but we're declaring it
            // as a constant. How is that possible, when
            // we need to add the words of the title to
            // the array (which should be a mutation)?

            // Simple: IN JAVASCRIPT, ADDING ELEMENTS TO
            // AN ARRAY DOESN'T COUNT AS MUTATING THE ARRAY
            // VARIABLE ITSELF.
            //
            // A similar principle holds for objects. Properties
            // and methods can be added to them, even if they're
            // declared as "constants".
            const newTitle = [];

    // First we need to test if the title of the
    // recipe is longer than the limit.
    if (title.length > limit)
    {
        // We'll split up our title into individual
        // words, then use the reduce() method, which
        // provides an accumulator variable, to put
        // the title back together piecewise and count
        // the number of letters in each iteration.
        
        // Each iteration, if we're below the limit,
        // we continue appending the next word. If we
        // exceed the limit, we simply return the 
        // title as it is.
        title.split(' ').reduce((acc, current) => 
        {
            if (acc + current.length <= limit)
            {
                newTitle.push(current);
            }

            // To update the accumulator in the Reduce function,
            // we simply return a value from its body.
            //
            // The value that we return in each iteration of the callback function
            // of the reduce() method will be treated as the accumulator value
            // for the next iteration of the reduce() method.
            return acc + current.length;
        }, 0);

        // At this point our newTitle array holds all the words that
        // will go into our new array, so we need to make a string
        // (the new title) from those words and return it.

        // To do this, we use the join() method of the String class,
        // which does the opposite of what the split() method does:
        // it creates a string from all the elements of an array, separating
        // the elements with the specified delimiter (the argument to the join() method)
        return `${newTitle.join(' ')} ...`;
    }
    
    // If not, just return the title
    return title;
};

// This function will be in charge
// of creating the "next page" and
// "previous page" buttons for the
// pages.
// "Type" refers to what type of button
// this is (previous page or next page button)
// type: 'prev' or 'next'
const createButton = (page, type) => 
`
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

// We need a function that will display the PAGE buttons
// on the app.
const renderButtons = (page, numResults, resPerPage) =>
{
    // We need to know how many pages we have total.
    // To calculate this, we divide the total number
    // of results we have by the number of results
    // we display per page.

    // Note that we round this up using Math.ceil()
    // so that we always have enough pages to accomodate
    // results that aren't whole numbers (i.e. if we
    // have 45 results in total but display 10 results per
    // page, that's 4.5 pages, which doesn't make sense, so
    // we ceil() that up to 5 pages, such that the last
    // page will have 5 results).
    const pages = Math.ceil(numResults / resPerPage);

    // Here we declare the button variable that
    // we will use to store the HTML for the previous
    // and next buttons. Remember, since ES6's
    // variables (declared w/ let and const keywords)
    // are BLOCK-SCOPED, we can't declare this inside
    // our if blocks, so we declare it out here instead.
    let button;

    // Now we need to take care of all the possible combinations
    // of buttons we need to display.
    if (page === 1 && pages > 1)
    {
        // If we're on the first page and there's more than one page, 
        // we should only display a "Next page"
        // button, since there are no previous pages.
        button = createButton(page, 'next');
    }
    else if (page < pages)
    {
        // Here we need both a next page
        // and previous page button. To get these,
        // we create a template string that contains
        // the result of calling the createButton() function
        // with both the prev and next parameters (recall that
        // createButton() just returns HTML, so this makes a string)
        button = 
        `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
    else if (page === pages)
    {
        // If we're on the last page,
        // we should only display a 
        // "Previous page" button, since
        // there are no "next pages".
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}

export const renderResults = (results, page = 1, resPerPage = 10) =>
{
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    // We want to implement PAGINATION in our app, so we
    // only want to display so many results per page.
    // What we're going to do is take our results array
    // and split it based on the start and end variables
    // above. 

    // Here, results is an array that contains all of the recipes.
    // What we want to do is display each of these to the UI.
    // The best way to do this is to write a helper method that 
    // displays a SINGLE recipe to the UI, then use the forEach()
    // method to apply that helper method to all the elements of our
    // results array.

    // Note that we don't need to use an array function to 
    // apply the renderRecipe function to the current element
    // of the results array. We can just write the name of the
    // callback function as the argument to forEach, and the
    // compiler will automatically apply the function to the
    // current element.
    results.slice(start, end).forEach(renderRecipe);

    // Render the pagination buttons
    renderButtons(page, results.length, resPerPage);
};