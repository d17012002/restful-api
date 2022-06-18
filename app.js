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
  rating: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

//*********** Middleware **************************/
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});


//Home Route
app.route("/").get((req, res) => {
  res.send(
    "To get all articles go to /movies route. To target a specific movie go to /movies/<i>movieTitle</i> route.<br> (To target movies whose title have space in between use %20 instead of space, eg. /movies/Kashmir%20Files).<br>To enter data go to /dataEntry route"
  );
});

//************************** Request Targeting all the articles *************************************/

app.route("/movies").get(function (req, res) {
  Movie.find(function (err, Movies) {
    if (err) {
      console.log(err);
    } else {
      console.log(Movies);
      res.send(Movies);
    }
  });
});

app.route("/dataEntry")
  .get((req, res) => {
    res.render("index");
  })
  .post((req, res) => {
    var NAME = req.body.name;
    var REVIEW = req.body.review;
    var RATING = req.body.rating;
    const entry = new Movie({
      title: NAME,
      review: REVIEW,
      rating: RATING,
    });
    entry.save();
    console.log(NAME);
    console.log(REVIEW);
    console.log(RATING);
    res.redirect("/dataEntry");
  });

//******** Request Targeting specific article ********************//
app.route("/movies/:movieTitle")
   .get((req, res)=>{
      Movie.findOne({title: req.params.movieTitle}, function(err, foundArticle){
        if(foundArticle){
          res.send(foundArticle)
        }else{
          res.send("No such article found.")
        }
      })
   });


app.route("/delete/:movieName")
   .delete(function(req, res){
     Movie.deleteOne(
      {title: req.params.movieName}, 
      function(err){
          if(err){
            res.send(err)
          }else{
            res.send("Sucessfully deleted!")
          }
       });
      });
  

app.listen(process.env.PORT || 3000, function () {
  console.log("Server running at: http://localhost:3000/");
});
