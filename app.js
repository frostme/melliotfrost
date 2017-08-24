var express    = require('express'),
    nodemailer = require('nodemailer'),
    bodyParser = require('body-parser'),
    port    = process.env.PORT || 3000,
  dotenv = require('dotenv');

dotenv();

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
    from: req.body.name + ' <' + req.body.email + '>',
    to: process.env.GMAIL_USER,
    subject: 'Freelance Website Contact',
    html: '<strong>Freelance Website Contact</strong><br /><p>Name: ' + req.body.name + '</p><br /><p>Email: ' + req.body.email + '</p><br /><p>Phone: ' + req.body.phone + '</p><br /><p>' + req.body.message + '</p>'
  };

  transporter.sendMail(mailOptions, function(err, response){
    console.log(err);
    if(err){
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.get('*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function(){
  console.log('This is where the magic happens');
});
