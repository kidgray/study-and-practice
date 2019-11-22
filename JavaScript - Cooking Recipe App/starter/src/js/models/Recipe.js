// Once again, we will use Axios to handle our AJAX calls
import axios from 'axios';

// Import the API key for Spoonacular
import key from '../config';

// This is the Recipe class that will store all
// the data relevant to our recipes (primarily IDs for now)
export default class Recipe 
{
    // Constructor method
    constructor(id)
    {
        this.id = id;
    }

    // Each recipe is identified by its ID,
    // which we can later make an AJAX call
    // based on that ID to get the rest
    // of the data related to the recipe.

    // This asynchronous method will make that AJAX call.
    async getRecipe()
    {
        try
        {
            // Here we are making our AJAX call using Axios.
            // We once again need our API key for this. Since
            // we're using the key in multiple places (here and in Search.js)
            // we should store the API key in a separate configuration .js file and import it
            // into our javascript models, that way if our API key ever changes
            // we can just change it in that file and it'll automatically change it in our
            // model files as well.
            
            const result = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}`);

            // Now we need to save all of the information about the recipe
            // as properties of the new Recipe object's properties.

            // The recipe's title.
            this.title = result.data.title;

            // The recipe's "publisher"/author
            this.author = result.data.sourceName;

            // The image that corresponds to the Recipe
            this.img = result.data.image;

            // The URL of the source of the Recipe (i.e. author's url)
            this.url = result.data.sourceUrl;

            // Ingredients used to make the recipe.
            this.ingredients = result.data.extendedIngredients;

            // Amount of time the recipe takes to cook
            this.cookingTime = result.data.readyInMinutes;

            // Number of servings the recipe makes
            this.servings = result.data.servings;
        }
        catch (error)
        {
            console.log(error);
        }
    }

    // This function will be used to standardize the
    // ingredient measurements across all recipes
    parseIngredients()
    {
        // We need two arrays of unit measures: one representing
        // the measurements as they appear in the results, and 
        // another representing the measurements as we want them
        // to be.
        //
        // These two arrays should be the same length. For each array, the
        // value at index position [x] corresponds to the value at that
        // same index position in the other array. It's basically a dictionary,
        // but the lecturer decided to use TWO arrays instead of just a hashmap
        // for whatever reason.
        const unitsLong = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce',
                                'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'cup', 'pound'];

        // Here we can create a megaarray of units by destructuring
        // w/ unitsShort
        const units = [...unitsShort, 'kg', 'g'];

        // New array of ingredients that will have the standardized
        // units of measurement

        // We populate this array by using the map()
        // method, which will allow us to loop over
        // the original ingredients array and add 
        // each modified element to the newIngredients array
        // (we'll do this in the callback method)
        const newIngredients = this.ingredients.map(element =>
            {
                // 1. Make units uniform

                // For this step, we first take our current
                // ingedient string and make it all lowercase
                // (so that we don't have to include uppercase strings in our
                // conversion arrays above)
                let ingredient = element.toLowerCase();

                // Now we need to loop over the unitsLong array
                // and check whether any of those elements occur
                // in our ingredient string.
                unitsLong.forEach((unit, index) => 
                {
                    // Here, 'unit' refers to the current unit element
                    // in ingredient array (i.e. 'tablespoons', ...).
                    // If we find any of these elements in our ingredient
                    // string, we replace it by the unit measure we actually want
                    // to use (the ones in unitsShort).
                    ingredient = ingredient.replace(unit, unitsShort[index]);
                })

                // 2. Remove parentheses around units (if present)
                ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

                // 3. Parse the ingredient into count, unit, and the
                // material itself (i.e. 4 cups of mushrooms -> [4, cups, mushrooms])

                // To do this, we first need to test whether there's actually a unit
                // in the ingredient string (some don't have it), and if there is,
                // where it's located.

                // We want to test each word of the string, so let's convert it
                // into an array by using the split() method and specifying
                // empty spaces as delimiters on which to split the string.
                // This will leave us with an array comprised of the individual
                // words of the string.
                const arrIng = ingredient.split(' ');

                // We need to use findIndex(), an ES6 method.
                // Recall that findIndex() takes a callback function
                // as an argument. The callback function should provide
                // a logical test that specifies what element we're looking for
                // (in this case, we say that we want the index of the element
                // that is present in the unitsShort array). Note that we also
                // use includes(), an ESNext method.
                const unitIndex = arrIng.findIndex(ele => units.includes(ele));


                let objIngredient;

                // findIndex() returns the index of the element that passes the 
                // test specified by the callback function. If no such element
                // is found (in our case, if there is no unit), it returns -1.
                if (unitIndex > -1)
                {
                    // There is a unit

                    // The "number" part of the ingredient, the one indicating
                    // how many of the unit we need (i.e. 4 1/2 CUPS of ...),
                    // is defined as "everything that comes before the unit itself"
                    // in the string
                    const arrayCount = arrIng.slice(0, unitIndex); // EX. 4 1/2 cups, arrCount = [4, 1/2]

                    // We'll store the actual number in this variable
                    let count;

                    // If the arrayCount has only one element, then the
                    // actual number of the unit is just that one element
                    if (arrayCount.length === 1)
                    {
                        count = eval(arrIng[0].replace('-', '+'));
                    }
                    // Assuming we have a number like 4 1/2 or what have you,
                    // we have to do it differently.
                    else
                    {
                        // In this case, we need to join every part of the string
                        // related to the number, join them, and do something
                        // called "evaluating the string".
                        
                        // To evaluate the string, we use the eval() function.
                        // What eval() does is evaluate the string that is passed
                        // to it as if it were a line of JavaScript code. So, for example,
                        
                        // eval('4+1/2') ---> 4.5
                        count = eval(arrIng.slice(0, unitIndex).join('+'));
                    }

                    objIngredient =
                    {
                        count,
                        unit: arrIng[unitIndex],
                        ingredient: arrIng.slice(unitIndex + 1).join(' ')
                    };
                }
                else if (parseInt(arrIng[0], 10))
                {
                    // There is NO unit, BUT
                    // the first element is a number
                    objIngredient =
                    {
                        count: parseInt(arrIng[0], 10),
                        unit: '',
                        ingredient: arrIng.slice(1).join(' ')
                    };
                }
                else if (unitIndex === -1)
                {
                    // There is NO unit and NO number
                    // in 1st position

                    // Note that we can use the variable
                    // "ingredient" and define it as a
                    // property of the objIngredient object
                    // by simply writing the name of the variable
                    // (ingredient) into the object. Note that we
                    // DON'T use assignment notation (the : after the var name)
                    // when we want to do this. This is an ES6 feature.
                    objIngredient =
                    {
                        count: 1,
                        unit: '',
                        ingredient 
                    };
                }
                return objIngredient;
            });

        this.ingredients = newIngredients;
    }
}