var  express =  require('express');
var  path =  require('path');

var  app =  express();

var fs = require("fs");
var content = fs.readFileSync("public/index.html", 'utf8');

app.use("/public", express.static(path.join(__dirname,'public')));

app.get('/', function (req, res) {
	res.send(content);
});

app.get('/quiz', function (req, res) {
	res.send('Ayp!!');
});

app.get('/scores', function (req, res) {
	res.send('Oop!!');
});


app.listen(process.env.PORT || 5000);
