var path = require('path')
  , rimraf = require('rimraf')
  , async = require('async')
  , exec = require('child_process').exec
  
var tempDir = function(){
    var platform = process.platform
    if (platform === 'win32')
        return 'C:\\Windows\\Temp'
    else
        return '/tmp'
}()

var userHomeDir = process.env.HOME || process.env.USERPROFILE

function browserExeExists(cb){
    var browser = this
    if (browser.exe instanceof Array)
        async.filter(browser.exe, path.exists, function(exes){
            cb(exes.length > 0)
        })
    else
        path.exists(browser.exe, cb)
}

function browsersForPlatform(){
    var platform = process.platform
    if (platform === 'win32'){
        return  [
            {
                name: "IE7",
                exe: "C:\\Program Files\\Internet Explorer\\iexplore.exe",
                setup: function(app, done){
                    app.server.ieCompatMode = 'EmulateIE7'
                    done()
                },
                supported: browserExeExists
            },
            {
                name: "IE8",
                exe: "C:\\Program Files\\Internet Explorer\\iexplore.exe",
                setup: function(app, done){
                    app.server.ieCompatMode = 'EmulateIE8'
                    done()
                },
                supported: browserExeExists
            },
            {
                name: "IE9",
                exe: "C:\\Program Files\\Internet Explorer\\iexplore.exe",
                setup: function(app, done){
                    app.server.ieCompatMode = '9'
                    done()
                },
                supported: browserExeExists
            },
            {
                name: "Firefox",
		exe: [
                    "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
                    "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe"
                ],
                args: ["-profile", tempDir + "\\testem.firefox"],
                setup: function(app, done){
                    rimraf(tempDir + '\\testem.firefox', done)
                },
                supported: browserExeExists
            },
            {
                name: "Chrome",
                exe: [
                    userHomeDir + "\\Local Settings\\Application Data\\Google\\Chrome\\Application\\chrome.exe",
                    userHomeDir + "\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe"
                ],
                args: ["--user-data-dir=" + tempDir + "\\testem.chrome", "--no-default-browser-check", "--no-first-run"],
                setup: function(app, done){
                    rimraf(tempDir + '\\testem.chrome', done)
                },
                supported: browserExeExists
            },
            {
                name: "Safari",
                exe: [
                    "C:\\Program Files\\Safari\\safari.exe",
                    "C:\\Program Files (x86)\\Safari\\safari.exe"
                ],
                supported: browserExeExists
            },
            {
                name: "Opera",
                exe: "C:\\Program Files\\Opera\\opera.exe",
                args: ["-pd", tempDir + "\\testem.opera"],
                setup: function(app, done){
                    rimraf(tempDir + '\\testem.opera', done)
                },
                supported: browserExeExists
            },
            {
                name: 'PhantomJS',
                exe: 'phantomjs',
                args: function(app){
                    return [path.dirname(__dirname) + '/assets/phantom.js', app.config.port]
                },
                supported: function(cb){
                    exec('where phantomjs', function(err, exePath){
                        cb(!!exePath)
                    })
                }
            }
        ]
    }else if (platform === 'darwin'){
        return [
            {
                name: "Chrome", 
                exe: "/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome", 
                args: ["--user-data-dir=" + tempDir + "/testem.chrome", "--no-default-browser-check", "--no-first-run"],
                setup: function(app, done){
                    rimraf(tempDir + '/testem.chrome', done)
                },
                supported: browserExeExists
            },
            {
                name: "Firefox", 
                exe: "/Applications/Firefox.app/Contents/MacOS/firefox",
                args: ["-profile", tempDir + "/testem.firefox"],
                setup: function(app, done){
                    rimraf(tempDir + '/testem.firefox', done)
                },
                supported: browserExeExists
            },
            {
                name: "Safari",
                exe: "/Applications/Safari.app/Contents/MacOS/Safari",
                args: [path.dirname(__dirname) + '/assets/safari_start.html'],
                supported: browserExeExists
            },
            {
                name: "Opera",
                exe: "/Applications/Opera.app/Contents/MacOS/Opera",
                args: ["-pd", tempDir + "/testem.opera"],
                setup: function(app, done){
                    rimraf(tempDir + '/testem.opera', done)
                },
                supported: browserExeExists
            },
            {
                name: 'PhantomJS',
                exe: 'phantomjs',
                args: function(app){
                    return [path.dirname(__dirname) + '/assets/phantom.js', app.config.port]
                },
                supported: function(cb){
                    exec('which phantomjs', function(err, exePath){
                        cb(!!exePath)
                    })
                }
            }
        ]
    }else if (platform === 'linux'){
        return []
    }
}

exports.browsersForPlatform = browsersForPlatform