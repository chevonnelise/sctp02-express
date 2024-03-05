// 1. SETUP
// require is also known as 'importing'
// require is from something known as 'commonjs'
const express = require('express');
const hbs = require('hbs');

// create an express application
const app = express();

// enable form processing for Express
app.use(express.urlencoded({
    extended: false
}));

// setup hbs
app.set('view engine', 'hbs');

// mock database using an array
const database = [
    {
        "id": 1, // the id is to differenate each record from each other
        "title": "Preloved PS5",
        "price":800.99,
        "payments":["cod", "paynow"],
        "type":"entertainment"
    },
    {
        "id": 2, 
        "title":"Second Hand Jeans",
        "price": 45.5,
        "payments":["cheque"],
        "type":"clothings"
    },
    {
        "id": 3,
        "title": "Used Dictionary",
        "price": 13.5,
        "payments":["cod"],
        "type":"others"
    }
]

// 2. ROUTES
// HTTP method: 
// GET: retriving information from the server
// POST: adding new data to server
// PUT: replacing existing data on the server 
// PATCH: modifying existing data on the server
// DELETE: deleting existing data on the server
// req: client (the one sending) to server
// res: server to client 
app.get('/', function(req,res){
    // 'render' and send back the content
    // of index.hbs as content
    // the filepath is relative to the `views` folder
    res.render("index", {
        'products': database
    });
});

app.get('/create-listing', function(req,res){
    res.render('create-listing');
})

app.post("/create-listing", function(req,res){
    console.log(req.body);
    const title = req.body.title;
    const price = req.body.price;
    let payments = [];
    if (Array.isArray(req.body.payments)){
        payments = req.body.payments;
    } else if (req.body.payments) {
        // if req.body.payments is NOT an array
        // but is truthy then it has to be a string
        payments = [ req.body.payments ];
    }
    const type = req.body.type;
    const newProduct = {
        "id": Math.floor(Math.random() * 10000 + 1),
        "title": title,
        "price": price,
        "payments": payments,
        "type": type
    }
    database.push(newProduct);
    // instruct the client (i.e browser) to go 
    // to a new URL
    res.redirect("/");

})


// 3. START SERVER
app.listen(3000, function(){
    console.log("server has started");
})
