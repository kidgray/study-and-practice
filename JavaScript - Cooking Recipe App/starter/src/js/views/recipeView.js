// Import DOM object list
import { elements } from './base';

import { Fraction } from 'fractional';

const formatCount = count =>
{
    if (count)
    {
        // Example: 2.5 --> 2 1/2

        // Remember DESTRUCTURING allows you to declare two variables at once!
        // The ... operator is called the SPREAD OPERATOR.

        // We destructure and declare two variables at once: int and dec, for the
        // whole and decimal parts of the count, respectively. We assign the parts
        // to the proper variable using split() and then use map() to parse them to
        // integers (remember they start out as strings).
        const [int, dec] = count.toString().split('.').map(element => parseInt(element, 10));

        // If there's no decimal portion to the number, we simply return the count
        if (!dec) return count;

        // If the integer part of the number is zero
        if (int === 0)
        {
            const fraction = new Fraction(count);
            return `${fraction.numerator}/${fraction.denominator}`;
        }
        else
        {
            const fraction = new Fraction(count - int);
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
export const renderRecipe = recipe =>
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
                    <button class="btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart-outlined"></use>
                </svg>
            </button>
        </div>



        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(element => createIngredient(element)).join('')}

                <li class="recipe__item">
                    <svg class="recipe__icon">
                        <use href="img/icons.svg#icon-check"></use>
                    </svg>
                    <div class="recipe__count">1000</div>
                    <div class="recipe__ingredient">
                        <span class="recipe__unit">g</span>
                        pasta
                    </div>
                </li>

            <button class="btn-small recipe__btn">
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