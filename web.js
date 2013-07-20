var express = require('express');
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
    response.send(buf.toString(fs.readFile(index.html),'utf8'));
// response.send('Hello World 2!');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
