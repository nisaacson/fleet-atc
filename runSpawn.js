var inspect = require('eyespect').inspector()
var exec = require('child_process').exec
var pattern = /spawned/;
module.exports = function (data, cb) {
  var hub = data.hub
  var secret = data.secret
  var command = data.command
  var directory = data.directory // the directory to run the spawn command from
  var cmd = '(cd ' + directory + ' && fleet spawn --hub=' + hub + ' --secret=' + secret + ' '
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
}
