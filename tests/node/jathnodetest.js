/*
Initial test case for node.js support
run test using node on the commandline:
% node jathnodetest.js
*/

var fs = require('fs');
var xml = require('libxmljs');
var util = require('util');
var jath = require('../../jath');
var html_template = [ "//li", { id: "@id", added: "@added" } ];
var xml_template = [ "//label", { id: "@id", added: "@added" } ];

fs.readFile('labels.xml', 'ascii', function(err, data) {
  var xmlDoc = xml.parseXmlString(data);
  var result = jath.parse(xml_template, xmlDoc);
  util.puts(util.inspect(result, false, 10));
});

fs.readFile('labels.html', 'ascii', function(err, data) {
  var htmlDoc = xml.parseHtmlString(data);
  var result = jath.parse(html_template, htmlDoc);
  util.puts(util.inspect(result, false, 10));
});
