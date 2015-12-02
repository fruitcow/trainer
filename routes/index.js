
var crypto = require('crypto'),
User = require('../models/user.js');
Schedule = require('../models/schedule.js');
var mongoose =require('mongoose');

mongoose.connect('mongodb://tuser:tuser@ds035653.mongolab.com:35653/trainer');





module.exports = function(app){

  app.get('/', function (req, res) {
	 
  res.render('index', {
	  
    title: '首頁',
    user: req.session.user,
    success:req.flash('success').toString(),
    error: req.flash('error').toString(),
	
	
  });
});



app.get('/contact', function (req, res) {
  res.render('contact', {
    title: '聯絡我們',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString(),
	
	
  });
});
 app.get('/login', function (req, res) {
    res.render('login', {
      title: '登入',
	user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString(),
	
     
    }); 
  });
  
  app.post('/login', function (req, res) {
  //生成密碼的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  //檢查用戶存在
  User.get(req.body.email, function (err, user) {
    if (!user) {
      req.flash('error', '用户不存在!'); 
      return res.redirect('/login');//用戶不存在則跳轉到登錄頁
    }
    //檢查密碼是否一致
    if (user.password != password) {
      req.flash('error', '密碼錯誤!'); 
      return res.redirect('/login');//密碼錯誤則跳轉到登錄頁
    }
    //用戶名密碼都匹配後，將用戶信息存入 session
    req.session.user = user;
    req.flash('success', '登入成功!');
    res.redirect('/');
  });
});

	app.get('/reg', function (req, res) {
	res.render('reg', {
     title: '註冊',
	user:req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString(),
  
    }); 
});
app.post('/reg', function (req, res) {
	var regexp = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/;
	var preg =/^[A-Za-z0-9]+$/;
	var phreg =/^\d{10}$/;
	
  var name = req.body.name,
      password = req.body.password,
      password_re = req.body['password-repeat'],
	  mail = req.body.email,
	  phone =req.body.phone;
     if(mail.match(regexp)==null){
		  req.flash('error', '信箱不合規定'); 
         return res.redirect('/reg');//返回注冊頁
		 
		 
	 }
	  if(password.match(preg)==null){
		  req.flash('error', '密碼不合規定'); 
         return res.redirect('/reg');//返回注冊頁
		 
		 
	 }
	 if(phone.match(phreg)==null){
		  req.flash('error', '電話不合規定'); 
         return res.redirect('/reg');//返回注冊頁
		 
		 
	 }
  if (password_re != password) {
    req.flash('error', '兩次輸入的密碼不一致!'); 
    return res.redirect('/reg');//返回注冊頁
  }
  
  
  //生成密碼的 md5 值
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');
  var newUser = new User({//newUser為user.js的User物件
      name: name,
      password: password,
      email:mail,
	  phone:phone
  });
  //檢查用戶銘是否存在 
  User.get(newUser.email, function (err, user) {
    if (err) {
      req.flash('error', err);
      return res.redirect('/');
    }
    if (user) {
      req.flash('error', '用户已存在!');
      return res.redirect('/reg');//返回註冊頁
    }
    //不存在時創造新的
    newUser.save(function (err, user){ //user.js中已有User.prototype.save了，將Callback傳入後幾可運作
      if(err){
        req.flash('error', err);
        return res.redirect('/reg');//註冊失敗
      }
      req.session.user = user;//用户信息存入 session
      req.flash('success', 'Register Success');
      res.redirect('/');//註冊成功
    });
  });
});

 app.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');//登出成功
  var username= null;
});
  
  
  

  
 app.get('/admin',function(req,res){
	
	 if(req.session.user.name!="admin"){
		 
		 req.flash('error', '非Admin!');
		 return res.redirect('/');
	 }else{
	User.list(null,function(err,lists){
		if(err){
			req.flash('error', '查詢失敗!');
			return res.redirect('/');
		}
		
		
	res.render('admin',{
	title: '管理頁面',
	user:req.session.user,
	success:req.flash('success').toString(),
	error :req.flash('error').toString(),
	list:lists
	
	});
	
	
	});
	 }
	
});

app.get('/admin/schedule/:id',function(req,res){
	var uid = req.params.id;
	 Schedule.get(uid,function(err,schedule){
		
		if(err){
			
			console.log("get failed");
			
		}
	
	res.render('adschedule', {
    title: '學生課表',
    user: req.session.user,
	success: req.flash('success').toString(),
    error: req.flash('error').toString(),
	schedule:schedule,
	uid:uid
  });
	
	
  });
	
});

app.post('/admin/schedule/:id', function (req, res) {
	var uid = req.params.id;
	console.log("admin posted");
	var tcontent = req.body.content;
	var sid;
  var schedule = new Schedule({
      user_id:uid,
      content:tcontent
  });
    Schedule.get(uid,function(err,schedulef){
		if(schedulef!=null){
			
		sid = schedulef._id;
   Schedule.update(sid,tcontent,function(err){
		 if(err){   
		 console.log("admin update failed");
		return res.redirect('/admin/schedule/'+uid);
		
		 }
		  
		  console.log("admin update success");
		  return res.redirect('/admin/schedule/'+uid);
		
		 

	 });
		}else{
			
	schedule.save(function (err) {
      if (err) {
		console.log("save failed");
        //失敗
      }
	  console.log("save success");
	  return res.redirect('/schedule');
      //返回註冊頁

	
    }); 
			
			
	

		}
	

 });
  
});//post sche 最終







app.get('/schedule', function (req, res) {
	var userid = req.session.user._id;
    Schedule.get(userid,function(err,schedule){
		
		if(err){
			
			console.log("get failed");
			
		}
	
	res.render('schedule', {
    title: '課表',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString(),
	schedule:schedule
  });
	
	
  });
	

  
});




app.post('/schedule', function (req, res) {
	console.log("posted");
	var tcontent = req.body.content;
	var userid = req.session.user._id;
	var sid;
  var schedule = new Schedule({
      user_id:userid,
      content:tcontent
  });
    Schedule.get(userid,function(err,schedulef){
		if(schedulef!=null){
		sid = schedulef._id;
   Schedule.update(sid,tcontent,function(err){
		 if(err){   
		 console.log("update failed");
		 return res.redirect('/schedule');
		 }
		  console.log("update success");
		  
		 return res.redirect('/schedule');
		 

	 });
		}else{
			
	schedule.save(function (err) {
      if (err) {
		console.log("save failed");
        //失敗
      }
	  console.log("save success");
	  return res.redirect('/schedule');
      //返回註冊頁

	
    }); 
			
			
	

		}
	

 });
  
});//post sche 最終
 


 
 
 
 
 
 
};//最終
 
 
 
 
 
 
 
 
 
 
 
 
 
 
  


	
