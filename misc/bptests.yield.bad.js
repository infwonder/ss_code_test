'use strcit';
const bittrex = require('node.bittrex.api');
const Poloniex = require('poloniex-api-node');

var poloniex = new Poloniex(undefined, undefined);
bittrex.options({'baseUrl': 'https://bittrex.com/api/v1.1'});

var markets = 'BTC-DASH,BTC-LTC,BTC-ETH';
var exchanges = 'Bittrex,Poloniex';

function* Exchanges(exchanges) {
  var e = exchanges.split(/,/);
  while (e.length != 0)
    yield e.pop();
}

function chkMarkets(exchanges, markets, callback) {
  var m  = markets.split(/,/);
  var o = {}; 
  var iterator = Exchanges(exchanges);
  var r = iterator.next();
 
  while (r) {
    o[r.value] = {};

    if (r.value === 'Bittrex') {
      m.map((i) => 
      {
         bittrex.getticker({ market: i }, (data) => 
         {
           o[r.value][i] = data; 
         });
      });
    } else if (r.value === 'Poloniex') {
      poloniex.returnTicker((err, data) => {
        m.map((i) => {
          var j = i.replace('-','_');
          o[r.value][i] = data[j];
        });
      });
    } else if (r.value === null){
      callback(o);
    }

    r = iterator.next();

  }
}


chkMarkets(exchanges, markets, (output) => { console.log(JSON.stringify(output))});
