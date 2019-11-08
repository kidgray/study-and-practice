/*
TO-DO LIST:

[] Add event handler (for button used to add items to lists)
[] Get input values from text boxes
[] Add new item to data structure containing the lists
[] Add new item to the UI
[] Calculate the new budget value
[] Update the UI

*/

// *************************
// APP COMPLETE AND WORKING!
// *************************

/*
--- MODULES ---
Recall that Modules are an excellent way to structure your code in JavaScript (and in general).
MODULES ARE:

- An important aspect of any robust application's architecture
- Used to keep the units of code for a project both cleanly separated and organized.
- Used to allow the encapsulation of some data into privacy and expose other data publicly.
*/

/*
--- MODULE PATTERNS ---
One of the most popular patterns in JavaScript.

Q: WHY DO WE CREATE MODULES?
A: Modules are used TO KEEP PIECES OF CODE THAT ARE RELATED TO ONE ANOTHER TOGETHER
INSIDE OF SEPARATE, INDEPENDENT, AND ORGANIZED UNITS.

In each module, we can have functions and variables that are private, meaning that they are accessible
only from inside the module. The reason we want that is so that NO OTHER CODE CAN OVERRIDE OUR DATA.

Q: WHAT DOES DATA ENCAPSULATION DO FOR US?
A: Data Encapsulation allows us to hide the implementation details of a specific module from the outside scope 
so that we only expose a public interface to it; this exposed public interface is sometimes called an API
(APPLICATION PROGRAMMING INTERFACE)
*/

/*
--- SEPARATION OF CONCERNS ---
Separation of Concerns is a concept that states that each part (module?) of an application
should only be interested in doing one thing independently.
*/

// Let's start with the module that handles our budget data.
// We'll call it budgetController.

// --- HOW TO USE THE MODULE PATTERN ---
// Here's how we write the module pattern. The module is written as a variable
// and is assigned an IIFE that will return an object.

// THE SECRET OF THE MODULE PATTERN is that it returns an object that contains
// all of the functions that we want to be public (i.e. everything that we want
// the external scope to be able to access)

// Note that the reason the code below works is thanks to the POWER OF CLOSURES!
// The budgetController variable contains a reference to an object which in turn contains
// the publicTest function. Note that the IIFE (Immediately Invoked Function Expression) that
// returns the object containing the publicTest function does so IMMEDIATELY - that is, by the
// time the publicTest() is used (presumably at some future time by the outer scope), the add()
// function inside the IIFE, as well as the variable x that the add() function references, are both
// technically "gone", but STILL ACCESSIBLE by the publicTest() function BECAUSE A CLOSURE WAS CREATED
// WHEN THE publicTest() function was created, which means it can always access the variables and
// methods of its outer scope (where the variable x and add() function are located!)

