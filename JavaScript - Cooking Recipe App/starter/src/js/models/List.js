// This will model a Shopping List.

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
    // to the shopping list. Items have amounts,
    // unit of measurement, and a name.
    addItem(amount, unit, name)
    {
        const item = 
        {
            amount,
            unit,
            name
        }
    }
}