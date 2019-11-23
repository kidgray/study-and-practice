// Import DOM elements from base.js
import { elements } from './base';

// Import the limitRecipeTitle function from the
// searchView file
import { limitRecipeTitle } from './searchView';

// A function that toggles
// the Like button
export const toggleLikeBtn = isLiked =>
{
    // We'll use this in the template string that determines
    // whether to turn the Like button on or off. If it's
    // liked, then we turn it on; otherwise, we turn it off
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    // Select the element that represents the Like button. Note that
    // we have to specify that we want to select the use element of the recipe-love
    // element class.

    // We can use the setAttribute() function to change the value of an element's
    // attribute. Here we use it to change the href attribute of the use element.
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
}; 

// A function that toggles the
// Likes menu
export const toggleLikeMenu = numLikes =>
{
    // We can use the style property to manipulate
    // a single style in CSS.
    // If there were many styles we wanted to apply,
    // it would be best to define a class in CSS
    // and toggle it on/off here using JavaScript,
    // but we only need to manipulate visibility, so
    // this is fine.

    // If the number of liked recipes is greater than 0,
    // then the icon should be visible; otherwise, hide it
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

// Display Liked recipes in the Likes Menu
export const renderLike = like =>
{
    const markup = 
    `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
    `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id =>
{
    // We need to select the element
    // we want to delete.

    // We do this using special CSS selector syntax.
    // Review this!
    const element = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;

    // If we successfully selected the element, select its parent
    // element and use the removeChild() method to remove the element
    // we want to delete.
    if (element) element.parentElement.removeChild(element);
};