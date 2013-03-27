#! /usr/bin/env node
var async =require('async')
var should = require('should');
var inspect = require('eyespect').inspector();
var fs = require('fs')
var path = require('path')
var directory = process.cwd()
var spawnPath = path.join(directory, 'spawn.json')

var spawn = require('./index')
var exists = fs.existsSync(spawnPath)
var rk = require('required-keys');
if (!exists) {
  throw new Error('spawn.json file not found in the current directory. Path: ' + spawnPath)
}

var spawnText = fs.readFileSync(spawnPath, 'utf8')
var json
try {
  json = JSON.parse(spawnText)
}
catch(err) {
  inspect('Error parsing your json file')
  console.log(err)
  throw new Error(err)
}
var err = validateJSON(json)
if (err) {
  inspect('each entry in spawn.json must specify both a directory and a command')
  should.fail('spawn.json is invalid', err)
}


async.forEach(
  json,
  function (element, cb) {
    inspect(element, 'spawning now')
    spawn(element, cb)
  },
  function (err) {
    if (err) {
      console.log(err.stack)
      delete err.stack
      should.not.exist(err, 'error spawning your services: '+ JSON.stringify(err, null, ' '))
      return
    }
    inspect('all commands spawned correctly')
  })

function validateJSON(json) {
  var errors = json.map(function (element) {
    var keys = ['command', 'directory']
    var err = rk.truthySync(element, keys)
    return err
  }).filter(function (element) {
    return element
  })
  if (errors.length === 0) {
    return null
  }
  return errors
}
