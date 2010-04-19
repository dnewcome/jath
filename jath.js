/**
* Jath is free software provided under the MIT license.
*	See LICENSE file for full text of the license.
*	Copyright 2010 Dan Newcome.
*/

(function() {

Jath = {};
Jath.parse = parse;

/**
* parse: 
*	process xml doc according to the given json template
*	@template - output spec as a json template
*	@xmldoc - input xml document
*	@node - the starting node to use in the document. xpath
*		expressions will be evaluated relative to this node.
*		If not given, root will be used.
*/
function parse( template, xmldoc, node ) {
	if( node === undefined ) {
		node = xmldoc;
	}
	if( typeOf( template ) === 'array' ) {
		return parseArray( template, xmldoc, node );
	}
	else if( typeOf( template ) === 'object' ) {
		return parseObject( template, xmldoc, node );
	}
	else {
		return parseItem( template, xmldoc, node );
	}
}

function parseArray( template, xmldoc, node ) {
	var retVal = [];
	
	if( template[0] != null ) {
		var xpathResult = xmldoc.evaluate( template[0], node, null, XPathResult.ANY_TYPE, null );
		var thisNode;
		while( thisNode = xpathResult.iterateNext() ) {
			retVal.push( parse( template[1], xmldoc, thisNode ) );
		}
	}
	// we can have an array output without iterating over the source
	// data - in this case, current node is static 
	else {
		for( var i=1; i < template.length; i++ ) {
			retVal.push( parse( template[i], xmldoc, node ) );
		}
	}
	
	return retVal;
}

function parseObject( template, xmldoc, node ) {
	var item;
	var newitem = {};
	for( item in template ) {
		newitem[item] = parse( template[item], xmldoc, node );
	}
	return newitem;
}

function parseItem( template, xmldoc, node ) {
	return xmldoc.evaluate( template, node, null, XPathResult.STRING_TYPE, null ).stringValue;
}

/**
* typeOf function published by Douglas Crockford in ECMAScript recommendations
* http://www.crockford.com/javascript/recommend.html
*/
function typeOf(value) {
	var s = typeof value;
	if (s === 'object') {
		if (value) {
			if (typeof value.length === 'number' &&
					!(value.propertyIsEnumerable('length')) &&
					typeof value.splice === 'function') {
				s = 'array';
			}
		} else {
			s = 'null';
		}
	}
	return s;
}

})();