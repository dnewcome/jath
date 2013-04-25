var xmlDoc = new ActiveXObject("MSXML2.DOMDocument.6.0");

xmlDoc.async = false;
xmlDoc.setProperty( "SelectionLanguage", "XPath" );
xmlDoc.resolveExternals = false;
xmlDoc.load( "..\labels.xml" );

var template = [ "//label", { id: "@id", added: ":added" } ];
var result = Jath.parse( template, xmlDoc );
WScript.Echo( JSON.stringify( result ) );

