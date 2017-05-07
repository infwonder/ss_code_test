const Promise = require('bluebird');
var query = require( __dirname + '/querys.js');
var prepare = Promise.promisify(query.prepare);
var compare = Promise.promisify(query.compare);

query.exchanges = 'Bittrex,Poloniex,BTC-E';
var watching = 'BTC-LTC,BTC-ETH,BTC-DASH';
query.markets = watching;

prepare().then(() => {
  query.update(watching, (results) => 
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
    query.compare(watching, (err, output) => 
    {
       console.log("HERE! " + JSON.stringify(output, null, 2));
       Object.keys(output).map((i) => 
       {
          console.log("Market: " + i + ", Best choice: " 
            + output[i][0][0] + ", Price: " + output[i][0][1] 
            + ", Compared to: " + output[i][1][0] + ", Price: " + output[i][1][1]
            + ", Compared to: " + output[i][2][0] + ", Price: " + output[i][2][1]);
       });
    });

  });
})
.catch((err) => { console.log(err);});
