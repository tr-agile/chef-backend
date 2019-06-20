
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json())

app.get("/chefs", function (request, response) {

    const chefs = [
        {
            chefName: "The Colonel",
            location: "Kentucky"
        }
    ]

    response.json({ chefs: chefs });
});

module.exports.handler = serverless(app);

