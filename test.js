const Promise = require('bluebird');
var query = require( __dirname + '/querys.js');
var prepare = Promise.promisify(query.prepare);

prepare('Poloniex,Bittrex', 'BTC-DASH,BTC-LTC,BTC-ETH').then( () => {
  query.updateAll((results) => 
  {
    //console.log(JSON.stringify(results, null, 2));
    var output = {};
    Object.keys(results).map( (r) => 
    {
      output[r] = results[r].sort(function(a,b) { return a[1] - b[1]});
      if( Object.keys(output).length == Object.keys(results).length) console.log(JSON.stringify(output, null, 2));
    }); 

  });
})
.catch((err) => { console.log(err);});
