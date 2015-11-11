var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'); //parse body content into json

//using mongoose to connect to mongodb // creates new greatBookApi collection automatically
//var db = mongoose.connect('mongodb://localhost/greatBookApi');

var db = mongoose.connect('mongodb://mukum:sherma@ds053164.mongolab.com:53164/restful-book-api');

var Book = require('./models/bookModel');

var app = express();

//for uploading an image
//needs modules - npm install s3fs connect-multiparty --save
// s3fs and connect-multiparty modules are used
var fs = require('fs');
var S3FS = require('s3fs');
var s3fsImpl = new S3FS('ms-images-bucket',{
	accessKeyId : "AKIAJZVVV5HFBZQRPDXA",
	secretAccessKey : "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"
});//bucket in Amazon s3
s3fsImpl.create();

var multiparty = require('connect-multiparty'),
	multipartyMiddleware = multiparty();
//app.use(multipartyMiddleware);

//var Grid = require('gridfs-stream');
var multer = require('multer');

var port = process.env.PORT||8000;

//looks into body, if json is present, it parses it and add into req.body()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var bookRouter = express.Router();
bookRouter.use(multipartyMiddleware);

bookRouter.route('/uploads')
	.post(function(req,res){

		var file = req.files.file;
		var stream = fs.createReadStream(file.path);
		return s3fsImpl.writeFile(file.orginalFilename,stream.then(function(){
			fs.unlink(file.path,function(err){
				if (err) 
					console.log(err);
			})
		}));
	});
// bookRouter.route('/uploads')
// 	.post(function(req,res){

// 		var file = req.files.file;
// 		var stream = fs.createReadStream(file.path);
// 		return s3fsImpl.writeFile(file.orginalFilename,stream.then(function(){
// 			fs.unlink(file.path,function(err){
// 				if (err) {
// 					console.log(err);
// 				}
// 			});
// 	})

	 // var dirname = require('path').dirname(__dirname);
  //    var filename = req.files.file.name;
  //    var path = req.files.file.path;
  //    var type = req.files.file.mimetype;
      
  //    var read_stream =  fs.createReadStream(dirname + '/' + path);
 
  //    var conn = req.conn;
  //    var Grid = require('gridfs-stream');
  //    Grid.mongo = mongoose.mongo;
 
  //    var gfs = Grid(conn.db);
      
  //    var writestream = gfs.createWriteStream({
  //       filename: filename
  //   });
  //    read_stream.pipe(writestream);

bookRouter.route('/books2')
	.post(function(req,res){
		var book = new Book(req.body);
		book.save();
		res.status(201).send(book);
		console.log(book);
		res.send(book);
});

bookRouter.route('/books')
	.post(function(req,res){
		var book = new Book(req.body);
		book.save();
		res.status(201).send(book);
		console.log(book);
		res.send(book);
	})
	// .post(function(req,res){

	// 	var file = req.files.file;
	// 	var stream = fs.createReadStream(file.path);
	// 	return s3fsImpl.writeFile(file.orginalFilename,stream.then(function(){
	// 		fs.unlink(file.path,function(err){
	// 			if (err) 
	// 				console.log(err);
	// 		})
	// 	}));
	// })

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