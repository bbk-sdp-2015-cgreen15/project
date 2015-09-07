var express = require('express');
var router = express.Router();

//******************************************************************************

var PensionChartData = require('./../app/generators/pension-timeseries');
var PensionTableData = require('./../app/generators/pension-tabledata');
var pcd = new PensionChartData();
var ptd = new PensionTableData();

//******************************************************************************


function handler_tsp(req, res) {

  // TODO - get by type

  var body = req.body;
  var chartData = pcd.ts(body);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(chartData));
}


function handler_tabledata(req, res) {

  // TODO - get by type

  var body = req.body;
  var tableData = ptd.td(body);

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(tableData));
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/app/tst', function(req,res, next) {

  handler_tsp(req, res, next);
});

router.post('/app/tabledata', function(req,res, next) {

  handler_tabledata(req, res, next);
});

module.exports = router;
