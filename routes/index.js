var request = require('request');
var http = require('http');
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');


// var bodyParser = require('body-parser');
var app = express();
// app.use(bodyParser());

var dbURL = 'mongodb://localhost:27017/',
    dbName = 'testDB',
    dbCollectionListings = 'listings';

var currentDB;
var listings = [], tags = [], sections = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

// makeRequests
makeDBrequest('/tags', 'tags', 'Tags', 'listings');
makeDBrequest('/listings', 'listings', 'Listings', 'listings');
makeDBrequest('/*', 'sections', 'Sections', 'sections');

function makeDBrequest(path, pageName, pageTitle, collection ){
  // var pageURL = pageURL,
  //     pageName = pageName,
  //     pageTitle = pageTitle,
  //     collection = collection;
  //
  router.get(path, function(req, res) {
    var MongoClient = mongodb.MongoClient;

    MongoClient.connect(dbURL, {useNewUrlParser: true}, function(err, client) {
      console.log(path, pageName, pageTitle, collection );
      if(err) {
        console.log('Unable to connect to Server: ' , err);
      } else {
        console.log('Connection established');
        var db = client.db(dbName);

        db.collection(collection).find({}).toArray(function(err, result){
          if(err){
            res.send(err);
          } else if (result.length) {
            res.render(pageName, {
              title: pageTitle,
              result: result
            });
          } else {
            res.send('No documents found');
          }
          client.close();
        })
      }
    })
  });
}

let limit = 10000;
const ID = 19310367;

function buildApiUrl(q){
  // https://openapi.etsy.com/v2/shops/19310367/listings/active?limit=10000&api_key=98x1v3mp8pf7hh4tyzbs1dv2

  const URLprops = {
          base: 'https://openapi.etsy.com/v2/',
          shopSearch: '/shops/',
          listings: '/listings/active',
          sections: '/sections',
          limit: `limit=${limit}&`,
          includeImages: 'includes=Images&',
          sep: '?'
          }
  const API = 'api_key=98x1v3mp8pf7hh4tyzbs1dv2',
        shopID = ID;

  if (q === 'getListings') {
    return URLprops.base + URLprops.shopSearch + shopID + URLprops.listings + URLprops.sep + URLprops.limit + URLprops.includeImages + API;
  } else if (q === 'getShopCategories') {
    return URLprops.base + URLprops.shopSearch + shopID + URLprops.sections + URLprops.sep + API;
  }
}

request(buildApiUrl('getListings'), function(error, response, body){
  var etsyRes;

  if(error){
    console.log(error);
  } else {
    etsyRes = JSON.parse(body);

    var listArr = etsyRes.results;

    for (var i = 0; i < listArr.length; i++) {
      listings.push(listArr[i]);
    }
    // console.log(i);

    clearDB('listings');
    writeDB('listings', listings);
  }
});

request(buildApiUrl('getShopCategories'), function(error, response, body){
  var etsyRes;

  if(error){
    console.log(error);
  } else {
    etsyRes = JSON.parse(body);

    var listArr = etsyRes.results;

    for (var i = 0; i < listArr.length; i++) {
      sections.push(listArr[i]);
    }

    clearDB('sections');
    writeDB('sections', sections);
  }
});

// http.createServer(function (req, res) {
//
//   res.writeHead(200, {'Content-Type': 'application/json'});
//   res.end(JSON.stringify(etsyRes));
//   // console.log(result);
// }).listen(8080);

function clearDB(dbCollection){
  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(dbURL, function(err, client) {
    if (err) console.log(err);
    var db = client.db(dbName);

    db.collection(dbCollection).drop({useNewUrlParser: true}, function(err, delOK) {
      if (err) console.log(err);
      if (delOK) console.log("Collection deleted");
      client.close();
    });
  });
}
function writeDB(dbCollection, data) {
  var MongoClient = mongodb.MongoClient;

  MongoClient.connect(dbURL, {useNewUrlParser: true}, function(err, client) {
    if (err) console.log(err);
    var db = client.db(dbName);

    db.collection(dbCollection).insertMany(data, function(err, res) {
      if (err) console.log(err);
      console.log("document inserted");
      client.close();
    });
  });
}

module.exports = router;
