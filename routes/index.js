var express = require('express');
var path = require('path');

var router = express.Router();
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Server : SG Planifix' });
});

// FIXME: Add PASSPORT JWT AUTHENTICATION.
// /changepwd/:token
router.get('/changepwd', (req,res)=>{
  // req.body.token = req.params.token;
  res.render('resetPassword');
});

module.exports = router;
