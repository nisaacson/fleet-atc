/**
 * Spawn a process
 */
require('better-stack-traces')

var rk = require('required-keys');
var getPSText = require('./getPSText')
var getPSJson = require('fleet-ps-json')
var inspect = require('eyespect').inspector()
var isCommandRunning = require('./isCommandRunning')
var runSpawn = require('./runSpawn')
var deployIfNeeded = require('./deployIfNeeded')
module.exports = function (data, cb) {
  var keys = ['command', 'directory']
  var err = rk.truthySync(data, keys)
  if (err) {
    return cb({
      message: 'error spawning command, missing key in data',
      error: err,
      stack: new Error().stack
    })
  }
  getPSText(function (err, text) {
    if (err) { return cb(err) }
    var json = getPSJson(text)
    var command = data.command
    var running = isCommandRunning(command, json)
    var directory = data.directory // the directory to run the spawn command from
    if (running) {
      inspect(data, 'command has already been spawned so skip for now')
      return cb()
    }

    deployIfNeeded(data, function (err, reply) {
      inspect('deploy complete, spawning now')
      if (err) { return cb(err) }
      runSpawn(data, cb)
    })
  })
}
