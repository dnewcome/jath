
test( "issue16", function() {

	var xml = 
		'<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope">' +
			'<s:Header xmlns:s="http://www.w3.org/2003/05/soap-envelope">' +
			    '<a:Action s:mustUnderstand="1" xmlns:a="http://www.w3.org/2005/08/addressing">http://www.b-i.com/ns/LoyaltyWebservice/IParticipationService/GetAccountDetailsResponse</a:Action>' +
			'</s:Header>' +
			'<s:Body xmlns:s="http://www.w3.org/2003/05/soap-envelope">' +
			    '<GetAccountDetailsResponse xmlns="http://www.b-i.com/ns/LoyaltyWebservice">' +
				'<GetAccountDetailsResult xmlns:i="http://www.w3.org/2001/XMLSchema-instance">' +
				    '<Data i:type="Account">' +
					'<MonthlyLotteryTickets>0</MonthlyLotteryTickets>' +
					'<codes>0</codes>' +
				    '</Data>' +
				    '<Details>Account found</Details>' +
				    '<Result>200</Result>' +
				'</GetAccountDetailsResult>' +
			    '</GetAccountDetailsResponse>' +
			'</s:Body>' + 
		'</s:Envelope>';
	
	var mappings = { 
	    's': 'http://www.w3.org/2003/05/soap-envelope', 
	    'i': 'http://w3.org/2001/XMLSchema-instance',
	    'l':  'http://www.b-i.com/ns/LoyaltyWebservice'
	};
	Jath.resolver = function( prefix ) {
	    return mappings[ prefix ];
	}
  	Jath.namespaces = mappings;

	var template = [ 
		'/s:Envelope/s:Body/l:GetAccountDetailsResponse/l:GetAccountDetailsResult/l:Data', {
			'MonthlyLotteryTickets': 'l:MonthlyLotteryTickets',
			'codes': 'l:codes'
		} 
	];

	var expected = [ {
		"MonthlyLotteryTickets":"0",
		"codes":"0"
	} ];

	var result = Jath.parse( template, createXmlDoc( xml ) );
	console.log( result );
	deepEqual( result, expected );

});


// adapted from 
// http://help.dottoro.com/ljssopjn.php
function createXmlDoc( str ) {
	var xmlDoc = null;
	if( window.ActiveXObject ) {
		xmlDoc = new ActiveXObject( "Microsoft.XMLDOM" );
		xmlDoc.async = false;
		xmlDoc.loadXML( str );
	}
	else if( window.DOMParser ) {
		var parser = new DOMParser();
		xmlDoc = parser.parseFromString( str, "text/xml" );
	} 
	
	return xmlDoc;
}

