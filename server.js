var  express =  require('express');
var  path =  require('path');
var  app =  express();
var ejs = require('ejs');

var bodyParser = require('body-parser');  

app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));

var fs = require("fs");
//var content = fs.readFileSync("public/index.html", 'utf8');


app.use("/public", express.static(path.join(__dirname,'public')));

app.get('/', function (req, res) {
    var toSend = [];
    (function makeNumbers() {
        var quizes = JSON.parse(fs.readFileSync('data/allQuizes.json'));
        var titles = [];
        for (var i = 0; i < quizes.length; i++) {
            titles.push(quizes[i].title);
        }
        toSend = titles;
    })();
	res.render('index.ejs', {titles: toSend});
});

app.get('/quiz/:id', function (req, res) {
    var questJSON = JSON.parse(fs.readFileSync("data/allQuizes.json"));
	res.send(questJSON[req.params.id.substring(1, req.params.id.length)]);
});

app.put('/quiz/:id', function (req, res) {
    var questJSON = JSON.parse(fs.readFileSync("data/allQuizes.json"));
    questJSON[req.params.id.substring(1, req.params.id.length)] = req.body;
    fs.writeFileSync("data/allQuizes.json", JSON.stringify(questJSON));
    res.send("Yay!!!");
});

app.get('/scores/:id', function (req, res) {
    var questJSON = JSON.parse(fs.readFileSync("data/highscores.json"));
	res.send(questJSON[req.params.id.substring(1, req.params.id.length)]);
});

app.put('/scores/:id', function (req, res) {
    var questJSON = JSON.parse(fs.readFileSync("data/highscores.json"));
    questJSON[req.params.id.substring(1, req.params.id.length)] = req.body;
    fs.writeFileSync("data/highscores.json", JSON.stringify(questJSON));
    res.send("Yay!!!");
});


app.listen(process.env.PORT || 5000);
