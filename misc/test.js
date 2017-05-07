const Promise = require('bluebird');
var query = require( __dirname + '/querys.js');
var prepare = Promise.promisify(query.prepare);
var compare = Promise.promisify(query.compare);

prepare('Poloniex,Bittrex', 'BTC-DASH,BTC-LTC,BTC-ETH').then( () => {
  query.update((results) => 
  {
    //console.log(JSON.stringify(results, null, 2));
/*
    var output = {};
    Object.keys(results).map( (r) => 
    {
      output[r] = results[r].sort(function(a,b) { return a[1] - b[1]});
      if( Object.keys(output).length == Object.keys(results).length) console.log(JSON.stringify(output, null, 1));
    }); 
*/
    query.compare((output) => 
    {
       Object.keys(output).map((i) => 
       {
          console.log("Market: " + i + ", Best choice: " + output[i][0][0] + ", Price: " + output[i][0][1] + ", Compared to: " + output[i][1][0] + ", Price: " + output[i][1][1]);
       });
    });

  });
})
.catch((err) => { console.log(err);});
