var nodemailer = require('nodemailer');

module.exports = {
  findBatch ( req, res) {
    const db = req.db;
  	// console.log(req.body);
  	batchNo = Number(req.body.batchNo);
  	// console.log('Batch No: ' + batchNo);
  	const products = db.get('products');
  	const logs = db.get('userlogs');
  	products.find({'productID' : batchNo},function(e,docs){
  		if(e) res.end(JSON.stringify(e));
  		else{
  			const product = docs;
  			if(docs.length > 0){
  				logs.insert(req.body,function(e,docs){
  					if(e) res.end(JSON.stringify(e));
  					else{
  						res.writeHead(200,{'Content-Type':'application/json'});
  						res.end(JSON.stringify(product));
  					}
  				});
  			}
  			else{
  				res.writeHead(200,{'Content-Type':'application/json'});
  				res.end(JSON.stringify(message = 'product not found'));
  			}
  		}
  	});
  },
  findNearBy ( req, res) {
    const db = req.db;
    const reqCity = req.params.city;
    const distributors = db.get('distributors');
    distributors.find({city: reqCity}, (findErr, distDocs) => {
      if(findErr){
        res.end(JSON.stringify(findErr));
        return;
      }
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify(distDocs));
    });
  },
  getSales(req,res){
    const db = req.db;
    const sales = db.get('sales');
    sales.find({distributorEmail: req.params.email},(findErr, sales) => {
      if(findErr){
        res.status(500).end(JSON.stringify(findErr));
        return;
      }
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify(sales));
    });
  },
  addSales(req,res){
    const db = req.db;
    const sales = db.get('sales');
    const users = db.get('users');
    sales.insert(req.body, (insertErr) => {
      if(insertErr){
        res.status(500).end(JSON.stringify(insertErr));
        return;
      }
      users.findOne({email: req.body.distributorEmail},(findErr, userDoc)=>{
        if(findErr){
          res.status(500).end(JSON.stringify(findErr));
          return;
        }
        const user = userDoc;
        const usrPoints = userDoc.points;
        users.update({email: user.email},{$set:{points: usrPoints+10}},(updErr)=>{
          if(updErr){
            res.status(500).end(JSON.stringify(updErr));
            return;
          }
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end(JSON.stringify(message = 'success'));
        });
      });
    });
  },
  getProjects(req,res){
    const db = req.db;
    const products = db.get('projects');
    products.find({distributorEmail: req.params.email},(findErr, products) => {
      if(findErr){
        res.status(500).end(JSON.stringify(findErr));
        return;
      }
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify(products));
    });
  },
  addProjects(req,res){
    const db = req.db;
    const products = db.get('projects');
    const users = db.get('users');
    products.insert(req.body,(insertErr) => {
      if(insertErr){
        res.status(500).end(JSON.stringify(insertErr));
        return;
      }
      users.findOne({email: req.body.distributorEmail},(findErr, userDoc)=>{
        if(findErr){
          res.status(500).end(JSON.stringify(findErr));
          return;
        }
        const user = userDoc;
        const usrPoints = userDoc.points;
        users.update({email: user.email},{$set:{points: usrPoints+50}},(updErr)=>{
          if(updErr){
            res.status(500).end(JSON.stringify(updErr));
            return;
          }
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end(JSON.stringify(message = 'success'));
        });
      });
    });
  },
  countSales(req, res){
    const db = req.db;
    const sales = db.get('sales');
    sales.count({ distributorEmail: req.params.email}, (countErr, count) => {
      if(countErr){
        res.status(500).end(JSON.stringify(countErr));
        return;
      }
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify(counter = count));
    });
  },
  countProjects(req, res){
    const db = req.db;
    const projects = db.get('projects');
    projects.count({ distributorEmail: req.params.email}, (countErr, count) => {
    if(countErr){
        res.status(500).end(JSON.stringify(countErr));
        return;
      }
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify(counter = count));
    });
  },
  getRewardPoints(req, res){
    const db = req.db;
    const users = db.get('users');
    users.findOne({ email: req.params.email}, 'points -_id',(findErr, userDoc) => {
    if(findErr){
        res.status(500).end(JSON.stringify(findErr));
        return;
      }
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify(points = userDoc));
    });
  },
  claimRewards(req, res){
    const db = req.db;
    const reward = db.get('rewards');
    reward.insert(req.body, (insertErr) => {
      if(insertErr){
        res.status(500).end(JSON.stringify(insertErr));
        return;
      }
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify(message = 'success'));
    });
  },
  sendEnquiry(req, res){
    res.timeout = 0;
    var transporter = nodemailer.createTransport({
      service: 'Zoho',
      auth: {
        user: 'testing@1byzerolabs.co.in',
        pass: 'test1234',
      }
    });
    var mailOpts = {
      from: 'testing@1byzerolabs.co.in',
      to: 'aswinkumar.v@saint-gobain.com',  //NOTE: Change this email to Aswin's Email, whenever given by SG.
      subject: 'Enquiry',
      html: 'Name:'+req.body.name+'<br>Email:'+req.body.email+'<br>Contact Number:'+req.body.number
      +'<br>Profession:'+req.body.profession+'<br>State:'+req.body.state+'<br>City:'+req.body.city+'<br>Query:'+req.body.query,
    };
    transporter.sendMail(mailOpts, (sendErr, info)=>{
      if(sendErr){
        console.log(sendErr);
        return res.status(500).json({message: 'Something went wrong! Please try again later.'});
      }
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify(message= 'success'));
    });
  }
};
