// 1. SETUP 
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

// setup the 188 handlebars helpers
const handlebarsHelpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
})

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

// 

app.get('/delete-food/:foodid', function (req,res){
    const idToDelete = req.params.foodid;

    // linear search algo
    let wantedFoodRecord = null;
    for (let record of foodRecords) {
        if (record.id == idToDelete) {
            wantedFoodRecord = record;
            break;
        }
    }
    res.render('confirm-delete', {
        "record": wantedFoodRecord
    })
})

app.post('/delete-food/:foodid', function(req,res){
    // we need to know the index of the element
    // that we want to delete
    const idToDelete = req.params.foodid;

    // find the index of the food record
    let indexToDelete = -1;
    for (let i = 0; i < foodRecords.length; i++) {
        if (foodRecords[i].id == idToDelete) {
            indexToDelete = i;
            break;
        }
    }

    // use splice to delete an index from an array
    // splice has 2 parameteres:
    // parameter 1: the index to start deleting from
    // parameter 2: how many to delete
    foodRecords.splice(indexToDelete, 1);
    res.redirect('/');
})

app.get('/edit-food/:foodid', function (req,res) {
    const idToEdit = req.params.foodid;
    // get the food record that we are editing
    const foodRecordToEdit = foodRecords.find(function(record){
        return record.id == idToEdit;
    })
    res.render('edit', {
        record: foodRecordToEdit
    })
})

app.post('/edit-food/:foodid', function (req,res){
    const idToEdit = req.params.foodid;
    const indexToEdit = foodRecords.findIndex(function(record){
        return record.id == idToEdit;
    });

    let tags = [];
    if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
    } else if (req.body.tags) {
        tags = [req.body.tags];
    }

    const modifiedRecord = {
        id: req.params.foodid,
        foodName:req.body.foodName,
        calories: req.body.calories,
        meal: req.body.meal,
    }
    foodRecords[indexToEdit] = modifiedRecord
    res.redirect('/');
})

// 3. START SERVER
app.listen(4000, function(){
    console.log("Server has started")
})