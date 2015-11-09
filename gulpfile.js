//gulp needs gulp-nodemon module
//gulp helps to restart the server automatically
//***access gulp globally //sudo npm install gulp -g //use password if needed

var gulp = require('gulp'),
	nodemon = require('gulp-nodemon');

gulp.task('default',function(){
	nodemon({
		script:'app.js',
		ext:'js',
		env:{
			PORT:8000
		},
		ignore:['./node_modules/**']
	})
	.on('restart',function(){
		console.log('Restarting');
	});
});



