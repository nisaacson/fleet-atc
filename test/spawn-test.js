var exec = require('child_process').exec
var should = require('should');
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var getPSJson = require('fleet-ps-json')
var getPSText = require('../getPSText')

var inspect = require('eyespect').inspector();
var atc = require('../index')
describe('Spawn new command', function () {
  this.slow('2s')
  before(function (done) {
    stopAll(done)
  })
  after(function (done) {
    stopAll(done)
  })
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

  it('should not spawn a command which is already running', function (done) {
    var command = 'node grapes.js'
    var dir = path.join(__dirname, 'data/repos/grapes/')
    var data = {
      command: command,
      directory: dir
    }
    atc(data, function (err, reply) {
      should.not.exist(err)
      done()
    })
  })

  it('should give error if repo cannot be found', function (done) {
    var command = 'node foo.js'
    var dir = path.join(__dirname, 'data/repos/foo/')
    var data = {
      command: command,
      directory: dir
    }
    atc(data, function (err) {
      should.exist(err)
      done()
    })
  })
})


function stopAll(cb) {
  var rootPath = path.join(__dirname, '..')
  var cmd = '(cd ' + rootPath + ' && fleet-stopall)'
  getPSText(function (err, text) {
    should.not.exist(err)
    var json = getPSJson(text)
    if (json.length === 0) {
      return cb()
    }
    exec(cmd, function (err, stdout, stderr) {
      should.not.exist(err, 'error executing fleet-stopall: ' + JSON.stringify(err, null, ' '))
      cb()
    })
  })
}
