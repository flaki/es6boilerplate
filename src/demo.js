export class Demo {
	constructor () {
		this.examples = [];
		this.labels = {};

		// Initialize back button in Header
		document.querySelector('header > button').addEventListener('click', (e) => {
			// Currently in subpage
			if (document.body.dataset.page) {
				// Switch back to main
				delete document.body.dataset.page;
				// Remove active page marker
				document.querySelector('article.active').classList.remove('active');
			}
		});
	}

	// Add a new demo group
	addDemoGroup(group) {
		let element = document.createElement('h2');
			element.textContent = group;

		document.querySelector('main').appendChild(element);
	}


	// Load a new demo
	addDemo(example) {
		// Destructuring assignment, equals:
		// var group = example.group, title = example.title;
		var {group, title} = example;
		// Object property shortcut notation, equals:
		//   { title: title, group: group, example: example ... }
		var label = (group?group.toLowerCase()+'_':'') + title.replace(/\s+/,'_').toLowerCase();
		this.examples.push({ title, group, example, label });
		this.labels[label] = this.examples.length - 1;
		// TODO: use a Map instead

		console.log('Added new example ('+label+'): ', example);

		// Render example
		let element = document.createElement('article');
			element.id = label;

		example.render(element);
		document.body.appendChild(element);

		// Add demo to main screen
		let launcher = document.createElement('button');
			launcher.textContent = (group?group.toUpperCase()+': ':'') + title;
			launcher.addEventListener('click',() => this.activate(label));

		document.querySelector('main').appendChild(launcher);
	}

	// Activate specified example
	activate(label) {
		// Update header texts
		var { group, title } = this.examples[this.labels[label]];
		document.querySelector('header > .sub.group').textContent = group;
		document.querySelector('header > .sub.title').textContent = title;

		// Set active page
		document.querySelector('article#'+label).classList.add('active');

		// Add on-body active page marker 
		document.body.dataset.page = label;
	}
	
	// Deactivate example, return to home screen
	home() {}
}
