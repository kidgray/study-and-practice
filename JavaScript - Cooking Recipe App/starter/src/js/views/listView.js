// Import list of pre-selected DOM elements
import { elements } from './base';

// We just need two simple methods: one to render an item
// and one to delete it from the UI.

export const renderItem = item =>
{
    // As usual, we need HTML to render,
    // so we create a variable to store it
    const markup =
    `
        <li class="shopping__item" data-itemid=${item.id}>
            <div class="shopping__count">
                <input type="number" value="${item.amount}" step="${item.amount}" class="shopping__count-value">
                <p>${item.unit}</p>
            </div>
            <p class="shopping__description">${item.name}</p>
            <button class="shopping__delete btn-tiny">
                <svg>
                    <use href="img/icons.svg#icon-circle-with-cross"></use>
                </svg>
            </button>
        </li>
    `;

    // Insert our formatted HTML into the UI. Recall that beforeend makes it so items
    // get inserted at the "end" of the list.
    elements.shoppingList.insertAdjacentHTML('beforeend', markup);
};

// Remove an item from the list in the UI
export const deleteItem = id =>
{
    // We need to select the element we want to delete
    const item = document.querySelector(`[data-itemid="${id}"]`);

    // Use the typical methodology for removing elements from the
    // UI: select the desired element's parent and use the removeChild()
    // method on the element you want to delete.
    if (item) item.parentElement.removeChild(item);
};