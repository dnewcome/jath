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

/*
test( "fixed recursive", function() {

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
	
	// var template = [ 'item', { name: '@name', items: [ 'item', { name: '@name' } ] } ];
	
	var ttemplate = [ 'item', { name: '@name', items: [] } ];
	var template1 = [ 'item', { name: '@name', items: ttemplate } ];
	var template = [ 'item', { name: '@name', items: template1 } ];

	var result = Jath.parse( template, createXmlDoc( xml ) );


});
*/

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
	
	// var template = [ 'item', { name: '@name', items: '+template' } ];
	var template = [ 'item', { name: '@name', status: 'status/@code' } ];
	template[1].items = template;

	var result = Jath.parse( template, createXmlDoc( xml ) );
	console.log( result );

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

