var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local:{
		username:{
			type:String,
			required:true,
			unique:true,
			minlength:5
		},
		password:{
			type:String,
			required:true,
			minlength:5
		},
		city:{
			type:String,
			required:true
		},
		comapany:{
			type:String
		}
	}
});


userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password,this.local.password);
}
module.exports = mongoose.model('User','userSchema');