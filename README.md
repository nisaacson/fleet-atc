# Fleet-ATC
Fleet Air Traffic Controller (fleet-atc) manages processes that run on your fleet drones.

[fleet](https://github.com/substack/fleet) is an excellent tool to manage processes in a cluster. However respawning commands after an such as a server reboot can be difficult. fleet-atc allows you to specify and execute all your fleet spawn commands across all your repos with a single command.

# Installation
```bash
[sudo] npm install -g fleet-atc
```
Installing globally will create a command line tool `fleet-atc` that you can use to manage your spawned fleet processes

# Usage
Create an empty git repo in a fresh directory. Add a *fleet.json* file with a default hub.

**fleet.json**
```javascript
{
  "remote": {
  "default": {
    "hub": "localhost:7000",
    "secret": "beepboop"
  }
}
```

**spawn.json**
In this directory also create a *spawn.json*

The spawn.json file indicates what process you want to ensure get spawned. Each element in the spawn.json file should contain the command you wish to pass to the *fleet-spawn* command, as well as the directory of the repo. The directory can either be an absolute path or a relative path to the current directory containing the spawn.json file.


```javascript
[
  {
    "command": "node grapeServer.js",
    "directory": "../grapes/",
  },
  {
    "command": "node catsServer.js",
    "directory": "../cats/",
    "drone": "drone001"
  },
]
```

In the example above, there are 2 repos, *grapes.git* and *cats.git*. In each repo you want to issue a different spawn command. fleet-atc will go into each repo specified and execute the given command. Note that you can optionally specify a drone name if the spawned process needs to run on a specific drone. Internally fleet-atc calls `fleet-spawn --drone=drone1` if you specify `drone: drone1`

To spawn everything in the *spawn.json* file, execute in the same directory
```bash
fleet-atc
```

If any of the elements in spawn.json has already been spawned and thus appears in the output of fleet-ps, fleet-atc will ignore it and move on to the next element

# Deploy
If you wish, you can have fleet-atc deploy the lastest commit of your repo before running the spawn command. To enable deployment, set  `"deploy": true` in your spawn.json element. You can also enable deploy across all repos by passing the command line argument `--deploy=true`. Note that the individual deploy directives in spawn.json will override the command-line `--deploy` argument

```javascript
[
  {
    "command": "node grapeServer.js",
    "directory": "../grapes/",
    "deploy": true
  },
  {
    "command": "node catsServer.js",
    "directory": "../cats/",
    "drone": "drone001"
  },
]
```


## Todo
Allow users to specify the max number of times a process can be spawned by including an optional `maxProcesses` field in the json element. Currently fleet-atc only allows for 1 process for a given repo directory and command
