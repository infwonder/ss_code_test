const Promise = require('bluebird');
const express = require('express');
const http = require("http");
const bn   = require("bignumber.js");

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
  var watching = 'BTC-DASH,BTC-LTC,BTC-ETH';
  var totalbtc = 20;  

  prepare().then(() => {
   // chkMarkets('Bittrex', ['BTC-SJCX','ETH-GNT']).then((results) => { console.log(JSON.stringify(results, null, 2)) });
  
    update(watching).then((results) => {
      compare(watching).then((output) => {
        var o = [];
        var g = Object.keys(output);
        var c = new bn(totalbtc);
        var d = new bn(g.length);
        g.map((i) => {
           var a = new bn(output[i][1][1]);
           var b = new bn(output[i][0][1]);
           o.push({ 
                    "Market": i, 
                    "Best" : output[i][0][0], 
                    [output[i][0][0]]: output[i][0][1], 
                    [output[i][1][0]]: output[i][1][1], 
                    "Diff": (a.minus(b)).times(c.dividedBy(d)).toFixed(8)
                  });
        });

        return o;
      })
      .then((o) => 
      {
         response.render('answer', {list: o});
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

