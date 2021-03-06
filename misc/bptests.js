'use strcit';
const bittrex = require('node.bittrex.api');
const Poloniex = require('poloniex-api-node');

var poloniex = new Poloniex(undefined, undefined);
bittrex.options({'baseUrl': 'https://bittrex.com/api/v1.1'});

function* Exchanges(exchanges) {
  var e = exchanges.split(/,/);
  while (e.length != 0)
    yield e.pop();
}

function chkMarkets(exchange, markets, callback) {
  var o = {}; o[exchange] = {};

  if (exchange === 'Bittrex') {
    markets.map((i) => 
    {
       bittrex.getticker({ market: i}, (data) => 
       {
         o[exchange][i] = data.result; 
         if(Object.keys(o[exchange]).length === markets.length) callback(o);
       });
    });
  } else if (exchange === 'Poloniex') {
    poloniex.returnTicker((err, data) => {
      markets.map((i) => {
        var j = i.replace('-','_'); o[exchange][i] = {};
        o[exchange][i]['Bid'] = data[j]['highestBid'];
        o[exchange][i]['Ask'] = data[j]['lowestAsk'];
        o[exchange][i]['Last'] = data[j]['last'];
        if (Object.keys(o[exchange]).length === markets.length) callback(o);
      });
    });
  } else {
    throw('not supported');
  }
}

function update(exchanges, markets, callback) {
  var m  = markets.split(/,/);
  var c  = exchanges.split(/,/).length;
  var iterator = Exchanges(exchanges);
  var r = iterator.next();
  var output = {}; 
  
  while(!r.done) {
    chkMarkets(r.value, m, (out) => 
    { 
       Object.assign(output ,out);
       if( Object.keys(output).length === c ) callback(output);
    });
    r = iterator.next();
  }
}

var markets = 'BTC-DASH,BTC-LTC,BTC-ETH';
var exchanges = 'Bittrex,Poloniex';

update(exchanges, markets, (result) => { console.log(JSON.stringify(result, null, 2)) });
