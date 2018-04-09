var express = require('express');
var router = express.Router();

//MULTIPART FORM PARSE
var multer = require('multer');
var upload = multer({dest: './uploads'});

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
		console.log('No Errors');
	}

});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', function(req, res, next) {

});

module.exports = router;
		 