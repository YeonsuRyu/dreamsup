var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var imgSchema = mongoose.Schema({
	name: {
		type: String,                         // 유저이름 
		index:true
	},
    image: {                                  //주소
        type: String
    },
	time: {                                  //이메일
		type: Date,
        default : Date.now
	}
	
});      


var Image = module.exports = mongoose.model('images',imgSchema);

//get images
module.exports.getImageById = function(id, callback){
    Image.findById(id,callback);
}


module.exports.getImageByTime = function(user, callback){
    Image.findbyTime(time,callback)

}
