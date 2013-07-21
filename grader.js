#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
// var CHECKSURL_DEFAULT = "http://polar-woodland-2149.herokuapp.com/";
var rest = require('restler');

// var callback = function(cont) { 
//    var checkJSON = checkHtmlFile(cont,program.checks);
//};


// This funtion checks if file exists
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

// This function checks if URL is provided
var assertURLExists = function(url) {
  var url_string = url.toString();
  rest.get(url_string).on('complete', function(result) {
  if (result instanceof Error) {
      console.log('%s is not a valid URL', url_string);
  }
  });
  return url_string;
}


var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkURL = function(url_content, checksfile) {
    $ = cheerio.load(url_content);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <myUrl>','Path to external url', clone(assertURLExists))
        .parse(process.argv);

        if (program.url) {
// Need to think exactly where to call for the contents of the URL
       //     rest.get(program.url).on('complete',function(result) {
                var checkJson = checkURL(program.url,program.checks);
		// console.log("hello");
                var outJson = JSON.stringify(checkJson, null, 4);
                console.log(outJson);
         //   });
        }
        else if (program.file) {
            var checkJson = checkHtmlFile(program.file,program.checks);
            var outJson = JSON.stringify(checkJson, null, 4);
            console.log(outJson);
        }
        else {
            console.log("URL or file required as a parameter");
        }

    
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
