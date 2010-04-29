/*
Initial test case for node.js support
run test using node on the commandline:
% node jathnodetest.js

var xml = require('/home/dannimda/jath/libxmljs');
var sys = require('sys');
var jath = require('/home/dannimda/jath/jathnode');
var template = [ "//label", { id: "@id", added: "@added" } ];
var testFile = xml.parseXmlFile('labels.xml');

var result = jath.parse( template, testFile );

sys.puts( sys.inspect( result, false, 10 ) );
