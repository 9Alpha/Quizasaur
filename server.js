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
    var questJSON = fs.readFileSync("questions1.json");
	res.send(questJSON);
});

app.post('/scores', function (req, res) {
    //console.log("******************************************");
    //console.log(req.body);
    //console.log("******************************************");
    fs.writeFileSync("questions1.json", JSON.stringify(req.body));
    res.send("Yay!!!");
});


app.listen(process.env.PORT || 5000);