// DATA CONTROLLER
var budgetController = (function()
{
    // We need a data model for expenses and incomes here.
    // According to the instructor of this course, the best
    // thing for this is an OBJECT.

    // Each new item will have a description and a value
    // (we know this from the event listeners we set up)
    // but we also need a way to differentiate between the
    // items, i.e. we need a unique ID value for each item.

    // Since we want to create many objects (not just one)
    // what we need is a function constructor, which will
    // allow us to instantiate objects of the income and expense
    // classes, respectively.

    // Function Constructor for the Expense class
    var Expense = function(id, description, value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome)
    {
        if (totalIncome > 0)
        {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
        else
        {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function()
    {
        return this.percentage;
    }

    // Function Constructor for the Income class
    var Income = function(id, description, value)
    {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // The budget controller keeps track of all incomes, expenses and the budget itself,
    // as well as the "percentages" (of the incomes and expenses) later on in the app's development.
    
    // We'll be using an object to keep track of all our data, since that allows us to aggregate
    // all our data into one place.
    var data = 
    {
        allItems: 
        {
            exp: [],
            inc: []
        },
        totals:
        {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    // Auxiliary method to assist in calculation of total
    // income and expenses
    var calculateTotal = function(type)
    {
        var total = 0;

        // Use the forEach() method of the Array class to
        // calculate the total value of incomes/expenses
        data.allItems[type].forEach(function(current)
        {
            total += current.value;
        });

        // Put the total value of the incomes/expenses in
        // the appropriate property of the totals object
        // inside the data structure
        data.totals[type] = total;
    }

    // We'll now create a public method that can be used by other
    // modules to add items to the data structure we're using to store the lists
    // (expenses and incomes).

    return {
        addItem: function (type, desc, val)
        {
            var newItem;
            var ID = 0;

            // Make sure data arrays aren't empty
            // before we try to use existing ID
            // to calculate new ID
            if (data.allItems[type].length > 0)
            {
                // ID should be the value of the last
                // ID + 1
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else    // If array IS empty, first ID should be 0
            {
                ID = 0;
            }

            // Create an object to represent the new item. Its type will
            // be either 'exp' (expense) or 'inc' (income).
            if (type === 'exp')
            {
                newItem = new Expense(ID, desc, val);
            }
            else if (type === 'inc')
            {
                newItem = new Income(ID, desc, val);
            }

            // Add item to the data structure containing items
            // of the specified type
            data.allItems[type].push(newItem);

            // Return the new item object
            return newItem;
        },
        deleteItem: function(type, id)
        {
            var IDs = data.allItems[type].map(function (current)
            {
                return current.id;
            });

            var index = IDs.indexOf(id);

            if (index !== -1)
            {
                // The splice() method allows us to delete elements from the array;
                // its first argument gives the starting position of the deletion,
                // while the second argument specifies how many elements to delete.
                data.allItems[type].splice(index, 1);
            }
        },
        calculateBudget: function()
        {
            // Calculate total income and expense values
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the budget (income - expenses)
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate percentage of income that was spent
            if (data.totals.inc > 0)
            {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            }
            else
            {
                data.percentage = -1;
            }
        },
        calculatePercentages: function()
        {
            data.allItems['exp'].forEach(function(current)
            {
                current.calculatePercentage(data.totals.inc);
            });
        },
        getPercentages: function()
        {
            var allPercentages = data.allItems['exp'].map(function(current)
            {
                return current.getPercentage();
            });

            return allPercentages;
        },
        getBudget: function()
        {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage

            };
        },
        testing: function()
        {
            console.log(data);
        }
    };
})();

// Now we're going to create the module that will take
// care of the user interface. We'll call it UIController.

// UI CONTROLLER
var UIController = (function()
{
    /*
    --- !!! BEST PRACTICE !!! ---
    REGARDING THE CLASS SELECTOR STRINGS IN THE querySelector() METHOD

    Notice something regarding the querySelector() calls below. Every one
    of them denotes the class we wish to select by using a string literal,
    such as '.add__type' or '.add__description'. THIS IS BAD because if
    we change the names of these classes or something in the future, we
    would have to change these literals EVERYWHERE they occur in our code

    You can easily see how that could get bad if our code turned out to be
    hundreds of thousands of lines long. We can remedy this problem by creating
    an object and storing the string literal class selectors in properties, as 
    seen below.

    --- !!! END OF BEST PRACTICE !!! ---
    */

    // This object will hold the class selector string
    // literals that we will use with the querySelector()
    // method. Note that since it's outside of the return object,
    // it's a PRIVATE method!

    var DOMstrings = 
    {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    var formatNumber = function(num, type)
        {
            var numSplit, int, decimal;
            /*
            1. Must have a + or - before number
            2. Must have exactly 2 decimal points
            3. Must have comma separating the numbers
            */

            num = Math.abs(num);
            num = num.toFixed(2);

            numSplit = num.split('.');

            int = numSplit[0];
            decimal = numSplit[1];

            if (int.length > 3)
            {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
            }

            return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + decimal;
        };

    var nodeListForEach = function(nodeList, callback)
    {
        for (var i = 0; i < nodeList.length; i++)
        {
            callback(nodeList[i], i);
        }
    };

    // In the case of getting the input from
    // the user interface (in this case, the input boxes on the webpage)
    // we will write a method in the UI controller to get the data and
    // then call it in the app controller (the "controller" variable)
    // so that we can get the data and use it further.

    // Because we want to be able to use the aforementioned function
    // in the App Controller, we must make this a PUBLIC method; recall
    // that this means the method must be included in the object that
    // is returned by the IIFE.
    return {
        getInput: function()
        {
            // We need the following attributes from the input:
            // add_type (which denotes whether it's an income or expense)
            // add_description (which tells us the name of the item)
            // add_value (which tells us the amount of the item)

            return {
                type: document.querySelector(DOMstrings.inputType).value, // Value will be either "inc" or "exp"
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
            // We now have our three desired input values stored in the above
            // 3 variables. The App Controller is going to call these methods
            // and expect to receive these three values, so we have to somehow
            // return all of them.

            // What's the best way to return multiple values in this case? My
            // first guess was an array, but it turns out an object that contains
            // these three variables as properties is a better choice.
            
        },
        addListItem: function(obj, type)
        {
            var html, newHtml, element;

            // Create HTML string w/ placeholder text
            if (type === 'inc')
            {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>'
                + '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">'
                + '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else if (type === 'exp')
            {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>'
                + '<div class="right clearfix"><div class="item__value">%value%</div>' 
                + '<div class="item__percentage">21%</div><div class="item__delete">'
                + '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace placeholder text w/ some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
        },
        deleteListItem: function(selectorID)
        {
            // In JavaScript, we can't just "remove" a DOM element. We can
            // only remove an element's children. So when we want to remove
            // an element, we must first select that element, then obtain its
            // parent node, then use the removeChild() method and pass in 
            // the element we actually want to remove.
            var element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        clearFields: function()
        {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array)
            {
                current.value = "";
            });

            // The focus() method puts the focus on the element it is used on
            // ("focus" means it puts the keyboard's cursor there)
            fieldsArr[0].focus();
        },
        displayBudget: function(object)
        {
            object.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(object.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(object.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(object.totalExp, 'exp');

            if (object.percentage > 0)
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = object.percentage + '%';
            }
            else
            {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        displayPercentages: function(percentages)
        {
            // querySelectorAll() returns a nodeList. This is because in the DOM tree
            // (where all HTML elements of a page are stored), each element is called
            // a NODE.
           var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel);

           nodeListForEach(fields, function(current, index)
           {
               if (percentages[index] > 0)
               {
                    current.textContent = percentages[index] + '%';
               }
               else
               {
                   current.textContent = '---';
               }
           });
        },
        displayMonth: function()
        {
            var now, year, month, months;
            now = new Date();

            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
                        'October', 'November', 'December'];

            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changeType: function()
        {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(current)
            {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },
        getDOMstrings: function()
        {
            return DOMstrings;
        }
    };
})();

// The final module we'll need is the app controller, which
// will be the vehicle through which the UIController and
// budgetController (data controller) interface when necessary

// We will simply call the app controller variable "controller".

// Note that IIFEs, and therefore modules, can also receive ARGUMENTS;
// As you might imagine, this is how we're going to get the UI controller
// and budget controller to interact!

// Note that it's a BEST PRACTICE to pass these controllers into the
// app controller rather than just using them (the controllers are
// in the global scope so we could technically reference them
// from inside the app controller without passing in the objects).

// This is because it would reduce the independence of the modules

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl)
{
    // Now we'll add an initialization function to organize
    // our code and make it so we only have functions in
    // the app controller.
    var setupEventListeners = function()
    {
        // Since we need the DOMstrings here in the
        // app controller (for the querySelector() calls),
        // we simply "import" them over from the UIController
        // by using the getDOMstrings() function in the object
        // returned by the module!
        var DOMstrings = UICtrl.getDOMstrings();

        // Here we use the document object along with the dot (.)
        // which is the class selector for the querySelector() function.
        document.querySelector(DOMstrings.inputButton).addEventListener('click', ctrlAddItem);

        // If someone presses the enter key rather than clicking the check mark
        // button, we ALSO want to do all the stuff in the list above, so
        // we need to create an event listener for the keypress event.

        // Note that to make the app listen for a keypress, we need to add an event 
        // listener on the global document (that is, to the document object), rather
        // than what we did before, which was add an event listener to a button (which
        // we selected using the querySelector() method)

        // Note that the keypress event refers to ANY key being pressed (with the exception
        // of Shift, Caps Lock and one other one I can't remember), but we just want it to
        // do something when we press the ENTER key. How to do this?

        // Simple. It turns out that the second argument to the addEventListener() function
        // takes an argument, which is the event argument.
        document.addEventListener('keypress', function(event)
        {
            // We'll now use an if statement to check whether
            // the KeyboardEvent (that's the type of event
            // that a key press is) in question has the key
            // code of 13, which corresponds to the enter key
            // (see lecture video #78 for this)

            // Note that we also use the which property
            // is used by some older browsers, rather than
            // the keyCode property. We can just use a logical
            // or to check for that as well, since it works
            // the same way as the keyCode property.
            if (event.keyCode === 13 || event.which === 13)
            {
                ctrlAddItem();
            }
        });

        document.querySelector(DOMstrings.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOMstrings.inputType).addEventListener('change', UICtrl.changeType);
    };

    var updatePercentages = function()
    {
        // 1. Calculate the percentages
        budgetCtrl.calculatePercentages();

        // 2. Read them from the Budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. Update the UI.
        UICtrl.displayPercentages(percentages);
    };

    // We'll write a new function to calculate the budget and display it on
    // the UI, since they're similar functionalities
    var updateBudget = function()
    {
        // 1. Calculate the budget
        budgetController.calculateBudget();

        // 2. Return the budget
        var budget = budgetController.getBudget();

        // 3. Display the budget
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function()
    {
        // These will store the objects
        // returned by the various functions
        var input, newItem;

        // 1. Get the field input data
        // Here we will use the getInput() function
        // returned by the UIController object.
        input = UICtrl.getInput();

        // Here we do some basic "exception handling", i.e.
        // we make sure the user can't add an item unless
        // they actually enter values in the text fields
        if (input.description !== "" && !isNaN(input.value) && input.value > 0)
        {
            // 2. Add the item to the budget controller
            // Using our newly acquired input,
            // add the new item to the budgetController
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add the new item to the user interface
            UICtrl.addListItem(newItem, input.type);
            
            // 4. Clear the fields
            UICtrl.clearFields();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Calculate and update percentages.
            updatePercentages();
        }
    }; 
    
    // This is the callback function for the event listener used to delete items.
    // Recall that the addEventListener() function always has access to the event
    // object, which is the object that fires the event in question (in this case, a click).
    var ctrlDeleteItem = function(event)
    {
        var itemID, splitID, type, ID;

        // The parentNode property of an element gives you its "parent" element, i.e.
        // the one that is a step higher on the DOM hierarchy. This is how we "traverse"
        // the DOM. The indentation of HTML elements should be an indication of this hierarchy;
        // the further in an element is indented, the lower on the hierarchy it is.
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID)
        {
            // NOTE: When a String method (such as split()) is called on a String,
            // JavaScript automatically wraps the String in a String OBJECT, so
            // despite the fact that Strings are primitives in JavaScript, they
            // are technically "objects" that have their own methods.
            
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show the new budget
            updateBudget();

            // 4. Calculate and update the percentages
            updatePercentages();
        }
    };

    // Now that all our event listeners are together inside of a function,
    // we need some kind of way to invoke that function; up until now, this
    // was done automatically by virtue of this function being a part of an
    // IIFE (Immediately Invoked Function Expression).

    // To call our "set up event listener function", we can use what's called
    // a public Initialization Function, which we will call init.

    // Note the use of the word "public" above: since we want this function
    // to be PUBLIC, we must RETURN this function in an object.

    // Now, our event listeners will be set up when we call the init() function
    // that is returned in the object below.

    return {
        init: function()
        {
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                totalInc: 0,
                totalExp: 0,
                budget: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

// Here, we use the init() function that was returned by the app controller module
// to initialize our event listeners. Without this line of code, NOTHING would ever happen,
// because no event listeners would be set up and as such, none of the app's functionalities
// would work (clicking buttons, entering data, etc would be useless)
controller.init();