var fs = require('fs')
var path = require('path')
var getPSJson = require('fleet-ps-json')
var isCommandRunning = require('../isCommandRunning')
describe('Is command running', function () {
  it('should return false if command is not running', function () {
    var psText = fs.readFileSync(path.join(__dirname, 'data', 'ps.txt'))
    var json = getPSJson(text)
  })
  it('should return true if command is running')
})
