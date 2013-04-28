/**
* Temp hack for doing browser check: TODO: implement proper 
* capability checks.
*/
var browser = 'mozilla';

if( navigator.userAgent.toLowerCase().indexOf( 'chrome' ) > -1 ) {
	browser = 'chrome';
}
else if( navigator.userAgent.toLowerCase().indexOf( 'opera' ) > -1 ) {
	browser = 'opera';
}
else if( navigator.userAgent.toLowerCase().indexOf( 'safari' ) > -1 ) {
	browser = 'safari';
}
else if( navigator.userAgent.toLowerCase().indexOf( 'msie' ) > -1 ) {
	browser = 'msie';
}
		
var xmlDoc2 = getXmlDoc( "labels.xml" );
var xmlDocNs2 = getXmlDoc( "labels-ns.xml" );
var xmlDocDefns2 = getXmlDoc( "labels-defns.xml" );

test( "test1", function() 
{
	/**
	tests using XML without namespaces, or more correctly, with
	every element in the null XML namespace
	**/
	

	// test case with an array of simple objects
	var template = [ "//label", { id: "@id", added: "@added" } ];
	var result = Jath.parse( template, xmlDoc2 );
	console.log( JSON.stringify(result) );
	var expected = [ {
	    "id": "ep",
	    "added": "2003-06-10"
	  }, {
	    "id": "tse",
	    "added": "2003-06-20"
	  }, {
	    "id": "lh",
	    "added": "2004-11-01"
	  }, {
	    "id": "co",
	    "added": "2004-11-15"
	  }, {
	    "id": "co",
	    "added": ""
	  }
	];
	deepEqual( result, expected );
});

test( "test2", function() 
{
	// test case with a array of nested objects
	var template2 = [ 
		"//label", { 
			id: "@id", 
			added: "@added", 
			address: { 
				street: "address/street", 
				city: "address/city" 
			}
		} 
	];
	var result = Jath.parse( template2, xmlDoc2 );
	var expected = [ {
	    "id": "ep",
	    "added": "2003-06-10",
	    "address": {
	      "street": "45 Usura Place",
	      "city": "Hailey"
	    }
	  }, {
	    "id": "tse",
	    "added": "2003-06-20",
	    "address": {
	      "street": "3 Prufrock Lane",
	      "city": "Stamford"
	    }
	  }, {
	    "id": "lh",
	    "added": "2004-11-01",
	    "address": {
	      "street": "10 Bridge Tunnel",
	      "city": "Harlem"
	    }
	  }, {
	    "id": "co",
	    "added": "2004-11-15",
	    "address": {
	      "street": "7 Heaven's Gate",
	      "city": "Idoto"
	    }
	  }, {
	    "id": "co",
	    "added": "",
	    "address": {
	      "street": "7 Heaven's Gate",
	      "city": "Idoto"
	    }
	  }
	];
	deepEqual( result, expected );
});

test( "test3", function() 
{
	
	// test case with an array of arrays, the outermost of which
	// simply appears at the output as a container and is not 
	// filled by iteration over the source XML data
	var template3 = [ 
		null,
		[ "//label", "@id" ],
		[ "//address", "province" ]
	];
	var result = Jath.parse( template3, xmlDoc2 );
	var expected = [
	  [
	    "ep",
	    "tse",
	    "lh",
	    "co",
	    "co"
	  ],
	  [
	    "ID",
	    "CT",
	    "NY",
	    "Anambra",
	    "Anambra"
	  ]
	];
	deepEqual( result, expected );
});
				
/**
XML namespace tests
**/

test( "test4", function() {
	// what we were doing before won't work with namespaces

	var template4 = [ "//label", { id: "@id", added: "@added" } ];
	var result = Jath.parse( template4, xmlDocNs2 );
	var expected = [];
	deepEqual( result, expected );
});

test( "test5", function() {
	// prove that things don't work with default namespace
	// however, in IE this works
	var template5 = [ "//label", { id: "@id", added: "@added" } ];
	var result = Jath.parse( template5, xmlDocDefns2 );
	var expected = [];
	deepEqual( result, expected );
});

test( "test6", function() {
	// using different type of xpath query - works with default ns
	var template6 = [ "//*[namespace-uri()='http://example.com' and name()='label']", { id: "@id", added: "@added" } ];
	var result = Jath.parse( template6, xmlDocDefns2 );
	var expected = [
	  {
	    "id": "ep",
	    "added": "2003-06-10"
	  },
	  {
	    "id": "tse",
	    "added": "2003-06-20"
	  },
	  {
	    "id": "lh",
	    "added": "2004-11-01"
	  },
	  {
	    "id": "co",
	    "added": "2004-11-15"
	  }
	];
	deepEqual( result, expected );
});
				
