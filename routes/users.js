var express = require('express');
var router = express.Router();

//DATABASE MODEL
var User = require('../models/user');

//MULTIPART FORM PARSE
var multer = require('multer');
var upload = multer({dest: './uploads'});

//AUTHENTICATION
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register', form: {} });
});

router.post('/register', upload.single('profileImage'), function(req, res, next) {
	
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	
	if(req.file){

		console.log('File Uploaded');

		var profileImage = req.file.filename;
	}
	else{
		console.log('No File Attached');

		var profileImage = "noimage.jpg";
	}

	//Form Validator
	req.checkBody('name','Name field is required').notEmpty();
	req.checkBody('email','Email field is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	req.checkBody('username','Username field is required').notEmpty();
	req.checkBody('password','Password field is required').notEmpty();
	req.checkBody('password2','Confirm Password field is required').notEmpty();
	req.checkBody('password2','Passwords do not match').equals(req.body.password);

	//Check Errors
	var errors = req.validationErrors();

	if(errors){

		var form = {
			name: name,
			email: email,
			username: username
		};

		res.render('register',{
			errors: errors,
			form, form
		});
	}
	else{
		
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password,
			profileImage: profileImage
		});

		User.createUser(newUser, function(err, user){
			
			if(err){
				throw err;
			}
			console.log(user);
		});

		req.flash('success','You are now registered and can login');

		res.location('/');
		res.redirect('/');
	}

});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login',
	passport.authenticate('local',{failureRedirect:'/users/login', failureFlash:'Invalid username or password'}),
	function(req, res) {
	  req.flash('success','You are now logged in');
	  res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy(function(username, password, done){
	
	User.getUserByUsername(username, function(err, user){

		if(err){
			throw err;
		}
		if(!user){
			return done(null, false, {message: 'Unkown User'});
		}

		User.comparePassword(password, user.password, function(err, isMatch){
			if(err){
				return done(err);
			}
			if(!isMatch){
				return done(null,false, {message: 'Invalid Password '});
			}
			else{
				return done(null, user);
			}
		});
	});
}));

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success','You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;