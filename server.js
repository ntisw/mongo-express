//setup Express
var express = require('express');
var app = express();
//setup Mongo connection
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var options = { useUnifiedTopology: true, useNewUrlParser: true };
var bodyPaser = require('body-parser');
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({ extended: true }));
//set the view engine to ejs
app.set('view engine', 'ejs');
//handle
app.get('/', function (req, res) {
  res.render('pages/index', { page_title: "Home - With Mongo" });
});
app.get('/classroom', function (req, res) {
  //Get data from MongoDB
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("coc");
    var query = {};
    //var mysort = { subject_name : 1};
    dbo.collection("classroom")
      .find(query)
      //.sort(mysort) //sort by name
      .toArray(function (err, result) {
        if (err) throw err;
        //console.log(result);
        res.render('pages/classroom', { page_title: "Class - With Mongo", classes: result });
        db.close();
      }
      );
  });
});

app.get('/classdetail/:id', function (req, res) {
  var classid = req.params.id;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("coc");
    var query = { subject_id: classid };
    //var mysort = { subject_name : 1};
    dbo.collection("classroom")
      .findOne(query, function (err, result) {
        if (err) throw err;
        //console.log(result);
        res.render('pages/classdetail', { page_title: "Detail - With Mongo", detail: result });
        db.close();
      }
      );
  });
});


app.get('/classedit/:id', function (req, res) {
  var classid = req.params.id;
  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;
    var dbo = db.db("coc");
    var query = { subject_id: classid };
    //var mysort = { subject_name : 1};
    dbo.collection("classroom")
      .findOne(query, function (err, result) {
        if (err) throw err;
        //console.log(result);
        res.render('pages/classedit', { page_title: "Edit - With Mongo", detail: result });
        db.close();
      }
      );
  });
});
app.post('/classsave', function (req, res) {
  var sub_id = req.body.id;
  var sub_name = req.body.name;
  var sub_room = req.body.room;

  MongoClient.connect(url, options, function (err, db) {
    if (err) throw err;    
    var dbo = db.db("coc");
    var query = {
      subject_id: sub_id
    }
    var newvalues =
    {
      $set:{
        subject_name: sub_name,
        room: sub_room
      }
    };
    dbo.collection('classroom')
      .updateOne(query, newvalues, function (err, result) {
        if (err) throw err;
        console.log("1 doc updated");
        db.close();
        res.redirect("/classroom");
      });
  });
});
/*

*/

app.listen(8080);
console.log('8080 is the magic port.Express started at http://localhost:8080');