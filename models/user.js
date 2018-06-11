var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,                         // 유저이름 
		index:true
	},
	password: {                                //패스워드
		type: String
    },
    address: {                                  //주소
        type: String
    },
	email: {                                  //이메일
		type: String
	},
	name: {                                  //이름
		type: String
	},
    money: {
        type: Number                         // 돈
    }
});     


var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {   // 유저의 비밀번호를 암호화 한후 콜백 함수 호출
	        newUser.password = hash;                   
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){     // 서버에서 유저의 아이디를 가져온다.
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){   // 유저의 암호가 일치하는지 확인한다.
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}

