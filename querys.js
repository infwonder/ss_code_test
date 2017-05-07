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
  exchanges: 'Poloniex,Bittrex',
  markets: 'BTC-DASH,BTC-LTC,BTC-ETH',
  init: false,

  prepare: function(callback) 
  {
    if (module.exports.init) return callback();

    try {
      module.exports.poloniex = new Poloniex(undefined, undefined);
      module.exports.bittrex = bittrex;
      module.exports.bittrex.options({'baseUrl': 'https://bittrex.com/api/v1.1'});
      module.exports.init = true;
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
         module.exports.bittrex.getticker({market: i}, (data) => 
         {
           o[exchange][i] = data.result; 
           if(Object.keys(o[exchange]).length === markets.length) callback(null, o);
         });
      });
    } else if (exchange === 'Poloniex') {
      module.exports.poloniex.returnTicker((err, data) => {
        if (err) return callback(err, null);

        markets.map((i) => {
          var j = i.replace('-','_'); o[exchange][i] = {};
          o[exchange][i]['Bid'] = data[j]['highestBid'];
          o[exchange][i]['Ask'] = data[j]['lowestAsk'];
          o[exchange][i]['Last'] = data[j]['last'];
          if (Object.keys(o[exchange]).length === markets.length) callback(null, o);
        });
      });
    } else {
      callback('not supported', null);
    }
  },

  update: function(mktstr, callback)
  {
    module.exports.markets = mktstr;

    var m  = module.exports.markets.split(/,/);
    var c  = module.exports.exchanges.split(/,/).length;
    var iterator = Exchanges(module.exports.exchanges);
    var r = iterator.next();
    var output = {};
  
    while(!r.done) {
      module.exports.chkMarkets(r.value, m, (err, out) => 
      {
         if(err) return callback(err, null);

         Object.assign(output ,out);
         var k = Object.keys(output);
         if( k.length === c ) {
           var redo = {};
           m.map( (f) => {
             redo[f] = []
             k.map( (h) => { redo[f].push( [h, output[h][f]['Ask']] ) });
             if (Object.keys(redo).length === m.length) callback(null, redo);
           });
         }
      });
      r = iterator.next();
    }
  },

  compare: function(mktstr, callback)
  {
    module.exports.markets = mktstr;
    module.exports.update(mktstr, (err, results) =>
    {
      if (err) return callback(err, null);
      //console.log(JSON.stringify(results, null, 2));
      var output = {};
      Object.keys(results).map( (r) =>
      {
        output[r] = results[r].sort(function(a,b) { return a[1] - b[1]});
        if( Object.keys(output).length == Object.keys(results).length) callback(null, output);
      });
    });
  }
};
