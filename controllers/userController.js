var nodemailer = require('nodemailer');

module.exports = {
  signup ( req, res ) {
    var db = req.db;
    var userDB = db.get('users');
    userDB.insert(req.body,function(e,docs){
      if(e) res.end(JSON.stringify(e));
      else{
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(message = 'success'));
      }
    });
  },
  login ( req, res) {
    var db = req.db;
  	console.log(req.body);
  	var userDB = db.get('users');
  	userDB.find({email:req.body.email},{},function(e,docs){
  		if(e) res.end(JSON.stringify(e));
  		else{
  			// console.log(docs);
  				// res.setHeader(200,{'Content-Type': 'application/json'});
  				// res.end(JSON.stringify(docs));
  			if(docs.length == 1){
          if(docs[0].pwd == req.body.pwd) {
            res.writeHead(200,{'Content-Type': 'application/json'});
    				res.end(JSON.stringify(message = 'success'));
          }
  				else{
            res.writeHead(200,{'Content-Type': 'application/json'});
    				res.end(JSON.stringify(message = 'pwd incorrect'));
          }
  			}
  			else{
  				res.writeHead(200,{'Content-Type': 'application/json'});
  				res.end(JSON.stringify(message = 'Not a user'));
  			}
  		}
  	});
  },
  resetPassword(req, res){
    var db = req.db;
    var userDb = db.get('users');
    console.log(req);
    userDb.find({email: req.body.email},(findErr, usrDoc) =>{
      if(findErr){
        return res.status(500).render('passwordErr', { message: 'Something went wrong! Please try again later.' });
        // end(JSON.stringify(message= 'Something went wrong! Please try again later.'));
      }
      if(usrDoc.length == 0){
        return res.status(404).render('passwordErr', { message: "Email doesn't exist! Please Sign Up from the app." });
        // end(JSON.stringify(message= 'user not found'));
      }
      userDb.update({email: req.body.email},{$set:{ pwd: req.body.password}},(updateErr, usrDoc) =>{
        if(updateErr){
          return res.status(500).render('passwordErr', { message: "Something went wrong! Please try again later."});
          // (JSON.stringify(message = "Something went wrong! Please try again later."));
        }
        res.render('passwordSuccess');
        // res.status(200).json(JSON.stringify(message = "success"));
      });
    });
  },
  sendResetMail(req, res){
    console.log(req.body);
    var db = req.db;
    var userDb = db.get('users');
    res.timeout = 0;
    userDb.find({email: req.body.userEmail}, (findErr, userDoc)=>{
      if(findErr){
        console.log(findErr);
        return res.status(500).end(JSON.stringify(message = 'Something went wrong! Please try again later.'));
      }
      if(userDoc.length == 0){
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(JSON.stringify(message = 'not a user'));
        return;
      }
      var transporter = nodemailer.createTransport({
        service: 'Zoho',
        auth: {
          user: 'testing@1byzerolabs.co.in',
          pass: 'test1234',
        }
      });
      var mailOpts = {
        from: 'testing@1byzerolabs.co.in',
        to: req.body.userEmail,
        subject: 'Reset Password for Glassmate',
        html: "<strong> Dear User, We received a request from this Email for a change of password for Glassmate App.</strong>"+
        "<br><p>If you didn't request it kindly report it to us or you can choose to ignore it.<br>"+
        "Password Reset Link:</p> <br>"
        +"http://34.206.126.231:3000/changepwd/",
      };
      transporter.sendMail(mailOpts, (sendErr, info)=>{
        if(sendErr){
          console.log(sendErr);
          return res.status(500).json({message: 'Something went wrong! Please try again later.'});
        }
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify(message= 'success'));
      });
    });
  },
};
