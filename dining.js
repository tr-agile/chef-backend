
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

app.use(cors());
app.use(express.json())

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD

});

// The "/dining/" referred to below and is stated in the "!serverless.yml file", it
//  is the name of the function that is called towards the end of the endpoint
//  it is used to get the data u need) from the database; it will change as you 
// add parameters e.g. date, cuisine or category. See below for examples.


// Test scenario this just checks that you can see the details for all current menus
app.get("/dining", function (request, response) {
    // alt z will line wrap your code
    let query = "SELECT MENU.menuId, MENU.chefId, CHEF.chefName, MENU.menuMeals, MENU.menuCuisine FROM MENU JOIN CHEF ON MENU.chefId=CHEF.chefId";
    connection.query(query, (err, queryResults) => {
        if (err) {
            console.log("Error fetching menus", err);
            response.status(500).json({
                error: err
            });
        } else {
            response.json({
                dining: queryResults
            });
        }
    });
});

app.get("/dining/:date", function (request, response) {
    // the code below works to bring back the chefs not booked on a particular date
    const query =
        // the ? is a placeholder for the value you need, this is then used in the [diningDate] thiing below. If you want to add more things to look at use 
        "SELECT MENU.menuId, MENU.chefId, CHEF.chefName, MENU.typeId, TYPE.typeCategory, MENU.menuCuisine, MENU.menuImageFPath, TYPE.typePricePerGuest FROM MENU JOIN TYPE ON MENU.typeId=TYPE.typeId JOIN CHEF ON MENU.chefId=CHEF.chefId WHERE MENU.chefId<>(SELECT chefid FROM BOOKING WHERE bookingDate=?)";

    const diningDate = request.params.date;

    connection.query(query, [diningDate], (err, queryResults) => {
        if (err) {
            console.log("Error fetching menus", err);
            response.status(500).json({
                error: err
            });
        } else {
            response.json({
                dining: queryResults
            });
        }
    });
});
app.get("/menu/:cuisine", function (request, response) {
    // test query to see what happens with multiple search parameters; remember you will one ? plus one associated array in the connection.query() etc see above for example to hold values
    // you have to remember to change the GET path on your serverless.yml file if you want to add a new parameter search.
    const query =
        // the ? is a placeholder for the value you need, this is then used in the [diningDate] thiing below. If you want to add more things to look at use 
        "SELECT MENU.menuId, MENU.chefId, CHEF.chefName, MENU.menuCuisine FROM MENU JOIN CHEF ON MENU.chefId=CHEF.chefId WHERE MENU.menuCuisine=?";

    const cuisineCheck = request.params.cuisine;

    connection.query(query, [cuisineCheck], (err, queryResults) => {
        if (err) {
            console.log("Error fetching menus", err);
            response.status(500).json({
                error: err
            });
        } else {
            response.json({
                dining: queryResults
            });
        }
    });
});

 
// app.delete("/tasks/:id", function(request, response) {
//     const query =
//       "DELETE FROM Task WHERE TaskId = " + connection.escape(request.params.id);
//     connection.query(query, (err, deleteResults) => {
//       if (err) {
//         console.log("Error deleting Task", err);
//         response.status(500).json({
//           error: err
//         });
//       } else {
//         response.status(200).send("Task deleted");
//       }
//     });
//   });

// const date = [
//     {
//         bookingDate: '2019-01-01'
//     }
// ]

//Example of how to update a table from the ToDoApp 
// app.put("/tasks/:id", function (request, response) {
//     // these variables are filled with data from the front end and then passed into the SQL below for the dbase
//     const taskId = request.params.id;
//     const updatedDesc = request.body.description;
//     const updatedComp = request.body.completed;
//     console.log(taskId, updatedDesc, updatedComp);
//     connection.query("UPDATE Task SET description = ?, completed = ? WHERE taskId = ?", [updatedDesc, updatedComp, taskId], function (err, result, fields) {
//       // you should always have a response to the user so they can see what's going on
//       if (err !== null) {
//         console.log("Something went wrong", err);
//         response.send(500);
//       } else {
//         response.send("Completed");
//       };
//     });
//   });

module.exports.handler = serverless(app);

