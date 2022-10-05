const express= require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema =  new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model('articles',articleSchema);


app.route("/articles")

.get(function(req,res){
    Article.find(function(err,articles){
      if(!err)
        res.send(articles);
      else {
        console.log(err);
      }
    })
  })

  .post(function(req,res){
    let title= (req.body.title);
    let content = (req.body.content);
    const arti = new Article({
      title: title,
      content: content
    });
    arti.save(function(err){
      if(!err)
        res.send("Successfully saved!");
      else
        res.send(err);
    });
  })

  .delete(function(req,res){
    Article.deleteMany(function(err){
      if(!err)
        res.send("Successfully deleted!");
      else
        res.send(err);
    })
  });

app.route("/articles/:requestTitle")

.get(function(req,res){
  Article.findOne({title:req.params.requestTitle},function(err,foundArticle){
    if(!err)
      res.send(foundArticle);
    else
      res.send("No record found");
  })
})

.put(function(req,res){
  Article.updateOne({title:req.params.requestTitle},{title:req.body.title, content:req.body.content},
    function(err,changedArticle){
      if(!err)
        res.send(changedArticle);
      else
        res.send("Sorry there was an error");
  })
})

.patch(function(req,res){
  Article.updateOne({title:req.params.requestTitle},{title:req.body.title},
  function(err,UpdatedArticle){
    if(!err)
      res.send(UpdatedArticle)
    else {
      res.send(err);
    }
  })
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.requestTitle},
    function(err){
      if(!err)
        res.send("Successfully deleted!");
      else
        res.send(err);
    })
})






// app.get("/articles",);
//
// app.post("/articles",);
//
// app.delete("/articles",)







app.listen(3000,function(){
  console.log("Server started on port 3000");
});
