var  express =  require('express');
var  path =  require('path');

var  app =  express();

var fs = require("fs");
var content = fs.readFileSync("index.html", 'utf8');

app.use("/public", express.static(path.join(__dirname,'public')));

app.get('/', function (req, res) {
	res.send(content);
});

app.listen(process.env.PORT || 5000);
