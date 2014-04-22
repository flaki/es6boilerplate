import { DemoExample } from 'demoexample';

const DEMO_GROUP = 'es6';
const DEMO_TITLE = 'Arrow functions';

class ES6ArrowsDemo extends DemoExample {

	constructor (app) {
		this.app = app;
		this.group = DEMO_GROUP;
		this.title = DEMO_TITLE;

		// Add to the list of examples
		this.app.addDemo(this);
	}

	// Render example
	render (element) {
		super(element);

this.addText(`<h1>ECMAScript 6 arrow functions</h1>
*Docs*:
 [Strawman](http://wiki.ecmascript.org/doku.php?id=harmony:arrow_function_syntax) &middot;
 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/arrow_functions)  
*Native support*:
 [Firefox 22+](https://developer.mozilla.org/en-US/docs/Web/JavaScript/ECMAScript_6_support_in_Mozilla) &middot;
 [Firefox OS 1.2+](https://developer.mozilla.org/en-US/Firefox_OS/Releases/1.2)

Arrow functions in EcmaScript 6 have their roots in C# and ar the the native equivalent of [CoffeeScript
"fat arrow"](http://coffeescript.org/#fat-arrow) function declarations.

Basic syntax: \`args *=>* function_body\`

<h3>So, what are the advantages of using arrow functions?</h3>

They are shorter, more conscise and readable than traditional function declarations:
`);
this.addCode(`// Instead of writing
function(arg) { return arg.prop }

// ..all you need to type is
arg => arg.prop

// Such as:
var f = x => x+1;

// ..is the equivalent of
var f = function (x) { return x+1 };

// ..empty argument lists are supported, too:
var empty = () => 'empty args list';

// ..and, of course, lenghtier function bodies & multiple arguments:
var longer = (x, y) => {
	if (x == y) return 'It's a tie - <x> equals <y>.';
	if (x > y) return 'Yay, <x> wins!';
	return 'There you go, <y> is the man!';
};
`,'javascript');


this.addText(`A useful perk of arrow functions, is that they're inherently bound by default
(their \`this\` is lexically scoped, independent of the object the function is called on):

Normally, the value of the \`this\` property inside an executing functin is dynamic - it depends on what object the function was called on (or the global object/\`undefined\` in cases where the function is not called as a method - read more about the [value of the \`this\` property on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)).

Pre-ES6, you could manipulate the \`this\` property via the function's \`call(thisvalue)\`/\`apply(thisvalue)\` method calls, by setting it to the desired \`this\` value just before calling the function itself.  
Since ES5, you can use the [\`Array.prototype.bind()\`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) call to permanently fix the \`this\` value of a particular function to a value specified by you, regardless of the calling environment. Function that are "locked' on to a specific this value are called bound functions.

Arrow functions do something quite similar to this latter case, as they do not have their own \`this\` property, but are 'bound' to the active \`this\` value of the enclosing scope (=of the function object has been defined in).`);

this.addDemoCode(`// Traditional function declaration
var func = function () { console.log(this, this && this.name); };

// Traditional method declaration
var es5obj = {
    name: 'ES5',
    method: function () { console.log(this, this && this.name); }
};

// ES6 arrow syntax function declaration
var es6obj = {
    name: 'ES6',
    method: () => { console.log(this, this && this.name); }
};

// Call the named function directly
// Logs: undefined "" ("this" is undefined for direct invocations, *see note)
func();

// Logs: es5obj "ES5"
es5obj.method();

// Logs: "undefined" since the arrow function is bound to the current outer scope (which is undefined)
es6obj.method();

// Logs: es6obj "ES6" as the method call will now act on the specified object (es6obj) as its this-value
es5obj.method.call(es6obj);

// Logs: "undefined" as the arrow function remains bound to the active scope of its declaration, and can not be overridden
es6obj.method.call(es5obj);

// The bound function below, on the other hand, will act pretty much alike the arrow function above
var bound_es5obj = {
    name: 'Bound ES5',
    method: (function () { console.log(this, this && this.name); }).bind(this)
};

// Logs: undefined "" for both calls, as the function is already bound to the enclosing this value, and can not be overridden
console.log('Bound: ', bound_es5obj);
bound_es5obj.method();
bound_es5obj.method.call(es6obj);
`,
	console => this.thisBindExample(console)
);

this.addText(`<strong>* NOTE: </strong> <em>Note that this only holds in strict mode
(and thus, the implicitly strict module code, in traditional script context this in
such calls refers to the global object (eg.: window)).</em>`);


this.addText(`<h3>Arrow functions are great for:</h3>

*Callbacks*:`);
	
	
this.addDemoCode(`// They are great for quick, short callbacks for library functions:

// Convert all numbers in a string to hexa form
let hexMe = "ab 123 cd 34 efgh 576 k";
console.log(hexMe.replace(/\d+/g, n => "0x"+Number(n).toString(16) ));

// Sort by object id
let sortMe = [
	{ id: "M38D2LDJ", name: "Fish" },
	{ id: "B59C7123", name: "Spaghetti" },
	{ id: "0014ACX5", name: "Book" },
	{ id: "HDU27JEN", name: "Toy" },
];
console.log(sortMe.sort( (a,b) => a.id.localeCompare(b.id) ));

// Create cubic sum
let cubsumMe = [ 4, 2, 3 ];
console.log(cubsumMe.reduce( (prev,current) => prev+current*current , 0));
`,
	console => this.callbackExample(console)
);


this.addText(`*Event listeners*:`);
this.addDemoCode(`// Create a new button to attach the event listener to
let button = document.createElement('button');

button.textContent = 'Click me!';
button.addEventListener('click', e => {
	console.log('Clicked button:');

	// "this" no longer represents the element the event was fired on but is instead, undefined ( = matches the "this" of the enclosing scope)
	console.log('value of this: ', this);

	// to access the event target, use the event argument
	console.log('event target: ', e.target);
});

document.body.appendChild(button);
`,
	console => this.eventListenerExample(console)
);


this.addText(`*Promise handlers:*`);
this.addDemoCode(`// Let's see when the AppSkeleton repo was last updated via an AJAX call to the CORS-enabled GitHub v3 REST API and create a new Promise for the result
var P = new Promise( (resolve, reject) => {
	var xhr = new XMLHttpRequest();

	// Query the repo information using api.github.com
	xhr.open('GET', 'https://api.github.com/repos/flaki/es6boilerplate', true);
	xhr.onreadystatechange = () => {
		// Wait until request completes
		if (xhr.readyState != 4) return;

		// HTTP error
		if (xhr.status != 200) {
			return reject(new Error('XHR failed: HTTP/' + xhr.status));
		}

		// Success!
		try {
			resolve(new Date(JSON.parse(xhr.responseText).updated_at));
		}
		// JSON/Date parse error, or general malformed JSON error
		catch (ex) {
			reject(ex);
		}
	};

	console.log('[flaki/es6boilerplate] Querying GitHub API for repo info...');
	xhr.send();
});

P.then(
	result => console.log('Current local time at Mozilla HQ: ', result.toLocaleString())
).catch(
	exception => console.log('Failed: ', exception)
);
`,(console) => {
	this.promiseExample(console).then(
		result => console.log('The AppSkeleton was last updated @', result.toLocaleString())
	).catch(
		exception => console.log('Failed:', exception)
	);
});


this.addText(`
<h2>[Help expand the demo...](https://github.com/flaki/es6boilerplate)</h2>
...eg. by adding:

&bull; more demos for useful use cases  
&bull; anything else you feel like worth mentioning here
`);
}//end of: render

