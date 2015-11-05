var  express =  require('express');
var  path =  require('path');
var  app =  express();

var bodyParser = require('body-parser');  

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));

var fs = require("fs");
var content = fs.readFileSync("public/index.html", 'utf8');


app.use("/public", express.static(path.join(__dirname,'public')));

app.get('/', function (req, res) {
	res.send(content);
});

app.get('/quiz', function (req, res) {
    var questJSON = fs.readFileSync("data/questions1.json");
	res.send(questJSON);
});

app.post('/quiz', function (req, res) {
    fs.writeFileSync("data/questions1.json", JSON.stringify(req.body));
    res.send("Yay!!!");
});

app.get('/scores', function (req, res) {
    var questJSON = fs.readFileSync("data/highscores.json");
	res.send(questJSON);
});

app.post('/scores', function (req, res) {
    fs.writeFileSync("data/highscores.json", JSON.stringify(req.body));
    res.send("Yay!!!");
});


app.listen(process.env.PORT || 5000);
