'use strict';

const Poloniex = require('poloniex-api-node');
var poloniex = new Poloniex(undefined, undefined);

var markets = 'BTC_DASH,BTC_LTC,BTC_ETH';

function chkMarket(exchange, markets, callback) {
  var m = markets.split(/,/);
  var o = {}; o[exchange] = {};

  poloniex.returnTicker((err, data) => {
    m.map((i) => {
      o[exchange][i] = data[i];
      if (Object.keys(o[exchange]).length === m.length) callback(o);
    });
  });
}

chkMarket('Poloniex', markets, (output) => { console.log(JSON.stringify(output, null, 2)) });
