var inspect = require('eyespect').inspector();
var exec = require('child_process').exec
var pattern = /deployed/;
module.exports = function (data, cb) {
  var deploy = data.deploy
  inspect(deploy, 'is deploy needed')
  if (!deploy) {
    return cb()
  }
  var hub = data.hub
  var secret = data.secret
  var directory = data.directory // the directory to run the spawn command from
  var cmd = '(cd ' + directory + ' && fleet deploy --hub=' + hub + ' --secret=' + secret + ')'

  inspect(directory, 'deploying repo to drones')
  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      return cb({
        message: 'error deploying repo to drones',
        cmd: cmd,
        error: err,
        stack: new Error().stack
      })
    }
    console.log(stdout)
    console.log(stderr)
    if (pattern.test(stdout)) {
      return cb()
    }
    if (err) {
      return cb({
        message: 'failed to deploy, bad output from fleet after executing fleet-deploy',
        error: err,
        cmd: cmd,
        stdout: stdout,
        stderr: stderr,
        directory: directory,
        stack: new Error().stack
      })
    }
  })
}