test( "test7", function() {
	// work w/ ns prefixes
	// note name() will be lbl:label, we need local-name() to refer to unprefixed element
	var template7 = [ "//*[namespace-uri()='http://example.com/labelns' and local-name()='label']", { id: "@id", added: "@added" } ];
	var result = Jath.parse( template7, xmlDocNs2 );
	var expected = [
	  {
	    "id": "ep",
	    "added": "2003-06-10"
	  },
	  {
	    "id": "tse",
	    "added": "2003-06-20"
	  },
	  {
	    "id": "lh",
	    "added": "2004-11-01"
	  },
	  {
	    "id": "co",
	    "added": "2004-11-15"
	  }
	];
	deepEqual( result, expected );
});

test( "test8", function() {

	// work with default ns using resolver - you have to use prefix for 
	// resolver to get called (using 'foo'), but resolver doesn't use it.
	setDefaultNSResolver( 'http://example.com' );
	var template8 = [ "//foo:label", { id: "@id", added: "@added" } ];
	var result = Jath.parse( template8, xmlDocDefns2 );
	var expected = [
	  {
	    "id": "ep",
	    "added": "2003-06-10"
	  },
	  {
	    "id": "tse",
	    "added": "2003-06-20"
	  },
	  {
	    "id": "lh",
	    "added": "2004-11-01"
	  },
	  {
	    "id": "co",
	    "added": "2004-11-15"
	  }
	];
	deepEqual( result, expected );
});

test( "test9", function() {
	// using prefixes and our own resolver
	setCustomResolver( { def: 'http://example.com', lbl: 'http://example.com/labelns' } );
	var template9 = [ "//lbl:label", { id: "@id", added: "@added" } ];
	var result = Jath.parse( template9, xmlDocNs2 );
	var expected = [
	  {
	    "id": "ep",
	    "added": "2003-06-10"
	  },
	  {
	    "id": "tse",
	    "added": "2003-06-20"
	  },
	  {
	    "id": "lh",
	    "added": "2004-11-01"
	  },
	  {
	    "id": "co",
	    "added": "2004-11-15"
	  }
	];
	deepEqual( result, expected );
});

test( "test10", function() {
	// test 10 fails on Opera, not sure why yet
	setDefaultResolver( xmlDocNs2 );
	var template10 = [ "//lbl:label", { id: "@id", added: "@added" } ];
	var result = Jath.parse( template10, xmlDocNs2 );
	var expected = [
	  {
	    "id": "ep",
	    "added": "2003-06-10"
	  },
	  {
	    "id": "tse",
	    "added": "2003-06-20"
	  },
	  {
	    "id": "lh",
	    "added": "2004-11-01"
	  },
	  {
	    "id": "co",
	    "added": "2004-11-15"
	  }
	];
	deepEqual( result, expected );
});
			
/**
* Set Jath up with custom resolver using given json object as the 
* prefix lookup map - eg { prefix: "namespace", ... }
*/
function setCustomResolver( mappings ) {
	Jath.resolver = function( prefix ) {
		return mappings[ prefix ];
	}
}
				
/**
* this resolver resolves a given default namespace. Not particularly
* useful since it always returns the same namespace for any given 
* prefix. TODO: delete this function in lieu of extending 
* setCustomResolver to return a default if the prefix is not found, 
* which is effectively what this function is doing.
*/
function setDefaultNSResolver( namespace ) {
	Jath.resolver = function() {
		return namespace;
	};
}

/**
* creates the 'default' Moz resolver - note does not
* resolve default namespaces though. All other prefix mappings will
* be automatically created however.
*/
function setDefaultResolver( xmldoc ) {
	Jath.resolver = xmldoc.createNSResolver( xmldoc );
}	

/**
* Load xml test data from disk
* NOTE: start chrome with --allow-file-access-from-files flag in order to 
* allow reading the test data from disk
*/
function getXmlDoc( filename ) {
	var xmlDoc;
	if( browser == 'chrome' || browser == 'opera' || browser == 'safari' ) {
		xmlDoc = getXmlDocChrome( filename );
	}
	else if( browser == 'msie' ) {
		xmlDoc = getXmlDocIE( filename );
	}
	else if( browser == 'mozilla' ) {
		xmlDoc = getXmlDocMozilla( filename );
	}
	// using mozilla as the default for now
	else {
		xmlDoc = getXmlDocMozilla( filename );
	}
	return xmlDoc;
}

function getXmlDocMozilla( filename ) {
	xmlDoc = document.implementation.createDocument("", "", null);
	xmlDoc.async = false;
	xmlDoc.load( filename );
	return xmlDoc;
}

function getXmlDocChrome( filename ) {
	var xhr = new window.XMLHttpRequest();
	xhr.open( "GET", filename, false );
	xhr.send( null );
	return xhr.responseXML;

}

function getXmlDocIE( filename ) {
	var xmlDoc = new ActiveXObject("MSXML2.DOMDocument.3.0");
	xmlDoc.async = false;
	xmlDoc.setProperty( "SelectionLanguage", "XPath" );
	xmlDoc.resolveExternals = false;
	xmlDoc.load( filename );
	return xmlDoc;
}

