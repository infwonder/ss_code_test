'use strict';
var btce = require(__dirname + '/btc-e-pub.js');

var market = 'BTC-ETH,BTC-LTC';

market.split(/,/).map((i) => {
  var mfore = i.toLowerCase().split('-').reverse().join('_'); console.log("Before: " + i + ", After: " + mfore);
  btce.ticker(mfore, (err, data) => 
  {
    if(err) throw(err);
    console.log(data[mfore]);
  });
});