	thisBindExample(console) {
		(function () {
			// Traditional function declaration
			var func = function () { console.log(this, this && this.name); };

			// Traditional method declaration
			var es5obj = {
				name: 'ES5',
				method: function () { console.log(this, this && this.name); }
			};

			// ES6 arrow syntax function declaration
			var es6obj = {
				name: 'ES6',
				method: () => { console.log(this, this && this.name); }
			};

			// Call the named function directly
			// Logs: undefined "" ("this" is undefined for direct invocations, see note)
			func();

			// Logs: es5obj "ES5"
			es5obj.method();

			// Logs: undefined "" since the arrow function is bound to the
			// current outer scope (which is undefined)
			es6obj.method();

			// Logs: es6obj "ES6" as the method call will now act on the
			// specified object (es6obj) as its this-value
			es5obj.method.call(es6obj);

			// Logs: undefined "" as the arrow function remains bound
			// to the active scope of its declaration, and can not be overridden
			es6obj.method.call(es5obj);

			// The bound function below, on the other hand, will act pretty
			// much alike the arrow function above
			var bound_es5obj = {
				name: 'Bound ES5',
				method: (function () { console.log(this, this && this.name); }).bind(this)
			};

			// Logs: undefined "" for both calls, as the function is already bound
			// to the enclosing this value, and can not be overridden
			console.log('Bound: ', bound_es5obj);
			bound_es5obj.method();
			bound_es5obj.method.call(es6obj);
		})();
	}

