const database_url = require(__dirname + "/url.js");

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
mongoose.connect(database_url);
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.use(express.static("public"));

const movieSchema = new mongoose.Schema({
    title: String,
    review: String,
    rating: Number
});

const Movie = mongoose.model("Movie", movieSchema);


//*********** Middleware **************************/
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

//************************** Request Targeting all the articles *************************************/

app.route("/")
.get((req,res)=>{
    res.send("This is movie RESTful API. To get data go to /movies route <br> To enter data go to /dataEntry route")
})

app.route("/movies")
 .get(function(req, res){
    Movie.find(function(err, Movies){ 
        if(err){
            console.log(err);
        }else{
            console.log(Movies);
            res.send(Movies);
        }
    });
})

app.route("/dataEntry")
  .get((req, res)=>{
      res.render("index");
  })
  .post((req, res)=>{
    var NAME = req.body.name;
    var REVIEW = req.body.review;
    var RATING = req.body.rating;
    const entry = new Movie({
        title : NAME,
        review : REVIEW,
        rating : RATING
    })
    entry.save();
    console.log(NAME);
    console.log(REVIEW);
    console.log(RATING);
    res.redirect("/dataEntry");
  })


app.listen(process.env.PORT || 3000, function () {
  console.log("Server running at: http://localhost:3000/");
});