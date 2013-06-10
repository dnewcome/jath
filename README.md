# About
Jath is a template language that lets you declaratively transform XML documents into
Javascript objects using JSON markup and XPath selectors. The idea is to write
some JSON markup that looks like the object that you want to end up with, and then
add XPath selectors to tell Jath where the data should come from.

# Synopsis

**Turn:**

	<statuses userid="djn">
		<status id="1">
			<message>Hello</message>
		</status>
		<status id="3">
			<message>Goodbye</message>
		</status>
	</statuses>

**into:**

	[ 
		{ id: "1", message: "Hello" }, 
		{ id: "3", message: "Goodbye" } 
	]

**using:**

	var xml = <your AJAXy call here>;
	var template = [ "//status", { id: "@id", message: "message" } ];
	var result = Jath.parse( template, xml );

Check out samples.html for more examples.

# Example
Say we were parsing an XML stream of status updates from a service
like Twitter. The data might look something like this:

	<statuses userid="djn">
		<status id="1">
			<message>Hello</message>
		</status>
		<status id="3">
			<message>Goodbye</message>
		</status>
		<status id="5">
		</status>
	</statuses>

We want to consume this data on the client in Javascript. Let's start with
a template that will create our status object. We want to have the id and the
message as attributes of the object, so we start like this:

	var template = { id: "", message: "" };

When Jath processes a template, the field names 'id' and 'message' will be used
to hold the data in the resulting Javascript objects. Now that we have described
the result format, we need to select where the data comes from. This is where
XPath comes in. Relative to the <status> tag, the XPath selector for the id is 

	@id

and the selector for the message is simply

	message

So, let's add that to the template:

	var template = { id: "@id", message: "message" };

We could tell Jath to process this template as-is, but to be really useful to us
we want it to process all of the statuses and return them to us as an array. The
array template form in Jath is an array literal with one small difference: the 
first element of the array is the XPath selector that returns the collection that
the array will hold. The second element is the array item template. 

So to get the statuses in our example we want to use an XPath selector such as

	//status

giving us a template in the form of 

	var template = [ "//status", { ... } ];

We already know what our item template looks like, so let's insert into the array
template form

	var template = [ "//status", { id: "@id", message: "message" } ];

Processing the template looks like this

	Jath.parse( template, xml )

where xml is an XML document as a Firefox XML DOM object. The resulting Javascript
array, expressed in JSON, would look something like the following

	var result = [ { id: "1", message: "Hello" }, { id: "3", message: "Goodbye" }, ... ];

Jath does not support anything other than string data right now, hopefully
that will change soon.

Literal content may be added to the template by prefixing the value with a semicolon. For example:

    var template [ "//status", { id: "@id", message: ":literaldata" } ];

The character used to denote literal data can be changed by assigning a different value to:
    
    JSON.literalChar

Only a single character may be used to denote a literal.

## XML Namespaces

Often more complex XML documents will define [namespaces](http://www.w3.org/TR/REC-xml-names/) to qualify element tag names. When performing Jath queries on namespaced documents you should [implement a namespace resolver](https://developer.mozilla.org/en/Introduction_to_using_XPath_in_JavaScript#Implementing_a_Default_Namespace_Resolver). Once a namespace resolver has been defined it can be set on Jath as follows:

    Jath.resolver = myResolver

### Implementing a Namespace Resolver

There are two ways to implement XPath namespace resolvers:

1. write a function that takes a namespace prefix as an argument and returns the namesace uri:

```javascript
    Jath.resolver = function(prefix) {
    	if(prefix === "foo") {
    		return "http://beebop.com/"
    	}
    	if(prefix === "bar") {
    		return "http://rocksteady.com/"
    	}
    }
```

2. use the `dom.createNSResolver()` method. As an argument this element takes a dom node containing namespace definitions. For example consider the following xml doc:

```xml
<labels xmlns="http://example.com" xmlns:lbl="http://example.com/labelns">
  <lbl:label id='ep' added="2003-06-10">
    <name>Shredder</name>
    <dimension>X</dimension>
  </lbl:label> 
</labels>  
```

then the resolver could be defined as follows:

    Jath.resolver = document.createNSResolver(document.documentElement)
    
### Default Namespaces

XPath does not tolerate non-null default namespaces. For example:

```xml
<labels xmlns="http://teenage.com" >
  <label id='ep' added="2003-06-10">
    <name>Shredder</name>
    <dimension>X</dimension>
  </label> 
</labels>
```

One way to get this working is to manually define a default namespace prefix and write a resolver that returns the default namespace uri in response to it:

```javascript
Jath.resolver = function(prefix) {
  if(prefix === "dlt") {
    return "http://teenage.com"
  }
}
```

and then prefix your elements with this default prefix in Jath queries:

    Jath.parse( {turtle: "//dlt:name"}, dom )

# Status
This software is still evolving. There are likely cases that it cannot handle, so 
file a feature request in github if there is something you think it should do.

# Supported environments
Jath fully supports Node.js, Firefox, Safari, Chrome and Windows Script Host. IE and Opera are mostly supported.
More test coverage would help here.

# Limitations

- No support for dates or numeric types

# License
Jath is provided under the MIT free software license. See the file LICENSE for 
the full text.
