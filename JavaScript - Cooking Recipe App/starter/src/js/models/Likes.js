// This model represents the list of recipes a user has liked.
export default class Likes
{
    // Similar to the constructor
    // of the shopping list class.
    constructor()
    {
        this.likes = [];
    };

    // Add a recipe to the list of liked recipes
    addLike(id, title, author, img)
    {
        const like = 
        {
            id,
            title,
            author,
            img
        };

        this.likes.push(like);

        return like;
    };

    // Delete an item from the array of liked recipes
    deleteLike(id)
    {
        // We need the index position of the item
        // with the specified ID
        const index = this.likes.findIndex(element => element.id === id);

        // Remove the element from the likes array using the splice() method
        // and the index we found above.
        this.likes.splice(index, 1);
    };

    // Returns true if the recipe with the specified ID
    // is liked, false otherwise
    isLiked(id)
    {
        // Simply return a true/false based on whether or not
        // we can find the item with the specified ID in the
        // array of liked recipes.

        // To do this, we call findIndex() on the likes array and
        // check whether any elements in the array have the specified ID;
        // if it is, we return true
        // if it isn't, return false
        return this.likes.findIndex(element => element.id === id) !== -1;
    };

    // Returns the number of liked recipes
    getNumLikes()
    {
        return this.likes.length;
    };
}