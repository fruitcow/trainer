var crypto = require('crypto');
var mongoose = require('mongoose');
	

var userSchema = new mongoose.Schema({//建立SCHEMA物件
  name: String,
  password: String,
  email: String,
  phone:String
  
}, {
  collection: 'users' 
});

var userModel = mongoose.model('User', userSchema);//建立Mongoose物件

function User(user) {//帶有METHOD的物件,參數為物件原型該有的屬性
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
  this.phone = user.phone;
};

User.prototype.save = function(callback) {//給予User 名為save的method
  var md5 = crypto.createHash('md5'),
      email_MD5 = md5.update(this.email.toLowerCase()).digest('hex')
      
  var user = {//物件原型
      name: this.name,
      password: this.password,
      email: this.email,
	  phone: this.phone 
						};

  var newUser = new userModel(user);

  newUser.save(function (err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, user);
  });
};

User.get = function(email, callback) {
  userModel.findOne({email: email}, function (err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, user);
  });
};

User.list = function(list,callback){
	userModel.find({},function(err,users){
	var usermap = {};
	
	if(err){
	return callback(err);
	}
	callback(null,users);
	
	
	});
	};
	
	
	


module.exports = User;