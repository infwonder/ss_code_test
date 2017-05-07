const Promise = require('bluebird');
const express = require('express');
const http = require("http");

var bodyParser = require('body-parser');
var handlebars = require("express-handlebars")
      .create(
        {
           defaultLayout: 'main',
        });

var app = express();
app.engine('hds', handlebars.engine);
app.set('view engine', 'hds');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function catchedError(response, error)
{
  response.status(500);
  response.render("500", {"error": error});
}

var query = require( __dirname + '/querys.js');
var prepare = Promise.promisify(query.prepare);
var update  = Promise.promisify(query.update);
var compare = Promise.promisify(query.compare);
var chkMarkets = Promise.promisify(query.chkMarkets);

app.get('/', function(request, response, next)
{
  var watching = 'BTC-DASH,BTC-LTC,BTC-ETH,BTC-SJCX,BTC-GNT';
  
  prepare().then(() => {
   // chkMarkets('Bittrex', ['BTC-SJCX','ETH-GNT']).then((results) => { console.log(JSON.stringify(results, null, 2)) });
  
    update(watching).then((results) => {
      compare(watching).then((output) => {
        var o = [];
        Object.keys(output).map((i) => {
/*
           console.log("Market: " + i + ", Best choice: " + 
                        output[i][0][0] + ", Price: " + 
                        output[i][0][1] + ", Compared to: " + 
                        output[i][1][0] + ", Price: " + 
                        output[i][1][1]);
*/
           o.push({ "Market": i, 'Best' : output[i][0][0], [output[i][0][0]]: output[i][0][1], [output[i][1][0]]: output[i][1][1] });
        });

        return o;
      })
      .then((o) => 
      {
         response.render('answer', {list: o});
         console.log(o);
      }).catch((err) => { next(err);});
    }).catch((err) => { next(err);});
  }).catch((err) => { next(err);});
});

app.use(function(error, request, response, next) {
  try {
    setTimeout(() => { response.redirect(303, '/') }, 10000);
  } catch(err) {
    catchedError(response, err);
  }
});

// Start it up!
http.createServer(app).listen(8081);

