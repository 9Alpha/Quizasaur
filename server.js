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
	res.send(questJSON[req.params.id]);
});

app.put('/quiz/:id', function (req, res) {
    var questJSON = JSON.parse(fs.readFileSync("data/allQuizes.json"));
    questJSON[req.params.id] = req.body;
    fs.writeFileSync("data/allQuizes.json", JSON.stringify(questJSON));
    res.send("Yay!!!");
});

app.post('/quiz', function (req, res) {
    var questJSON = JSON.parse(fs.readFileSync("data/allQuizes.json"));
    var scoreJSON = JSON.parse(fs.readFileSync("data/highscores.json"));
    scoreJSON.push(JSON.parse("[]"));
    questJSON.push(req.body);
    fs.writeFileSync("data/allQuizes.json", JSON.stringify(questJSON));
    res.send("Yay!!!");
});

app.delete('/quiz/:id', function (req, res) {
    var questJSON = JSON.parse(fs.readFileSync("data/allQuizes.json"));
    var scoreJSON = JSON.parse(fs.readFileSync("data/highscores.json"));
    questJSON.splice(req.params.id, 1);
    scoreJSON.splice(req.params.id, 1);
    fs.writeFileSync("data/allQuizes.json", JSON.stringify(questJSON));
    res.send("Yay!!!");
});

app.get('/scores/:id', function (req, res) {
    var questJSON = JSON.parse(fs.readFileSync("data/highscores.json"));
    res.send(questJSON[req.params.id]);
});

app.put('/scores/:id', function (req, res) {
    var questJSON = JSON.parse(fs.readFileSync("data/highscores.json"));
    questJSON[req.params.id] = req.body;
    fs.writeFileSync("data/highscores.json", JSON.stringify(questJSON));
    res.send("Yay!!!");
});

app.listen(process.env.PORT || 5000);
