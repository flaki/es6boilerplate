"use strict";
var __moduleName = "app";
console.debug('Initializing "demo" app...');
var Demo = require('demo').Demo;
window.APP = new Demo();
APP.addDemoGroup('ES6 Features');
APP.addDemoGroup('Open Web API-s');
var GeolocationDemo = require('webapi/Geolocation').example;
GeolocationDemo(APP);
