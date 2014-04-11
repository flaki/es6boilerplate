Firefox OS AppSkeleton for ES6 and Open Web API-s
=================================================

A Firefox OS ECMAScript 6 application boilerplate, and showcase for ES6 features and
Open WebAPI-s, also a quick-start skeleton for building ES6-enabled apps using Gulp
and the Google Traceur compiler.



## Introduction

This app is aimed at developers to showcase the new additions of the ECMAScript 6 standard,
while in the meantime providing a brief introduction into the Open Web API-s provided for
application developers on mozilla's Firefox OS mobile operating system.  
Besides showcasing these techniques, the app is meant to act as a quick-start boilerplate
"skeleton" for starting and building new, ES6-enabled HTML5 applications for the OS.  
Because of the early stage of ES6 standardization and adoption, very few of the new features
work on current browsers/platforms, so this boilerplate lets you
[transpile](http://www.stevefenton.co.uk/Content/Blog/Date/201211/Blog/Compiling-Vs-Transpiling/)
ES6 code to ES5, which works most of today's modern browsers (including early releases of
Firefox OS).

### What are the Open Web API-s?

Open Web API-s are standard (or at least, to be standardized) interfaces for HTML5 developers
for accessing device hardware and resources - only available before for native applications.
The effort is spearheaded by mozilla in its Firefox OS HTML5/JS/CSS-based mobile operating system,
joined by several industry players (like Google). Via Open Web API JavaScript interfaces, you
can access device hardware (GPS, accelerometer, battery etc.) and device resources (contact list,
files & storage) straight inside from your web application (and with appropriate security restrictions,
of course).

### What is ES6?

ES6 (or ES.next) is the 6th version of the ECMAScript standard, which is bound to improve
on the featureset and tools that browsers provide in their JavaScript implementations.

ECMAScript's evolution is a joint effort, led by the TC39 commitee of browser vendors
and other industry experts. By evolving the JavaScript language (which currently is one of
the most ubiquitous and prevalent languages, available hundreds of millions of web-capable
devices from feature phones to desktop browsers) the web can be made device-independent
platform in its own right, and a compelling alternative for current, proprietary solutions.



## ES6 on Firefox OS

Some of the latest versions of Firefox OS support a whole great lot of awesome features
of the evolving web platform (like - among others -
[arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/arrow_functions) or
[promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).),
but there are still very few devices on consumer market that sport these new OS versions.

Most of the Firefox OS devices available still run an outdated (1.1, or 1.0.1, even) version
of Firefox OS, preventing app developers from leveraging these great tools & techniques
to ease and improve their apps.

Even on later versions of the OS - for example, arrow functions become available with Firefox OS 1.2 -
there are still a lot of great features missing from the upcoming ES6 proposal (intended to finalize
on December, 2014), which means even on these OS versions, you are limited to using only a
subset of the upcoming new features.

### Why this repo?

I wanted to use some of the cutting-edge tools while developing my Firefox OS apps, meanwhile
future-proofing them by using the latest-and-greatest tools & syntax available - but didn't
want to break backward-compatibilty with devices running old versions of Firefox OS.

To my wonder, it was suprisingly hard putting together an app that did just that - used ES6,
promises, modules and other cutting-edge techniques - but compiled to ES5 and ran on Firefox OS
1.1. After I spent a few days on creating one that fit my requirements, I decided to make it
an open and extensible repo, that is also a boilerplate app, serving as an introduction for both
Firefox OS, Open Web API-s and ES6 features!

### About Traceur

