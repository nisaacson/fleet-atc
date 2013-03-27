var fs = require('fs')
var path = require('path')
var assert = require('assert')
var getPSJson = require('fleet-ps-json')
var inspect = require('eyespect').inspector();
var isCommandRunning = require('../isCommandRunning')
describe('Is command running', function () {
  var text = fs.readFileSync(path.join(__dirname, 'data', 'ps.txt'), 'utf8')
  var json = getPSJson(text)
  it('should return false if command is not running', function () {
    var command = 'node foo.js'
    var running = isCommandRunning(command, json)
    assert.ok(!running, 'running should be false')
  })
  it('should return true if command is running', function () {
    var command = 'node grapes.js'
    var running = isCommandRunning(command, json)
    assert.ok(running, 'running should be true')
  })
})
