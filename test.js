const Promise = require('bluebird');
var query = require( __dirname + '/querys.js');
var prepare = Promise.promisify(query.prepare);

prepare('Poloniex,Bittrex', 'BTC-DASH,BTC-LTC,BTC-ETH').then( () => {
  query.updateAll((results) => 
  {
    console.log(JSON.stringify(results, null, 2)); 
  });
})
.catch((err) => { console.log(err);});