The [Google Traceur compiler](https://github.com/google/traceur-compiler) is an experimental
build tool, that you can use to transpile code written in ES6 into a more current version of
javascript, that is actually understandable by most of today's modern browsers and javascript
runtimes.  
This way you may make use of the features of the upcoming language generations, while
maintaining support for earlier browser versions (especially for earlier Firefox OS versions,
like the pre-1.3 versions based on Gecko 18, the web runtime of Firefox 18).

As the standard matures and browsers start to show widespread adoption, you might later on
choose to disable compilation for some of the new features - or skip compiling altogether,
and all that remains is your future-proof code written in the next generation of the
javascript language!

### Learn more about Firefox OS and ES6

Are you new to Firefox OS app development? The absolutely stunning trio of [Christian Heilmann](https://twitter.com/codepo8),
Mozilla's principal evangelist and Telenor Digital's [Jan Jongboom](https://twitter.com/janjongboom) &
[Sergi Mansilla](https://twitter.com/sergimansilla) has got you covered with this
[10-short-episode worth of Firefox OS app development awesomeness](https://hacks.mozilla.org/2014/03/app-basics-for-firefoxos/),
guiding you through the absolute basics of Firefox OS, the Simulator, manifests, Web API's and all
that you need to get you started with Firefox OS app development.

Want to know more about ES6? [Dr. Axel Rauschmayer's Fluent 2013 talk](http://vimeo.com/68716827)
will sure to get you going [(slides)](http://cdn.oreillystatic.com/en/assets/1/event/93/An%20Overview%20of%20ECMAScript%206%20Presentation.pdf).
To follow the standards work, check out [esdiscuss.org](http://esdiscuss.org/), and follow
[@esdiscuss](http://twitter.com/esdiscuss) for curated summaries of the mailing list.  
Browser and implementations support for ES6 can be checked at
[Kangax's ES6 compatibility tables](http://kangax.github.io/es5-compat-table/es6/), with
support in Mozilla's products summed up nicely on MDN at
[ECMAScript 6 support in Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/ECMAScript_6_support_in_Mozilla).




## How to use the boilerplate?

After checking out the repo, you will be needing node.js & npm to build your app.
Node is not needed to serve your app, but to install dependent libraries & compile
your application source. [Download & install node.js from here](http://nodejs.org/download/).

The boilerplate uses [Gulp](http://gulpjs.com/), a streaming build tool to ease and automate
the build & compilation process. This is how it works:

* [Install Gulp globally](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#1-install-gulp-globally):  
  `npm install -g gulp`

* Install gulp modules and other package dependencies:  
  `npm install`

* At this point, you should be able to build your app!  
  Edit your modules in `src/*.js`, then at the project root launch the build process:    
  `gulp`

* Gulp generates your compiled output in `app/js/*` - voilà,‎ your app is now ready to be
  tested on virtually any Firefox OS version!

* Edit your application source, `index.html`, update your
  [application manifest](https://developer.mozilla.org/en-US/Apps/Build/Manifest),
  place your resources & styles in the app directory and you are ready to go!

### What is inside the `src/*` folder?

This folder contains your (ES6) source code for your app modules. This folder uses
[ES6 module syntax semantics](http://www.2ality.com/2013/07/es6-modules.html) to compile
and modularize your source code - which you should absolutely do, for better code
separation and easier maintainability.

For a quick dive, check out the included samples and the linked article above - ES6 module
syntax is quite straightforward, so you should be writing great modules in no time!

Sample code contains the following files in the `src` folder:

* `app.js` - this is the main logic of your app, the first bootstrap point to your application logic,

* `es6/*.js` - these are demonstration modules, showcasing some of the awesome features of ES6. For
more features & examples, check out [@lukehoban's excellent ES6 Features repo](http://git.io/es6features)
which showcases most of the major improvements of ES6 with easy-to-understand sample code snippets.

* `webapi/*.js` - here you will find some modules that demonstrate the usage of
[Open Web API](https://developer.mozilla.org/en-US/docs/Web/API)-s. These APIs compromise the core
of Firefox OS's hardware-access, and make it possible for you to access telephony hardware, sensors
& other useful interfaces from web code on a Firefox OS device.  
The WebAPI modules here are too, written with ES6 in mind, and are just there for apetizing - you
should check out the [Firefox OS Boilerplate App](https://github.com/robnyman/Firefox-OS-Boilerplate-App)
by the great Rob Nyman, which contains a plethora of working WebAPI demo code for your coding pleasures.

Of course, contents and structure of this folder is just a recommendation - should you know what
you're doing, you are free to hack it, restructure it they way you want.



## Contribute!

Want to help out? Here's what you can do:

* If you use the skeleton to build an app, just [drop me a tweet](https://twitter.com/slsoftworks)
  about your app and your experience.

* Found a bug, or have a request? Check out [the isues tab on GitHub](https://github.com/flaki/es6boilerplate/issues),
  file a bug - or fix one!

* Help [adding ES6 support in prism.js](https://github.com/LeaVerou/prism/issues/111) -
  the syntax highlighter used in the app.

* Help in figuring out a way how to enable SourceMaps support in the generated output to ease
  the debugging of the generated apps.

* Fork [the repo](https://github.com/flaki/es6boilerplate)! Help out by adding new demos,
  or extending the existing ones!  
  Add a new demo by creating a new module in the `/src` folder (or one of its subfolders), writing
  the module code, and add your module to the JSON module list found in `demos.json`. 
