// This file will model a Shopping List.

// We'll be using the uniqid library to
// create unique IDs for our list items.
import uniqid from 'uniqid';

export default class List
{
    // No need for any parameters here. Every List
    // has an array property that will store the
    // actual list items.
    constructor()
    {
        this.items = [];
    }

    // This method will be used to add items
    // to the shopping list. Items have 
    // a unique ID (created with uniqid library),
    // amounts, unit of measurement, and a name.
    addItem(amount, unit, name)
    {
        const item = 
        {
            id: uniqid(),
            amount,
            unit,
            name
        }

        // Actually add the item we created to the items
        // array
        this.items.push(item);

        // Return the object
        return item;
    }

    // Delete an item from the list
    deleteItem(id)
    {
        // We'll use the splice() method to remove an item from
        // the items property of a List. To use it, we need to know
        // what the index of the item we want to delete is.
        const index = this.items.findIndex(element => element.id === id);

        // Remove the item
        this.items.splice(index, 1);
    }

    updateAmount(id, newAmount)
    {
        // We need to find the element whose amount
        // we want to update. We have its id, so we can
        // just use the find() method, which works just
        // like findIndex() except it returns the ITEM
        // ITSELF, not the index it's located at
        this.items.find(element => element.id === id).amount = newAmount;
    }
}