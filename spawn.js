#! /usr/bin/env node
var async =require('async')
var should = require('should');
var argv = require('optimist').boolean('deploy').argv
var deploy = argv.deploy
var name = argv.name || 'default'
var inspect = require('eyespect').inspector();
var fs = require('fs')
var path = require('path')
var directory = process.cwd()
var spawnPath = path.join(directory, 'spawn.json')
var performSpawn = require('./index')
var exists = fs.existsSync(spawnPath)
var rk = require('required-keys');
if (!exists) {
  throw new Error('spawn.json file not found in the current directory. Path: ' + spawnPath)
}

load()
function load() {
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

  inspect(name,'name')
  var hubElement = getHub(name)
  async.forEachSeries(
    json,
    function (element, cb) {
      if (deploy && !element.hasOwnProperty('deploy')) {
        element.deploy = deploy
      }
      element.hub = hubElement.hub
      element.secret = hubElement.secret
      inspect(element, 'spawning now')
      performSpawn(element, cb)
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
}
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


function getHub(name) {
  var filePath = path.join(process.cwd(), 'fleet.json')
  var json = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  inspect(json, 'fleet json')
  var element = json.remote[name]
  inspect(element, 'hub element')
  return element
}
