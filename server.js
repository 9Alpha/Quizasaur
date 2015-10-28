var  express =  require('express');
var  path =  require('path');

var  app =  express();

var fs = require("fs");
var content = fs.readFileSync("public/index.html", 'utf8');
var questJSON = fs.readFileSync("public/js/questions1.json");

app.use("/public", express.static(path.join(__dirname,'public')));

app.get('/', function (req, res) {
	res.send(content);
});

app.get('/quiz', function (req, res) {
	res.send(questJSON);
});

app.post('/scores', function (req, res) {
    console.log("******************************************");
    console.log(req);
    console.log("******************************************");
    //fs.writeFileSync("public/js/questions1.json", JSON.stringify(req.body));
});


app.listen(process.env.PORT || 5000);
