var express = require('express');
var app = express();
app.use(express.logger());

var fs = require('fs');

app.get('/', function(request, response) {
    var buffer = fs.readFileSync("index.html");
    response.send(buffer.toString('utf-8'));
// response.send('Hello World 2!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
