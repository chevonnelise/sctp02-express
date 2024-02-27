// 1. SETUP 
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

const app = express(); // create an express application
app.set('view engine', 'hbs'); // set express to use hbs as our view engine

// setup wax on 
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable form processing
app.use(express.urlencoded({
    extended: false
}))

// In-memory database
const foodRecords = [
    {
        id: 1,
        foodName: "Chicken Rice",
        calories: 500,
        meal: "lunch",
        tags:["organic", "less-oil"]
    },
    {
        id: 2,
        foodName: "Boston Clam Chowder",
        calories: 750,
        meal:"dinner",
        tags:["home-cooked"]
    },
    {
        id: 3,
        foodName: "Tuna Sandwich",
        calories:600,
        meal:"snack",
        tags:["gluten-free"]
    }
];

// 2. ROUTES
app.get('/', function(req,res){
    res.render('index', {
        foodRecords: foodRecords
    });
})

app.get('/create', function(req,res){
    res.render('create');
})

app.post('/create', function(req,res){
    // ensure that selectedTags will be an array
    // if the user selected no tags -> empty array
    // if the user selected one tag -> array of one string inside
    // if the user selected multiple tags -> array of many strings
    let selectedTags = [];
    if (req.body.tags) {
        if (Array.isArray(req.body.tags)){
            selectedTags = req.body.tags
        } else {
            selectedTags = [req.body.tags];
        }
    }
    const newFood = {
        id: Math.floor(Math.random() * 10000000 + 1),
        foodName: req.body.foodName,
        calories: req.body.calories,
        meal: req.body.meal,
        tags: req.body.tags
    }
    foodRecords.push(newFood);

    // a redirect response tells the browser
    // to a different url on the same server(if the url is relative)
    res.redirect("/");
    console.log(req.body);
})

// 3. START SERVER
app.listen(3000, function(){
    console.log("Server has started")
})