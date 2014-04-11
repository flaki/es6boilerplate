import { DemoExample } from 'demoexample';

const DEMO_GROUP = 'webapi';
const DEMO_TITLE = 'Geolocation';

class GeolocationDemo extends DemoExample {

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

this.addText("Geolocation example...");
this.addText("Based on the [MDN](https://developer.mozilla.org/en-US/docs/WebAPI/Using_geolocation) geolocation-tutorial...");


this.addText("...");
this.addDemo(`// Get GPS cordinates via a Promise
function getGPSCoords () {
	// Create new Promise to help out in fetching the geolocation data asynchronously
	return new Promise( (resolve,reject) => { 

		// Call the geolocation API
		navigator.geolocation.getCurrentPosition(
			// Success callback -> promise resolves to geolocation position
			(pos) => resolve( [ pos.coords.latitude , pos.coords.longitude ] ),

			// Failure callback -> promise rejects with an error message
			()    => reject(new Error('Failed do retrieve your geolocation position.'))
		);
	});
}`,"javascript");


this.addText("Let's see, how to use that!");
this.addDemoCode(`// Fetch GPS coordinates
let Coords = getGPSCoords();

// If/when location information is retrieved, update the UI
Coords.then(
	(coords) => {
		let [lat,lon] = coords;
		console.log('Lat: '+lat+'°, Lon: '+lon+'°');
	}

// ...or show an error message, if retrieving the GPS coordinates failed
).catch(
	(e) => alert(e)
);`

,(console) => {
	return this.logLocation(console);
});

this.addText(`Let's try something more interesting/useful!  
Using the [Google Static Maps API](http://) we will show the location on a
static image map:`);
this.addDemoCode(`// Fetch GPS coordinates
// If/when location information is retrieved, show them on map!
Coords.then(
	(coords) => {
		let [lat,lon] = coords;
		let i = new Image();
		i.src = "http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyD8QtSJG6rFsoKXH16E6QR2k_4-QBr3gdI&size=320x240&scale=2&maptype=roadmap&center=$LAT$,$LON$&zoom=12&markers=color:blue%7Clabel:%7C$LAT$,$LON$"
			.replace('$LAT$',lat)
			.replace('$LON$',lon);

		document.body.appendChild(i);
	}
);`

,(console) => {
	return this.showLocation(console);
});

}


	// Geolocation
	getGPSCoords () {
		// Create new Promise to help out in fetching the geolocation data asynchronously
		return new Promise( (resolve,reject) => { 

			// Call the geolocation API
			navigator.geolocation.getCurrentPosition(
				// Success callback -> promise resolves to geolocation position
				(pos) => resolve( [ pos.coords.latitude , pos.coords.longitude ] ),

				// Failure callback -> promise rejects with an error message
				()    => reject(new Error('Failed do retrieve your geolocation position.'))
			);
		});
	}

	logLocation (console = window.console) {
		// Fetch GPS coordinates
		let Coords = this.getGPSCoords();

		// If/when location information is retrieved, update the UI
		Coords.then(
			(coords) => {
				let [lat,lon] = coords;
				console.log('Lat: '+lat+'°, Lon: '+lon+'°');
			}

		// ...or show an error message, if retrieving the GPS coordinates failed
		).catch(
			(e) => alert(e)
		);
	}

	showLocation (console = window.console) {
		// Fetch GPS coordinates
		let Coords = this.getGPSCoords();

		// If/when location information is retrieved,
		// show location on the map
		Coords.then(
			(coords) => {
				let [lat,lon] = coords;
				let i = new Image();
					i.src = "http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyD8QtSJG6rFsoKXH16E6QR2k_4-QBr3gdI&size=320x240&scale=2&maptype=roadmap&center=$LAT$,$LON$&zoom=12&markers=color:blue%7Clabel:%7C$LAT$,$LON$"
						.replace('$LAT$',lat)
						.replace('$LON$',lon);

				console.log(i);
			}

		// ...or show an error message, if retrieving the GPS coordinates failed
		).catch(
			(e) => alert(e)
		);
	}

	activate () {
	}
	reset () {
	}


	/*
	https://developer.mozilla.org/en-US/docs/WebAPI/Using_geolocation

	47.4759873° 
	19.0328715°
	http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyD8QtSJG6rFsoKXH16E6QR2k_4-QBr3gdI&size=320x240&scale=2&maptype=roadmap&center=47.4759873,19.0328715&zoom=12&markers=color:blue%7Clabel:%7C47.4759873,19.0328715

	*/

}


// Create example instance
export function example(Demo) {
	return new GeolocationDemo(Demo);
}