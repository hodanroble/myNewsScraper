const express = require("express");
const expHndlBar = require("express-handlebars")
const mongoose = require("mongoose");
const bodPar = require("body-parser");
const cheerio = require("cheerio");
const request = require("request"); 
const logger = require("morgan");

const db = require ("./models");
//remember to insure that all of the applications of modles needs  ****
// import db from "./models";

//set the port to link up to.
const PORT = 3000;

//initialize our Express
let app = express();

//log request utilizing morgan logger
app.use(logger("dev"));
// app.use(express.static(__dirname + "/public"));
//utilize the body-parser to manage the form submissions
app.use(bodPar.urlencoded({ extended: true }));
//Serve my public folder it's informatoin for the static directory

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, {
    useMongoClient: true
});

// A GET route for scraping the Reddit-C# website
app.get("/scrape", function(req, res) {
    http: //www.echojs.com/
        request.get("https://www.reddit.com/r/csharp/").then(function(response) {
        let $ = cheerio.load(response.data);

        //get every a.title header
        $("p .title").each(function(i, element) {
            let result = {};

            //the following should grab the child material of the above to get the text & href link
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");

            //Call the DB and create a new article using the result from the built scrape
            db.Article.create(result)
                .then(function(dbArticles) {
                    //view the added resulting information in the console for verification
                    console.log(dbArticles); 
                })
                .catch(function(err) {
                    //if there happens to be an error send it back out to the viewer.
                    return res.json(err);
                });
        });
        //if the creation was successful then let the info be known
        res.send("Scrape Complete!");
    });
});

//Create the route for grabbing all the articles in the DB
app.get("/articles", function(req, res) {
    db.Article.find({})
    .then(function(dbArticles) {
        //If the articles are able to be found, send it out to the user.
        res.json(dbArticles);
    })
    //If there is an error catch it and kick it out to the viewer.
    .catch(function(err) {
        res.json(err);
    });
});

//locate any articles by it's specified ID and populate it with a note
app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
    //generate all notes associated with the ID entered.
    .populate("note")
    .then(function(dbArticle) {
        res.json(dbArticle);
    })
    //once again catch any thrown errors and kick them back out to the user.
    .catch(function(err) {
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.listen(PORT, function() {
    console.log("App is running on port " + PORT + "!");
});