const https = require('https');

var market = 'BTC-ETH';
var mtoe   = market.toLowerCase().split('-').reverse().join('_');

https.get('https://btc-e.com/api/3/ticker/' + mtoe, (res) => {
  console.log('statusCode:', res.statusCode);
  console.log('headers:', res.headers);

  res.on('data', (d) => {
    process.stdout.write(d);
  });

}).on('error', (e) => {
  console.error(e);
});

