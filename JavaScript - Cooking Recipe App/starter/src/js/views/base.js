// It's best for us to have a central object that contains all the elements
// we will ever want to select from our DOM. We can then export that to
// our other files.

export const elements = 
{
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResults: document.querySelector('.results'),
    searchResultList: document.querySelector('.results__list'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe')
};

// We can't make a querySelector property for the spinner
// to put in the elements object above because it doesn't
// exist on the page by default (only appears when a search is conducted),
// so what we're going to do instead is put its class name in this object
// to give us increased modularity.

// This way if we ever change the loader (spinner) name in the CSS
// for some reason, we can just update the name in this object's 
// loader property and that'll automatically change the name everywhere
// the class name is needed
export const elementStrings = 
{
    loader: 'loader'
};

// We need to export the function that renders the Loader (spinner).

// Note that the "parent" parameter refers to the PARENT ELEMENT. Why do we need this?
// Simple: we're going to attach the spinner as a child element of the parent element 
// (which in our case will be things like the result list and main column)
export const renderSpinner = parent =>
{
    // This is the actual HTML that represents
    // the spinner. The "loader" class is from
    // the CSS file in the dist folder.
    const loader = 
    `
        <div class="${elementStrings.loader}"> 
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg> 
        </div>
    `;

    // Now we just use the insertAdjacentHTML() method on the
    // parent element so we can add the spinner.
    parent.insertAdjacentHTML('afterbegin', loader);
};

// Method used to clear a loader after we've finished
// rendering the results of a search
export const clearSpinner = () =>
{
    // We have to do this call to querySelector()
    // right in this method, unlike the other DOM elements
    // that we pre-selected and put in the elements
    // object above.

    // The reason for this is that the spinner isn't
    // actually on the page by default; it only appears
    // when a search is performed, thus it can't be selected
    // until a search has actually happened.
    const loader = document.querySelector(`.${elementStrings.loader}`);

    // Now we can check if there's a spinner on the page.
    if (loader) 
    {
        // If there is, we go up to its parent element
        // and remove the child that corresponds to the
        // spinner element.

        // Recall that this is the way that removing elements
        // works on the DOM. We always do it in this "relative"
        // way. We move up to the parent element of the element
        // we want to delete, then we call removeChild() on the
        // variable that corresponds to the element we want to delete.
        loader.parentElement.removeChild(loader);
    }
};