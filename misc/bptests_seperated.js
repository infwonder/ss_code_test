'use strcit';
const bittrex = require('node.bittrex.api');
const Poloniex = require('poloniex-api-node');

var poloniex = new Poloniex(undefined, undefined);
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
         o[exchange][i] = data; 
         if(Object.keys(o[exchange]).length === m.length) callback(o);
       });
    });
  } else if (exchange === 'Poloniex') {
    poloniex.returnTicker((err, data) => {
      m.map((i) => {
        var j = i.replace('-','_');
        o[exchange][i] = data[j];
        if (Object.keys(o[exchange]).length === m.length) callback(o);
      });
  });
    
  } else {
    throw('not supported');
  }
}

chkMarkets('Bittrex', markets, (output) => { console.log(JSON.stringify(output, null, 2)); });
chkMarkets('Poloniex', markets, (output) => { console.log(JSON.stringify(output, null, 2)); });
