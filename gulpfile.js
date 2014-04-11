var gulp = require('gulp');
var traceur = require('gulp-traceur');
var browserify = require('gulp-browserify');  
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var streamqueue = require('streamqueue');

var traceurConfig = {
	debug: true,
//	sourceMap: true,

	// Experimental Traceur-features, feel free to enable/disable them:
	// https://github.com/google/traceur-compiler/wiki/LanguageFeatures

	// Block bindings, required for "let" keyword usage
	// http://wiki.ecmascript.org/doku.php?id=harmony:block_scoped_bindings
	blockBinding: true,

	// Private/tamper-resistant symbols for ES6
	// http://tc39wiki.calculist.org/es6/symbols/‎
//			symbols: true,

	// ES7 experimental "async" functions (syntactic sugar for promises+generators)
	// https://groups.google.com/forum/#!topic/traceur-compiler-discuss/pdnHHRe2U3g
//			deferredFunctions: true, 

	// Types support (similar to those implemented in TypeScript)
	// http://wiki.ecmascript.org/doku.php?id=strawman:types&s=types
//			types: true,

	modules: 'commonjs'
};

var demosJSON = null;
var demosSource = null;

// Generate demolist from demos.json
gulp.task('app-generate-demolist', function (cb) {
	demosJSON = require('./demos.json');

	demosSource = "/* Importing & initializing DEMOs */\n\n";

	demosJSON.forEach(function (group) {
		demosSource += "APP.addDemoGroup('"+group.title+"');\n\n";

		group.demos.forEach(function (demo) {
			demosSource += "\t// "+demo+" demo\n";
			demosSource += "\timport { example as "+demo+"Demo } from '"+group.group+"/"+demo+"';\n";
			demosSource += "\t"+demo+"Demo(APP);\n\n";

			console.log("       imported: "+group.group+"/"+demo+" demo");
		});

	});

	demosSource += "/* Finished: importing & initializing DEMOs */\n";

	cb(null);
});

// Compile ES6 modules
gulp.task('app-compile-modules', function () {
	var stream = gulp.src(['./src/**/*.js','!./src/app.js'])

		// Transpile ES6 -> ES5 via Traceur
		.pipe(traceur(traceurConfig))

		// Output compiled app modules
		.pipe(gulp.dest('./compiled/node_modules/'));

	return stream;
});

// Compile main app module
gulp.task('app-compile', [ 'app-generate-demolist','app-compile-modules' ], function () {
	var stream = gulp.src('./src/app.js')

		// Insert demolist
	    .pipe(replace(/\/\*\=DEMO_IMPORT\=\*\//g, demosSource))

		// Transpile ES6 -> ES5 via Traceur
		.pipe(traceur(traceurConfig))

		// Output as app-module.js
		.pipe(rename(function (path) {
			path.basename = "app-module";
		}))
		.pipe(gulp.dest('./compiled/'))

		// Bundle modules via browserify
		.pipe(browserify())

		// Output as app-bundle.js
		.pipe(rename(function (path) {
			path.basename = "app-bundle";
		}))
		.pipe(gulp.dest('./compiled/'));

	return stream;
});

gulp.task('app-concat', [ 'app-compile' ], function (finished) {
	// New streamqueue for concatenating the output
	var stream = streamqueue({ objectMode: true });

	// Add traceur runtime to be concatenated to the start of the final output bundle
	stream.queue(gulp.src(traceur.RUNTIME_PATH));

	// Add output bundle to the stream
	stream.queue(gulp.src('./compiled/app-bundle.js'));

	// Concat the traceur runtime & browserified modules into a single app.js
	return stream.done()
		.pipe(concat('app.js'))
		.pipe(gulp.dest('./app/js/'));
});

// Compile & concat w/ runtime
gulp.task('default', [ 'app-concat' ]);

/* TODO: watch for changes & recompile */
//var watcher = gulp.watch('js/**/*.js', ['uglify','reload']);
//watcher.on('change', function(event) {
//  console.log('File '+event.path+' was '+event.type+', running tasks...');
//});