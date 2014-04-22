// Helpers

// Highlight via prism.js
function highlight (element) {
	Prism.highlightElement(element);
}

// Escape HTML entities
function escape (string) {
	return string.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
}

// Function used to output logs into both sandbox & console
function logging_function (...msgs) {
	console.log(...msgs);

	let sandbox = document.getElementById(this.dataset.sandbox);
	if (!sandbox) return false;
	
	for (let m of msgs) {
		switch (typeof m) {

		case 'object':
			// Append DOM object
			if ("nodeName" in m) {
				sandbox.appendChild(m);
				break;
			}

			// Append stringified JSON
			try {
				m = JSON.stringify(m
								   // skip recursion for app
								   ,(k,v) => (k === "app" ? undefined : v)
								  )
					.replace(/(\:|\,|\{|\[)/g,'$1 ')
					.replace(/(\]|\})/g,' $1');
			}
			// Stringification failed (cycles in object?)
			catch (ex) {
				m = m.toString();
			}

		default:
			sandbox.insertAdjacentHTML('beforeend', Prism.highlight(m+" ", Prism.languages.javascript));
		}
	}
	sandbox.appendChild(document.createTextNode("\n"));
}

// Markdown-like link parsing 
function linkify (string) {
	return string.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (...rx) => '<a target="_blank" href="'+rx[2]+'">'+rx[1]+'</a>');
}
// Basic markdown parsing
function markdown_basics(string) {
	return linkify(string)
		// Inline code pieces
		.replace(/\`([^\`]+)\`/g, (...rx) => '<code>'+rx[1]+'</code>')
		// New paragraph
		.replace(/\s*\r?\n(\s*\r?\n)+/g, '</p><p>')
		// Doublespace-linebreaks
		.replace(/  \r?\n/g, '<br>\n')
		// Bold typeface
		.replace(/\*([^\*]+)\*/g, (...rx) => '<strong>'+rx[1]+'</strong>');
}
export class DemoExample {
	constructor () {
	}

	// Attach to be rendered into a given element
	render (frame) {
		this.frame = frame;
	}

	// Adds info/documentation text
	addText(contents) {
		if (!this.frame) return console.error(this,'Not assigned to render element.');
	
		console.debug("Text: ", contents);

		let e = document.createDocumentFragment();

		markdown_basics(contents).split('</p><p>').forEach((contents) => {
			let p = document.createElement('p');
				p.innerHTML = contents;
				e.appendChild(p);
		});

		this.frame.appendChild(e);
	}

	// Adds syntax-highlighted source code
	addCode(source, type = "markup") {
		if (!this.frame) return console.error(this,'Not assigned to render element.');

		console.debug("Demo: ", type, source);

		let e = document.createElement('pre'),
			code = document.createElement('code');
			code.className = 'language-'+type;
			code.innerHTML = escape(source);

			e.appendChild(code);

		this.frame.appendChild(e);
		highlight(code);
	}

	// Adds syntax-highlighted, runnable JS source code
	addDemoCode(source, exec) {
		if (!this.frame) return console.error(this,'Not assigned to render element.');

		console.debug("Code: ",source, exec);

		// Demo code source
		let e = document.createElement('pre'),
			code = document.createElement('code');
			code.className = "language-javascript";
			code.innerHTML = escape(source);

			e.appendChild(code);

		this.frame.appendChild(e);
		highlight(code);

		// Code to be executed and log output
		let sbid = 'sandbox_'+(new Date()).getTime();
		let sandbox = document.createElement('pre');
			sandbox.id = sbid;
			sandbox.className = 'sandbox language-clike';

		let launchbtn = document.createElement('button');
			launchbtn.textContent = "Run\u2026";
			launchbtn.dataset.sandbox = sbid;

		// Launch/reset button event listener
		launchbtn.addEventListener('click',(e) => {
			let btn = e.target;

			// Start and execute
			if (!btn.dataset.started) {
				btn.dataset.started = 'started';
				btn.textContent = "Reset";

				// Execute callback
				exec({ log: logging_function.bind(btn) });

			// Reset to be ran again
			} else {
				btn.dataset.started = '';
				btn.textContent = "Run\u2026";

				// Reset log
				document.getElementById(btn.dataset.sandbox).innerHTML = '';
			}
		});
	
		this.frame.appendChild(sandbox);
		this.frame.appendChild(launchbtn);
	}

	// Outputs a new logline
	//log(messages...)
	//clearLog() {}

}