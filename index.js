/**
 * Spawn a process
 */
var rk = require('required-keys');
var getPSText = require('./getPSText')
var getPSJson = require('fleet-ps-json')
var inspect = require('eyespect').inspector();
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
    inspect(json, 'fleet json')
    var command = data.command
    var cmd = 'fleet spawn -- '+ command
  })
}