	callbackExample(console) {
		// They are great for quick, short callbacks for library functions:

		// Convert all numbers in a string to hexa form
		let hexMe = "ab 123 cd 34 efgh 576 k";
		console.log(hexMe.replace(/\d+/g, n => "0x"+Number(n).toString(16) ));

		// Sort by object id
		let sortMe = [
			{ id: "M38D2LDJ", name: "Fish" },
			{ id: "B59C7123", name: "Spaghetti" },
			{ id: "0014ACX5", name: "Book" },
			{ id: "HDU27JEN", name: "Toy" },
		];
		console.log(sortMe.sort( (a,b) => a.id.localeCompare(b.id) ));

		// Create cubic sum
		let cubsumMe = [ 4, 2, 3 ];
		console.log(cubsumMe.reduce( (prev,current) => prev+current*current , 0));
	}

	eventListenerExample(console) {
		// Create a new button to attach the event listener to
		let button = document.createElement('button');

		button.textContent = 'Click me!';
		button.addEventListener('click', e => {
			console.log('Clicked button:');

			// "this" no longer represents the element the event was fired on
			// but is instead, undefined ( = matches the "this" of the enclosing
			// scope)
			console.log('value of this: ', this );

			// to access the event target, use the event argument
			console.log('event target: ', e.target.toString() );
		});
			
		console.log(button);
	}
	promiseExample(console) {
		// Let's see when the AppSkeleton repo was last updated via an AJAX call
		// to the CORS-enabled GitHub v3 REST API and create a new Promise
		// for the result
		var P = new Promise( (resolve, reject) => {
			var xhr = new XMLHttpRequest();

			// Query the repo information using api.github.com
			xhr.open('GET', 'https://api.github.com/repos/flaki/es6boilerplate', true);
			xhr.onreadystatechange = () => {
				// Wait until request completes
				if (xhr.readyState != 4) return;

				// HTTP error
				if (xhr.status != 200) {
					return reject(new Error('XHR failed: HTTP/' + xhr.status));
				}

				// Success!
				try {
					resolve(new Date(JSON.parse(xhr.responseText).updated_at));
				}
				// JSON/Date parse error, or general malformed JSON error
				catch (ex) {
					reject(ex);
				}
			};

			console.log('[flaki/es6boilerplate] Querying GitHub API for repo info...');
			xhr.send();
		});

		// returns the promise
		return P;
	}
	activate () {
	}
	reset () {
	}

}


// Create example instance
export function example(Demo) {
	return new ES6ArrowsDemo(Demo);
}