var express = require('express');
var router = express.Router();

//******************************************************************************

var PensionChartData = require('./../app/generators/pension-timeseries');
var PensionTableData = require('./../app/generators/pension-tabledata');
var pcd = new PensionChartData();
var ptd = new PensionTableData();


var MortgageChartData = require('./../app/generators/mortgage-timeseries');
var MortgageTableData = require('./../app/generators/mortgage-tabledata');
var mcd = new MortgageChartData();
var mtd = new MortgageTableData();

//******************************************************************************


function handler_tsp(req, res) {

  // TODO - get by type

  var body = req.body;
  var chartData;

  var instrument = body.attributes.instrument;

  switch (instrument) {

    case 'pension':
    case 'isa':

      chartData = pcd.ts(body);
      break;

    case 'mortgage':
    case 'loan':

      chartData = mcd.ts(body);
      break;

    default:
      chartData = pcd.ts(body);
      break;
  }

  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(chartData));
}


function handler_tabledata(req, res) {

  // TODO - get by type

  var tableData;

  var body = req.body;
  var attributes = body.attributes || {};
  var instrument = attributes.instrument || '';

  switch (instrument) {
    case 'pension':
    case 'isa':

      tableData = ptd.td(body);
          break;

    case 'mortgage':
    case 'loan':

      tableData = mtd.td(body);
      break;

    default:

      tableData = ptd.td(body);
          break;
  }

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
