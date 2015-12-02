 var crypto = require('crypto');
var mongoose = require('mongoose');


var scheduleSchema = new mongoose.Schema({
  user_id: String,
  content: String
 }, {
  collection: 'schedules' 
	}); 
	




var scheduleModel = mongoose.model('Schedule', scheduleSchema);

function Schedule(sche){

this.user_id = sche.user_id,

this.content = sche.content;
};	
	
Schedule.prototype.save = function(callback) {
  
  var schedule = {
	  user_id:this.user_id,
      content: this.content    
  };

var newSchedule = new  scheduleModel(schedule);

  newSchedule.save(function (err, schedule) {
    if (err) {
      return callback(err);
    }
    callback(null, schedule);
  });
};//protype最終





Schedule.get = function(user_id, callback) {
  scheduleModel.findOne({user_id:user_id}, function (err,schedule) {
    if (err) {
      return callback(err);
    }
	
    callback(null, schedule);
  });
};

Schedule.update = function (sid,content,callback) {
  scheduleModel.update({_id:sid},{$set:{content:content}},function (err) {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
};




	
module.exports = Schedule;
	
	
	
	
