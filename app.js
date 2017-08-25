var express    = require('express'),
    nodemailer = require('nodemailer'),
    bodyParser = require('body-parser'),
    port    = process.env.PORT || 3000,
  dotenv = require('dotenv'),
  Hubspot = require('hubspot');

dotenv.config();

var hubspot = new Hubspot({ apiKey: process.env.HUBSPOT_API_KEY});
var app     = express(),
    transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/email', function(req, res){
  var mailOptions = {
    from: req.body.name + ' <' + req.body.email + '>',
    to: process.env.GMAIL_USER,
    subject: 'Freelance Website Contact',
    html: '<strong>Freelance Website Contact</strong><br /><p>Name: ' + req.body.name + '</p><br /><p>Email: ' + req.body.email + '</p><br /><p>Phone: ' + req.body.phone + '</p><br /><p>' + req.body.message + '</p>'
  };

  var hubspotOptions = {
    properties: [
      {
        property: 'email',
        value: req.body.email
      },
      {
        property: 'phone',
        value: req.body.phone
      },
      {
        property: 'firstname',
        value: req.body.firstName
      },
      {
        property: 'lastname',
        value: req.body.lastName
      },
      {
        property: 'ip_address',
        value: req.body.info.ip
      },
      {
        property: 'ipcity',
        value: req.body.info.city
      },
      {
        property: 'ipregion',
        value: req.body.info.region
      },
      {
        property: 'iploc',
        value: req.body.info.loc
      },
      {
        property: 'ippostal',
        value: req.body.info.postal
      }
    ]
  };

  hubspot.contacts.create(hubspotOptions).then(results => {
    transporter.sendMail(mailOptions, function(err, response){
      if(err){
        console.log(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  }, err => {
    console.log(err);
    transporter.sendMail(mailOptions, function(err, response){
      if(err){
        console.log(err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });
  });
});

app.get('*', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, function(){
  console.log('This is where the magic happens');
});
