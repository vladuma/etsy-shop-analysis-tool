var http = require('http');
var request = require('request');
var express = require('express');
var app = express();

app.listen(3000)

var result;

const baseURL = 'https://openapi.etsy.com/v2/',
      shopSearch = '/shops/',
      shopID = 19310367,
      listings = '/listings/active'
      API = APIKEY;

let URL = baseURL + shopSearch + shopID + listings + API;

request(URL ,function(error, response, body){
  result = JSON.parse(body);
  // console.log();
});

http.createServer(function (req, res) {

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(result));
  // console.log(result);
}).listen(8080);
// console.log(result);
// console.log(global);
