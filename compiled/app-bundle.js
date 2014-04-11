(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var __moduleName = "app";
console.debug('Initializing "demo" app...');
var Demo = require('demo').Demo;
window.APP = new Demo();
APP.addDemoGroup('ES6 Features');
APP.addDemoGroup('Open Web API-s');
var GeolocationDemo = require('webapi/Geolocation').example;
GeolocationDemo(APP);

},{"demo":2,"webapi/Geolocation":4}],2:[function(require,module,exports){
"use strict";
var __moduleName = "demo";
var Demo = function Demo() {
  this.examples = [];
  document.querySelector('header > button').addEventListener('click', (function(e) {
    if (document.body.dataset.page) {
      delete document.body.dataset.page;
      document.querySelector('article.active').classList.remove('active');
    }
  }));
};
($traceurRuntime.createClass)(Demo, {
  addDemoGroup: function(group) {
    var element = document.createElement('h2');
    element.textContent = group;
    document.querySelector('main').appendChild(element);
  },
  addDemo: function(example) {
    var $__0 = this;
    var $__2 = example,
        group = $__2.group,
        title = $__2.title;
    var label = (group ? group + '_' : '') + title;
    this.examples.push({
      title: title,
      group: group,
      example: example,
      label: label
    });
    console.log('Added new example (' + label + '): ', example);
    var element = document.createElement('article');
    element.id = label;
    example.render(element);
    document.body.appendChild(element);
    var launcher = document.createElement('button');
    launcher.textContent = (group ? group.toUpperCase() + ': ' : '') + title;
    launcher.addEventListener('click', (function() {
      return $__0.activate(label);
    }));
    document.querySelector('main').appendChild(launcher);
  },
  activate: function(label) {
    document.querySelector('article#' + label).classList.add('active');
    document.body.dataset.page = label;
  },
  home: function() {}
}, {});
module.exports = {
  get Demo() {
    return Demo;
  },
  __esModule: true
};

},{}],3:[function(require,module,exports){
"use strict";
var __moduleName = "demoexample";
function highlight(element) {
  Prism.highlightElement(element);
}
function escape(string) {
  return string.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
}
function logging_function() {
  var $__5;
  for (var msgs = [],
      $__3 = 0; $__3 < arguments.length; $__3++)
    msgs[$__3] = arguments[$__3];
  ($__5 = console).log.apply($__5, $traceurRuntime.toObject(msgs));
  var sandbox = document.getElementById(this.dataset.sandbox);
  if (!sandbox)
    return false;
  for (var $__1 = msgs[Symbol.iterator](),
      $__2; !($__2 = $__1.next()).done; ) {
    try {
      throw undefined;
    } catch (m) {
      m = $__2.value;
      {
        switch (typeof m) {
          case 'object':
            if ("nodeName" in m) {
              sandbox.appendChild(m);
              break;
            }
            m = JSON.stringify(m).replace(/(\:|\,|\{|\[)/g, '$1 ').replace(/(\]|\})/g, ' $1');
          default:
            sandbox.insertAdjacentHTML('beforeend', Prism.highlight(m + " ", Prism.languages.javascript));
        }
      }
    }
  }
  sandbox.appendChild(document.createTextNode("\n"));
}
function linkify(string) {
  return string.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (function() {
    for (var rx = [],
        $__4 = 0; $__4 < arguments.length; $__4++)
      rx[$__4] = arguments[$__4];
    return '<a href="' + rx[2] + '">' + rx[1] + '</a>';
  }));
}
var DemoExample = function DemoExample() {};
($traceurRuntime.createClass)(DemoExample, {
  render: function(frame) {
    this.frame = frame;
  },
  addText: function(contents) {
    if (!this.frame)
      return console.error(this, 'Not assigned to render element.');
    console.log("Text: ", contents);
    var e = document.createElement('p');
    e.innerHTML = linkify(contents);
    this.frame.appendChild(e);
  },
  addDemo: function(source) {
    var type = arguments[1] !== (void 0) ? arguments[1] : "markup";
    if (!this.frame)
      return console.error(this, 'Not assigned to render element.');
    console.log("Demo: ", type, source);
    var e = document.createElement('pre'),
        code = document.createElement('code');
    code.className = 'language-' + type;
    code.innerHTML = escape(source);
    e.appendChild(code);
    this.frame.appendChild(e);
    highlight(code);
  },
  addDemoCode: function(source, exec) {
    if (!this.frame)
      return console.error(this, 'Not assigned to render element.');
    console.log("Code: ", source, exec);
    var e = document.createElement('pre'),
        code = document.createElement('code');
    code.className = "language-javascript";
    code.innerHTML = escape(source);
    e.appendChild(code);
    this.frame.appendChild(e);
    highlight(code);
    var sbid = 'sandbox_' + (new Date()).getTime();
    var sandbox = document.createElement('pre');
    sandbox.id = sbid;
    sandbox.className = 'sandbox language-clike';
    var launchbtn = document.createElement('button');
    launchbtn.textContent = "Start";
    launchbtn.dataset.sandbox = sbid;
    launchbtn.addEventListener('click', (function(e) {
      var btn = e.target;
      if (!btn.dataset.started) {
        btn.dataset.started = 'started';
        btn.textContent = "Reset";
        exec({log: logging_function.bind(btn)});
      } else {
        btn.dataset.started = '';
        btn.textContent = "Start";
        document.getElementById(btn.dataset.sandbox).innerHTML = '';
      }
    }));
    this.frame.appendChild(sandbox);
    this.frame.appendChild(launchbtn);
  }
}, {});
module.exports = {
  get DemoExample() {
    return DemoExample;
  },
  __esModule: true
};

},{}],4:[function(require,module,exports){
"use strict";
var __moduleName = "Geolocation";
var DemoExample = require('demoexample').DemoExample;
var DEMO_GROUP = 'webapi';
var DEMO_TITLE = 'Geolocation';
var GeolocationDemo = function GeolocationDemo(app) {
  this.app = app;
  this.group = DEMO_GROUP;
  this.title = DEMO_TITLE;
  this.app.addDemo(this);
};
var $GeolocationDemo = GeolocationDemo;
($traceurRuntime.createClass)(GeolocationDemo, {
  render: function(element) {
    var $__0 = this;
    $traceurRuntime.superCall(this, $GeolocationDemo.prototype, "render", [element]);
    this.addText("Geolocation example...");
    this.addText("Based on the [MDN](https://developer.mozilla.org/en-US/docs/WebAPI/Using_geolocation) geolocation-tutorial...");
    this.addText("...");
    this.addDemo("// Get GPS cordinates via a Promise\r\nfunction getGPSCoords () {\r\n\t// Create new Promise to help out in fetching the geolocation data asynchronously\r\n\treturn new Promise( (resolve,reject) => { \r\n\r\n\t\t// Call the geolocation API\r\n\t\tnavigator.geolocation.getCurrentPosition(\r\n\t\t\t// Success callback -> promise resolves to geolocation position\r\n\t\t\t(pos) => resolve( [ pos.coords.latitude , pos.coords.longitude ] ),\r\n\r\n\t\t\t// Failure callback -> promise rejects with an error message\r\n\t\t\t()    => reject(new Error('Failed do retrieve your geolocation position.'))\r\n\t\t);\r\n\t});\r\n}", "javascript");
    this.addText("Let's see, how to use that!");
    this.addDemoCode("// Fetch GPS coordinates\r\nlet Coords = getGPSCoords();\r\n\r\n// If/when location information is retrieved, update the UI\r\nCoords.then(\r\n\t(coords) => {\r\n\t\tlet [lat,lon] = coords;\r\n\t\tconsole.log('Lat: '+lat+'°, Lon: '+lon+'°');\r\n\t}\r\n\r\n// ...or show an error message, if retrieving the GPS coordinates failed\r\n).catch(\r\n\t(e) => alert(e)\r\n);", (function(console) {
      return $__0.logLocation(console);
    }));
    this.addText("Let's try something more interesting/useful!  \r\nUsing the [Google Static Maps API](http://) we will show the location on a\r\nstatic image map:");
    this.addDemoCode("// Fetch GPS coordinates\r\n// If/when location information is retrieved, show them on map!\r\nCoords.then(\r\n\t(coords) => {\r\n\t\tlet [lat,lon] = coords;\r\n\t\tlet i = new Image();\r\n\t\ti.src = \"http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyD8QtSJG6rFsoKXH16E6QR2k_4-QBr3gdI&size=320x240&scale=2&maptype=roadmap&center=$LAT$,$LON$&zoom=12&markers=color:blue%7Clabel:%7C$LAT$,$LON$\"\r\n\t\t\t.replace('$LAT$',lat)\r\n\t\t\t.replace('$LON$',lon);\r\n\r\n\t\tdocument.body.appendChild(i);\r\n\t}\r\n);", (function(console) {
      return $__0.showLocation(console);
    }));
  },
  getGPSCoords: function() {
    return new Promise((function(resolve, reject) {
      navigator.geolocation.getCurrentPosition((function(pos) {
        return resolve([pos.coords.latitude, pos.coords.longitude]);
      }), (function() {
        return reject(new Error('Failed do retrieve your geolocation position.'));
      }));
    }));
  },
  logLocation: function() {
    var console = arguments[0] !== (void 0) ? arguments[0] : window.console;
    var Coords = this.getGPSCoords();
    Coords.then((function(coords) {
      var $__2 = coords,
          lat = $__2[0],
          lon = $__2[1];
      console.log('Lat: ' + lat + '°, Lon: ' + lon + '°');
    })).catch((function(e) {
      return alert(e);
    }));
  },
  showLocation: function() {
    var console = arguments[0] !== (void 0) ? arguments[0] : window.console;
    var Coords = this.getGPSCoords();
    Coords.then((function(coords) {
      var $__2 = coords,
          lat = $__2[0],
          lon = $__2[1];
      var i = new Image();
      i.src = "http://maps.googleapis.com/maps/api/staticmap?key=AIzaSyD8QtSJG6rFsoKXH16E6QR2k_4-QBr3gdI&size=320x240&scale=2&maptype=roadmap&center=$LAT$,$LON$&zoom=12&markers=color:blue%7Clabel:%7C$LAT$,$LON$".replace('$LAT$', lat).replace('$LON$', lon);
      console.log(i);
    })).catch((function(e) {
      return alert(e);
    }));
  },
  activate: function() {},
  reset: function() {}
}, {}, DemoExample);
function example(Demo) {
  return new GeolocationDemo(Demo);
}
module.exports = {
  get example() {
    return example;
  },
  __esModule: true
};

},{"demoexample":3}]},{},[1])