/*
Initial test case for node.js support
run test using node on the commandline:
% node jathnodetest.js
*/

var fs = require('fs');
var xml = require('libxmljs');
var util = require('util');
var jath = require('./jath');
var template = [ "//label", { id: "@id", added: "@added" } ];

fs.readFile('labels.xml', 'ascii', function(err, data) {
  var xmlDoc = xml.parseXmlString(data);
  var result = jath.parse(template, xmlDoc);
  util.puts(util.inspect(result, false, 10));
});
