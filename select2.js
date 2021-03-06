
var async = require('async');
var oracledb = require('oracledb');
var dbConfig = require('dbconfig');

// Oracledb properties are applicable to all connections and SQL
// executions.  They can also be set or overridden at the individual
// execute() call level

// fetchArraySize can be adjusted to tune the internal data transfer
// from the Oracle Database to node-oracledb.  The value does not
// affect how, or when, rows are returned by node-oracledb to the
// application.  Buffering is handled internally by node-oracledb.
// Benchmark to choose the optimal size for each application or query.
//
// oracledb.fetchArraySize = 100;  // default value is 100

// This script sets outFormat in the execute() call but it could be set here instead:
//
// oracledb.outFormat = oracledb.OBJECT;

var doconnect = function(cb) {
  oracledb.getConnection(
    {
      user          : dbConfig.user,
      password      : dbConfig.password,
      connectString : dbConfig.connectString
    },
    cb);
};

var dorelease = function(conn) {
  conn.close(function (err) {
    if (err)
      console.error(err.message);
  });
};

// Default Array Output Format
var doquery_array = function (conn, cb) {
  conn.execute(
    "SELECT location_id, city FROM locations WHERE city LIKE 'S%' ORDER BY city",
    function(err, result) {
      if (err) {
        return cb(err, conn);
      } else {
        console.log("----- Cities beginning with 'S' (default ARRAY output format) --------");
        console.log(result.rows);
        return cb(null, conn);
      }
    });
};

// Optional Object Output Format
var doquery_object = function (conn, cb) {
  conn.execute(
    "SELECT location_id, city FROM locations WHERE city LIKE 'S%' ORDER BY city",
    {}, // A bind variable parameter is needed to disambiguate the following options parameter
    // otherwise you will get Error: ORA-01036: illegal variable name/number
    { outFormat: oracledb.OBJECT }, // outFormat can be OBJECT or ARRAY.  The default is ARRAY
    function(err, result) {
      if (err) {
        return cb(err, conn);
      } else {
        console.log("----- Cities beginning with 'S' (OBJECT output format) --------");
        console.log(result.rows);
        return cb(null, conn);
      }
    });
};

async.waterfall(
  [
    doconnect,
    doquery_array,
    doquery_object
  ],
  function (err, conn) {
    if (err) { console.error("In waterfall error cb: ==>", err, "<=="); }
    if (conn)
      dorelease(conn);
  });
