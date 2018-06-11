var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongojs = require('mongojs'); // MongoDB 연결 해야되니 MongoJS 모듈도 추가
var fs = require('fs-extra'); // 파일을 복사하거나 디렉토리 복사하는 모듈

var db = mongoose.connection;


var mondb = mongojs('Dreamsup', ['images']); // 여기서 Dreamsup는 database 이름이고 images테이블을 사용할꺼라고 선언
 Image = require('../models/images');



var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var formidable = require('formidable'); 
var User = require('../models/user');




// Register
router.get('/register', function (req, res) {
	res.render('register');
});

// Login
router.get('/login', function (req, res) {
	res.render('login');
});
//upload

router.get('/upload', function (req, res) {
	res.render('upload');
//  var user = db.users.findOne({userName:"chun"})
  
});

//upload

router.get('/myinfo', function (req, res) {
	res.render('myinfo');
//  var user = db.users.findOne({userName:"chun"})
  
});
// information

router.get('/customer_service', function (req, res) {
	res.render('customer_service');
    
});


// Register User
router.post('/register', function (req, res) {
	var name = req.body.name;
    var email = req.body.email;
    var address = req.body.address;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', '이름을 입력해주세요.').notEmpty();
    req.checkBody('username', '아이디를 입력해주세요').notEmpty();
    req.checkBody('email', '이메일을 입력해주세요.').notEmpty();
    req.checkBody('address', '주소를 입력해주세요').notEmpty();
	req.checkBody('email', '이미 사용중인 이메일입니다.').isEmail();
	req.checkBody('password', '패스워드를 입력해주세요').notEmpty();
	req.checkBody('password2', '패스워드가 일치하지 않습니다.').equals(req.body.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('register', {
			errors: errors
		});
	}
	else {
		//checking for email and username are already taken
		User.findOne({ username: { 
			"$regex": "^" + username + "\\b", "$options": "i"
	}}, function (err, user) {
			User.findOne({ email: { 
				"$regex": "^" + email + "\\b", "$options": "i"
		}}, function (err, mail) {
				if (user || mail) {
					res.render('register', {
						user: user,
						mail: mail
					});
				}
				else {
					var newUser = new User({
						name: name,
                        email: email,
                        address: address,
						username: username,
						password: password
					});
					User.createUser(newUser, function (err, user) {
						if (err) throw err;
						console.log(user);
					});
         	req.flash('success_msg', 'You are registered and can now login');
					res.redirect('/users/login');
				}
			});
		});
	}
});

passport.use(new LocalStrategy(
	function (username, password, done) {
		User.getUserByUsername(username, function (err, user) {
			if (err) throw err;
			if (!user) {
				return done(null, false, { message: 'Unknown User' });
			}

			User.comparePassword(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, { message: 'Invalid password' });
				}
			});
		});
	}));

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.getUserById(id, function (err, user) {
		done(err, user);
	});
});

router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
	function (req, res) {
		res.redirect('/');
	});




router.post('/uploading',function(req,res){ 
   

    var date = new Date();
    
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    
     var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    
     var year = date.getFullYear();

    
     var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

     var rightnow = month + ":" + day + ":" + hour + ":" + min + ":" + sec;
    

    var filePath = "";
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {

        name = fields.name;

    });


    form.on('end', function(fields, files) {

  for (var i = 0; i < this.openedFiles.length; i++) {

  var temp_path = this.openedFiles[i].path;

            var file_name = this.openedFiles[i].name;
            var index = file_name.indexOf('/'); 
            var new_file_name = file_name.substring(index + 1);
            var new_location = '/resources/images/'+name+'/';
            var db_new_location = '/resources/images/'+name+'/';

            //실제 저장하는 경로와 db에 넣어주는 경로로 나눠 주었는데 나중에 편하게 불러오기 위해 따로 나눠 주었음

            filePath = db_new_location + file_name;

            fs.copy(temp_path,new_location + file_name, function(err) { // 이미지 파일 저장하는 부분임

                if (err) {

                    console.error(err);

                }

            });

  }

        
     var currentUser = req.user;
     name = currentUser.name;


mondb.images.insert({"name":name,"image":filePath,"time":rightnow},function(err,Image){

//디비에 저장

});

  });

    res.redirect('/users/upload'); // http://localhost:3000/users/upload 으로 이동!

});



router.post('/information',function (req, res) {
	
  var currentUser = req.user;
    name = currentUser.username;
    pw=currentUser.password;
    address = currentUser.address;
    
    console.log(name + '' + pw + ''+ address);
    
	});



router.get('/upload/image/time',function(req,res){        //몽고디비에서 filePath 와 name을 불러옴
 /*   mondb.images.find(function(err,doc){
        res.json(doc);
    });
*/
    Image.getImageByTime(req.params.time, function(err,Image){
        if(err){
            throw err;
            
        }
        res.json(Image);
    })
    
    
    Image.getImageById(req.params._id, function(err,Image){
        if(err){
            throw err;
            
        }
        res.json(Image);
    })
    
    
});



router.get('/logout', function (req, res) {
	req.logout();
    
    
 //   var currentUser = "";
	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;