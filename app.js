var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'); //parse body content into json

//using mongoose to connect to mongodb // creates new greatBookApi collection automatically
//var db = mongoose.connect('mongodb://localhost/greatBookApi');

var db = mongoose.connect('mongodb://mukum:sherma@ds053164.mongolab.com:53164/restful-book-api');

var Book = require('./models/bookModel');

var app = express();

//for uploading an image
var fs = require('fs');
//var Grid = require('gridfs-stream');
var multer = require('multer');

var port = process.env.PORT||8000;

//looks into body, if json is present, it parses it and add into req.body()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var bookRouter = express.Router();

bookRouter.route('/uploads')
	.post(function(req,res){
	 var dirname = require('path').dirname(__dirname);
     var filename = req.files.file.name;
     var path = req.files.file.path;
     var type = req.files.file.mimetype;
      
     var read_stream =  fs.createReadStream(dirname + '/' + path);
 
     var conn = req.conn;
     var Grid = require('gridfs-stream');
     Grid.mongo = mongoose.mongo;
 
     var gfs = Grid(conn.db);
      
     var writestream = gfs.createWriteStream({
        filename: filename
    });
     read_stream.pipe(writestream);
	});

bookRouter.route('/books')
	.post(function(req,res){
		var book = new Book(req.body);
		book.save();
		res.status(201).send(book);
		console.log(book);
		res.send(book);
	})

	.get(function(req,res){
		//var responseJson = {hello:"This is my api"};
		//res.json(responseJson);
		Book.find(function(err,books){
			if (err) {
				res.status(500).send(err);
				//console.log(err)
			}else{
				res.json(books);
			}
		});
	});

//http://localhost:8000/api/books
app.use('/api',bookRouter);

app.get('/',function(req,res){
	res.send('Welcome to my page');
});

app.listen(port,function(){
	console.log('Gulp is runningg on PORT: '+port);
})