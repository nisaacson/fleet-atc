module.exports = function (command, json) {
  var running = json.some(function (e) {
    var text = e['command']
    return text === command
  })
  return running
}
