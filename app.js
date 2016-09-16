var express    = require('express'),
    nodemailer = require('nodemailer'),
    bodyParser = require('body-parser'),
    port    = process.env.PORT || 3000,
    stripe = require('stripe')(process.env.STRIPE_KEY || 'sk_test_NotMzbSgSKFGNc2UhNGQNQmt');
    console.log(process.env.STRIPE_KEY);

var app     = express(),
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/email', function(req, res){
  var mailOptions = {
    from: req.body.email.first + ' ' + req.body.email.last + ' <' + req.body.email.email + '>',
    to: process.env.GMAIL_USER,
    subject: 'Personal Website Contact',
    text: req.body.email.message
  };

  transporter.sendMail(mailOptions, function(err, response){
    if(err){
      res.send(500);
    } else {
      res.send(200);
    }
  });
});

app.post('/donation', function(req, res){
  var token = req.body.donation.token;
  var charge = stripe.charges.create({
    amount: (req.body.donation.amount * 100),
    currency: 'usd',
    source: token,
    description: 'Campaign Donation'
  }, function(err, charge){
    if(err){
      console.log(err);
      res.send(500);
    } else {
      res.send(200);
    }
  });
});

app.get('*', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});

app.listen(port, function(){
  console.log('This is where the magic happens');
});
