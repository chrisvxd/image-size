'use strict';

var Benchmark = require('benchmark');
// var microtime = require('microtime');
var path = require('path');
var fs = require('fs');

var withCache = require('./dist');
var withoutCache = require('./dist1'); // generated with tsc --outDie dist1

var buffer = new Buffer(1024);
var file = path.resolve('specs/images/valid/png/sample.png');
var descriptor = fs.openSync(file, 'r');
fs.readSync(descriptor, buffer, 0, 1024, 0);

// Warm up the VM
withCache(buffer);
withoutCache(buffer);

var suite = new Benchmark.Suite();
suite
  .on('complete', function () {
    var fastest = this.filter('fastest');
    console.log('Fastest is ' + fastest.map('name'));
  })
  .add('withoutCache', () => withoutCache(buffer))
  .add('withCache', () => withCache(buffer))
  .on('cycle', (e) => console.log(String(e.target)))
  .run();
