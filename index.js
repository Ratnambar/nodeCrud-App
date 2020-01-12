var express=require('express');
const app=express();
var fs=require('fs');
var path=require('path');
var hbs=require('hbs');
var bodyParser=require('body-parser');
var mongo=require('mongoose');
var ObjectId = require('mongodb').ObjectID;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine','hbs');
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerPartials(__dirname + '/views');



app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';



app.get('/',function(req,res){
	res.sendFile(path.join(__dirname + '/public/insert.html'));
});
app.get('/select',function(req,res){
	res.sendFile(path.join(__dirname + '/public/display.html'));
});
app.get('/up',function(req,res){
	res.sendFile(path.join(__dirname + '/public/update.html'));
});



app.post('/insert',function(req,res){
 MongoClient.connect(url,function(err,db){
 	if(err)throw err;
 	var dbo = db.db("student");
    var data = {
        "name": req.body.name,
        "age":req.body.age,
        "city":req.body.city,
        "company":req.body.company
    }
    dbo.collection("knit").insertOne(data,function(err,res){
    	if(err)throw err;
    	// res.render('/data');
    	console.log('inserted');
    	db.close();
    });
 });
});


app.post('/display',function(req,res){
	MongoClient.connect(url,function(err,db){
		var dbo=db.db("student");
		dbo.collection("knit").find({}).toArray(function(err,result){
			if(err)throw err;
			res.render('data',{'list':result});
			db.close();
		});
	});
});



app.get('/:id',function(req,res,next){
	MongoClient.connect(url,function(err,db){
		if(err)return next(err);
		var dbo=db.db("student");
		var id = req.params.id;
	dbo.collection("knit").findOne({"_id":ObjectId(id)},function(err,body){
		if(err)throw err;
			res.render('update',{'user':body});
			db.close();
	});
	});
});

app.post('/update',function(req,res){
	MongoClient.connect(url,function(err,db){
		if(err)throw err;
		var dbo=db.db("student");
		var id=req.body.id;
		dbo.collection("knit").updateOne({"_id":ObjectId(id)},
			{$set:{"name":req.body.name,"age":req.body.age,"city":req.body.city,
			"company":req.body.company}},function(err,res){
			if(err)throw err;
			res.sendFile(path.join(__dirname + '/insert.html'));
			db.close();
		});
	});
});


app.get('/delete/:id',function(req,res){
	MongoClient.connect(url,function(err,db){
		if(err)throw err;
		var dbo=db.db("student");
		var id=req.params.id;
		dbo.collection("knit").remove({"_id":ObjectId(id)},function(err,body){
			if(err)throw err;
			res.sendFile(path.join(__dirname + '/insert.html'));
			db.close();
		});
});
});

app.listen(3000,function(err,res){
	if(err)throw err;
	console.log("listening port");
});
