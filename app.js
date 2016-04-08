var express    = require('express'),
    nodemailer = require('nodemailer'),
    port    = process.env.PORT || 3000;

var app     = express(),
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

app.use(express.static('public'));

app.post('/email', function(req, res){
  var mailOptions = {
    from: req.param
  };

  transporter.sendMail(mailOptions, function(err, response){
    if(err){
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
