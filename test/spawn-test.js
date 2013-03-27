var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var getPSJson = require('fleet-ps-json')
var inspect = require('eyespect').inspector();
var atc = require('../index')
describe('Spawn new command', function () {
  it('should spawn command', function (done) {
    var command = 'node grapes.js'
    var dir = path.join(__dirname, 'data/repos/grapes/')
    var data = {
      command: command,
      directory: dir
    }
    atc(data, function (err) {
      should.not.exist(err, 'error spawning command: ' + JSON.stringify(err, null, ' '))
      done()
    })
  })
})
