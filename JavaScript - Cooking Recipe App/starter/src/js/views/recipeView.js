// Import DOM object list
import { elements } from './base';

import { Fraction } from 'fractional';

const formatCount = count =>
{
    if (count)
    {
        // Example: 2.5 --> 2 1/2

        // Round the numbers we get
        // so we don't have any problems
        // when using the Fraction() method

        // Math.round normally returns only integer values, but
        // there's a work around for that. You can simply pass
        // in the value

        // (num * 10^n) / 10^n

        // Where n is the number of decimal places you want
        // in your rounded number. This will return a float
        // value.
        const newCount = Math.round((count * 10000) / 10000);

        // Remember DESTRUCTURING allows you to declare two variables at once!
        // The ... operator is called the SPREAD OPERATOR.

        // We destructure and declare two variables at once: int and dec, for the
        // whole and decimal parts of the count, respectively. We assign the parts
        // to the proper variable using split() and then use map() to parse them to
        // integers (remember they start out as strings).
        const [int, dec] = newCount.toString().split('.').map(element => parseInt(element, 10));

        // If there's no decimal portion to the number, we simply return the count
        if (!dec) return newCount;

        // If the integer part of the number is zero
        if (int === 0)
        {
            const fraction = new Fraction(newCount);
            return `${fraction.numerator}/${fraction.denominator}`;
        }
        else
        {
            const fraction = new Fraction(newCount - int);
            return `${int} ${fraction.numerator}/${fraction.denominator}`;
        }
    }

    return '?';
}

// We'll use this function to clear a recipe
// from the page prior to loading a new one.
export const clearRecipe = () =>
{
    // Again, we clear the stuff that's on the screen
    // by simply setting the innerHTML property
    // of the desired element to the empty string ''
    elements.recipe.innerHTML = '';
};

// We'll need this function to render individual
// ingredients. No need to export it since
// we'll be using it in the markup as an auxiliary
// to renderRecipe.
const createIngredient = ingredient =>
`
<li class="recipe__item">
    <svg class="recipe__icon">
        <use href="img/icons.svg#icon-check"></use>
    </svg>
    <div class="recipe__count">${formatCount(ingredient.amount)}</div>
    <div class="recipe__ingredient">
        <span class="recipe__unit">${ingredient.unit}</span>
        ${ingredient.name}
    </div>
</li>
`;

// Of course, as per usual, the most important function
// we want to export here is the one that actually renders
// our recipe on the UI
export const renderRecipe = (recipe, isLiked) =>
{
    // The HTML markup that we want to render
    const markup = 
    `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.cookingTime}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? "" : "-outlined"}"></use>
                </svg>
            </button>
        </div>



        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(element => createIngredient(element)).join('')}

            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;

    // Now we actually render our HTML by using insertAdjacentHTML()
    // on the recipe element (check index.html), which we pre-selected
    // as the "recipe" element in base.js
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

// We'll use this method to update the servings/ingredient amount
// values displayed on the actual UI.
export const updateServingsIngredients = recipe =>
{
    // Update servings
    
    // We of course can't have this in base.js
    // since the servings value isn't displayed until
    // we've actually selected a recipe.
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    // Update ingredient amounts

    // We need to select all of the current recipe's ingredients from the UI
    // To do this, we'll use querySelectorAll() to select all elements of the recipe__count
    // class, which is the class of each ingredient element (see createIngredient() above)
    
    // Recall that querySelectorAll() returns a NODELIST, which we can transform
    // into an array using Array.from() (ES6 method).

    const ingredientElements = Array.from(document.querySelectorAll('.recipe__count'));

    // Now we iterate through our new array of ingredients using forEach
    ingredientElements.forEach((current, index) =>
    {
        current.textContent = formatCount(recipe.ingredients[index].amount);
    });

}