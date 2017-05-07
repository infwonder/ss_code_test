const https = require('https');

module.exports =
{
  ticker: function(pair, callback)
  {
     https.get('https://btc-e.com/api/3/ticker/' + pair, (res) => {
       res.on('data', (d) => {
         callback(null,JSON.parse(d.toString()));
       });
     }).on('error', (e) => {
       callback(e, null);
     });
  }
};
