// this is the test given in the readme
test( "statuses", function() {
	var xml = 
		'<statuses userid="djn">' +
			'<status id="1">' +
				'<message>Hello</message>' +
			'</status>' +
			'<status id="3">' +
				'<message>Goodbye</message>' +
			'</status>' +
		'</statuses>';

	var expected = [ 
		{ id: "1", message: "Hello" }, 
		{ id: "3", message: "Goodbye" } 
	];

	var template = [ "//status", { id: "@id", message: "message" } ];
	var result = Jath.parse( template, createXmlDoc( xml ) );
	deepEqual( result, expected );
} );

test( "fully recursive", function() {

	var xml = 
		'<item name="foo">' +
			'<status code="1" />' +
			'<item name="bar">' +
				'<status code="2" />' +
			'</item>'+
			'<item name="baz">' +
				'<status code="3" />' +
				'<item name="biff">' +
					'<status code="4" />' +
				'</item>' +
			'</item>' +
		'</item>';
	
	var template = [ 'item', { name: '@name', status: 'status/@code' } ];
	template[1].items = template;

	var expected = [
		{"name":"foo","status":"1","items":[
			{"name":"bar","status":"2","items":[]},
			{"name":"baz","status":"3","items":[
				{ "name":"biff","status":"4","items":[]}]}]}
	];

	var result = Jath.parse( template, createXmlDoc( xml ) );
	deepEqual( result, expected );

});

test( "arraylike", function() {
	var xml = 
	'<root>' +
	  '<a>' +
		'<b>123</b>' +
		'<b>456</b>' +
		'<b>789</b>' +
	  '</a>' +
	  '<a>' +
		'<b>foo</b>' +
		'<b>bar</b>' +
	  '</a>' +
	'</root>'; 
	console.log( xml );

	var template = [ '//a', [ 'b', 'text()' ] ];

	var result = Jath.parse( template, createXmlDoc( xml ) );

	var expected = [ ["123","456","789"], ["foo","bar"] ];
	deepEqual( result, expected );
});

// adapted from 
// http://help.dottoro.com/ljssopjn.php
function createXmlDoc( str ) {
	var xmlDoc = null;
	if( window.DOMParser ) {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString( str, "text/xml" );
	} 
	else if( window.ActiveXObject ) {
		xmlDoc = new ActiveXObject( "Microsoft.XMLDOM" );
		xmlDoc.async = false;
		xmlDoc.loadXML( str );
	}
	return xmlDoc;
}

