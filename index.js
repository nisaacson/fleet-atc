/**
 * Spawn a process
 */
require('better-stack-traces')
var exec = require('child_process').exec
var rk = require('required-keys');
var getPSText = require('./getPSText')
var getPSJson = require('fleet-ps-json')
var inspect = require('eyespect').inspector()
var isCommandRunning = require('./isCommandRunning')
var pattern = /spawned/;
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

    var cmd = '(cd ' + directory + ' && fleet spawn'

    if (data.drone) {
      cmd += ' --drone=' + data.drone
    }
    cmd += '  -- ' + command + ')'
    inspect(cmd, 'executing spawn command')
    exec(cmd, function (err, stdout, stderr) {
      if (err) {
        return cb(err)
      }
      console.log(stdout)
      console.log(stderr)
      if (pattern.test(stdout)) {
        return cb()
      }
      if (err) {
        return cb({
          message: 'failed to spawn command, bad output from fleet after executing fleet-spawn',
          error: err,
          cmd: cmd,
          command: command,
          stdout: stdout,
          stderr: stderr,
          directory: directory,
          stack: new Error().stack
        })
      }
    })

  })
}
