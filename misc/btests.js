'use strcit';
const bittrex = require('node.bittrex.api');

bittrex.options({'baseUrl': 'https://bittrex.com/api/v1.1'});

var markets = 'BTC-DASH,BTC-LTC,BTC-ETH';

function chkMarkets(exchange, markets, callback) {
  var m  = markets.split(/,/);
  var o = {}; o[exchange] = {};

  if (exchange === 'Bittrex') {
    m.map((i) => 
    {
       bittrex.getticker({ market: i}, (data) => 
       {
         data.message = i;
         o.Bittrex[i] = data; 
         if(Object.keys(o.Bittrex).length === m.length) callback(o);
       });
    });
  } else {
    throw('not supported');
  }
}

var output = chkMarkets('Bittrex', markets, (data) => { console.log(JSON.stringify(data, null, 2)); });
