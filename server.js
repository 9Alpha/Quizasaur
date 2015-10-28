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
    if (req.body === null){
        console.log(JSON.stringify(req.body));
    } else 
        console.log("Failed");
    //fs.writeFileSync("public/js/questions1.json", JSON.stringify(req.body));
	res.send(req.body);
});


app.listen(process.env.PORT || 5000);
