// New app
console.debug('Initializing "demo" app...');
import { Demo } from 'demo';
window.APP = new Demo();


// If you have added a new demo to the /src modules directory, don't forget
// adding it to "demos.json" so it could be loaded during app initialization and
// shows up on the main screen.
// If you have created a new demo group for your demo, make sure you add it as a
// new group, too, also right there.

/*=DEMO_IMPORT=*/


/* Module import code generated is something like this:

	import { example as initExample } from 'mydemogroup/mydemomodule';
	initExample(APP);

*/
