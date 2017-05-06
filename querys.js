'use strcit';
const bittrex = require('node.bittrex.api');
const Poloniex = require('poloniex-api-node');

function* Exchanges(exchanges) {
  var e = exchanges.split(/,/);
  while (e.length != 0)
    yield e.pop();
}

module.exports = 
{
  bittrex: undefined,
  poloniex: undefined,
  exchanges: undefined,
  markets: undefined,

  prepare: function(exstr, mktstr, callback) 
  {
    try {
      module.exports.poloniex = new Poloniex(undefined, undefined);
      module.exports.bittrex = bittrex;
      module.exports.bittrex.options({'baseUrl': 'https://bittrex.com/api/v1.1'});
      module.exports.exchanges = exstr || 'Poloniex,Bittrex';
      module.exports.markets   = mktstr || 'BTC-DASH,BTC-LTC,BTC-ETH';
      callback();
    } catch(err) {
      callback(err);
    }
  },

  chkMarkets: function(exchange, markets, callback)
  {
    var o = {}; o[exchange] = {};

    if (exchange === 'Bittrex') {
      markets.map((i) => 
      {
         module.exports.bittrex.getticker({ market: i}, (data) => 
         {
           o[exchange][i] = data.result; 
           if(Object.keys(o[exchange]).length === markets.length) callback(o);
         });
      });
    } else if (exchange === 'Poloniex') {
      module.exports.poloniex.returnTicker((err, data) => {
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
  },

  update: function(callback)
  {
    var m  = module.exports.markets.split(/,/);
    var c  = module.exports.exchanges.split(/,/).length;
    var iterator = Exchanges(module.exports.exchanges);
    var r = iterator.next();
    var output = {}; 
  
    while(!r.done) {
      module.exports.chkMarkets(r.value, m, (out) => 
      { 
         Object.assign(output ,out);
         if( Object.keys(output).length === c ) callback(output);
      });
      r = iterator.next();
    }
  }  
};
