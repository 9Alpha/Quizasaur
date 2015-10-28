var $loginPage, $questPage, $finPage, $nameIn;
var userName, quizLen, currentPage, numCorrect; 
var pageAnswered = [];
var tags = [];
var quiz;
var answChoice = [];
var answCorrect = [];
var questChosen = true;
var okToGo = true;
var fadeAgain = true;
var questsToUse = [];
var rightTags = [];
var wrongTags = [];
var pieColors = ["#6495ED", "#DC143C", "#00FFFF", "#00008B", "#B8860B", "#A9A9A9", "#006400", "#8B008B", "#556B2F", "#FF8C00", "#8B0000", "#8FBC8F"];

function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getTags() {
	for (var i = 0; i < quiz.questions.length; i++) {
		for (var j = 0; j < quiz.questions[i].meta_tags.length; j++) {
			if (tags.length === 0) {
				tags.push(quiz.questions[i].meta_tags[j]);
				break;
			}
			for (var k = 0; k < tags.length; k++) {
				if (quiz.questions[i].meta_tags[j] === tags[k]) {
					break;
				} else if (k === tags.length - 1) {
					tags.push(quiz.questions[i].meta_tags[j]);
				}
			}
		}
	}
}


function makeGoodPie() {
	var canvas;
	var ctx;
	var lastend = 0;
	var myTotal = (function() {
		var tot = 0;
		for (var i = 0; i < rightTags.length; i++) {
			tot+=rightTags[i];
		}
		return tot;
	})();

	canvas = document.getElementById('right');
	ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < rightTags.length; i++) {
		ctx.fillStyle = pieColors[i];
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(100,100);
		ctx.arc(100,100,100,lastend,lastend+
			(Math.PI*2*(rightTags[i]/myTotal)),false);
		ctx.lineTo(100,100);
		ctx.fill();
		lastend += Math.PI*2*(rightTags[i]/myTotal);
	}
}

function makeBadPie() {
	var canvas;
	var ctx;
	var lastend = 0;
	var myTotal = (function() {
		var tot = 0;
		for (var i = 0; i < wrongTags.length; i++) {
			tot+=wrongTags[i];
		}
		return tot;
	})();

	canvas = document.getElementById('wrong');
	ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < wrongTags.length; i++) {
		ctx.fillStyle = pieColors[i];
		ctx.strokeStyle= "#000000";
		ctx.lineWidth = 5;
		ctx.beginPath();
		ctx.moveTo(100,100);
		ctx.arc(100,100,100,lastend,lastend+
			(Math.PI*2*(wrongTags[i]/myTotal)),false);
		ctx.lineTo(100,100);
		ctx.fill();
		lastend += Math.PI*2*(wrongTags[i]/myTotal);
	}
}

function toFinish() {
        
    
	$questPage.hide();
	
	numCorrect = 0;
	getTags();

	var forQuestTable = "";
	var forLegend = "";

	forQuestTable += "<thead><tr><th>Question</th><th>Result</th><th>Global Percent Correct</th></tr></thead>"

	for (var i = 0; i < tags.length; i++) {
		rightTags.push(0);
		wrongTags.push(0);
	}

	for (var i = 0; i < quizLen; i++) {
        
        quiz.questions[questsToUse[i]].global_total++;

		if (answCorrect[i]) {
			numCorrect++;
            
            quiz.questions[questsToUse[i]].global_correct++;

			forQuestTable += "<tr><td>"+quiz.questions[questsToUse[i]].text+"</td><td class=\"success\">Correct</td><td>"+Math.round((quiz.questions[questsToUse[i]].global_correct/quiz.questions[questsToUse[i]].global_total)*100)+"%</td></tr>"

			for (var j = 0; j < quiz.questions[questsToUse[i]].meta_tags.length; j++) {
				for (var k = 0; k < tags.length; k++) {
					if (quiz.questions[questsToUse[i]].meta_tags[j] === tags[k]) {
						rightTags[k]++;   
						break;
					}
				}
			}
		} else {

			forQuestTable += "<tr><td>"+quiz.questions[questsToUse[i]].text+"</td><td class=\"danger\">Incorrect</td><td>"+Math.round((quiz.questions[questsToUse[i]].global_correct/quiz.questions[questsToUse[i]].global_total)*100)+"%</td></tr>"

			for (var j = 0; j < quiz.questions[questsToUse[i]].meta_tags.length; j++) {
				for (var k = 0; k < tags.length; k++) {
					if (quiz.questions[questsToUse[i]].meta_tags[j] === tags[k]) {
						wrongTags[k]++;   
						break;
					}
				}
			}
		}
	}
    
    $.post('/scores', JSON.stringify(quiz)).done( function(data) {
        quiz = data;  
        console.log(quiz);
        }).fail( function(){ 
            alert("Fail");
    });

	for (var k = 0; k < tags.length; k++) {
		forLegend += "<div id=\"key"+k+"\"><label id=\"lkey"+k+"\" class=\"legend\" for=\"key"+k+"\">"+tags[k]+"</label></div><br>"
	}

	$('#leg').html(forLegend);


	$('#viewAnsw').html(forQuestTable);

	makeGoodPie();
	makeBadPie();


	if (numCorrect === quizLen) {
		$('#note').text("Perfect score! Way to go!");
	} if (numCorrect < quizLen) {
		$('#note').text("You\'re on your way to LoTR mastery!");
	} if (numCorrect <= Math.round(quizLen*.75)) {
		$('#note').text("A solid showing!");
	} if (numCorrect <= Math.round(quizLen*.5)) {
		$('#note').text("It could have been better!");
	} if (numCorrect <= Math.round(quizLen*.25)) {
		$('#note').text("Good try!");
	} if (numCorrect === 0) {
		$('#note').text("A perfect zero! That\'s impressive!");
	} 

	$('#score').text("You got "+numCorrect+" questions right out of "+quizLen+"!");


    $finPage.fadeIn(200);

}

function nameIsThere() {
	if ($nameIn.val().length > 0) {
		toQuestions();
	} else {
		$('#getName').attr('class', 'has-error');
		$('#lName').text('You forgot to put in your name!');
	}
}

function toQuestions() {
    
    $.getJSON('/quiz')
    .done( function(data) {  
        quiz = data;
        
        
        quizLen = 2;//quiz.questions.length;
        for (var i = 0; i < quizLen; i++) {
            var a = randomInt(0, quiz.questions.length - 1);
            while (questChosen === true && questsToUse.length !== 0) {
                for (var j = 0; j < questsToUse.length; j++) {
                    if (questsToUse[j] === a) {
                        a = randomInt(0, quiz.questions.length - 1);
                        break;
                    } else if (j === questsToUse.length-1) {
                        questChosen = false;
                    }
                }
            } 
            questsToUse.push(a);
            console.log(questsToUse[i]);
            questChosen = true;
            pageAnswered.push(false);
            answCorrect.push(false);
        }

        $('#quizTitle').text("Welcome to the \""+quiz.title+"\"");
        $('#quizDes').text(quiz.description);

        $loginPage.hide();

        userName = $nameIn.val();
        $('#nameTitle').text('Hey ' + userName + '!');
        $('#quest').text(quiz.questions[questsToUse[0]].text);

        currentPage = 0;


        var radioHTML = "";

        for (var i = 0; i < quiz.questions[questsToUse[currentPage]].answers.length; i++) {
            radioHTML += "<input type=\"radio\" id=\"r"+i+"\" name=\"answer\"><label id=\"lr"+i+"\" for=\"r"+i+"\"></label><br>";
        }

        $('#getAnswer').html(radioHTML);

        for (var i = 0; i < quiz.questions[questsToUse[currentPage]].answers.length; i++) {
            $('#lr'+i).text(quiz.questions[questsToUse[currentPage]].answers[i])
        }

        $('input[name="answer"]').prop('checked', false);
        if (pageAnswered[currentPage]) {
            for (var i = 0; i < quiz.questions[questsToUse[currentPage]].answers.length; i++) {
                if (i === answChoice[currentPage]) {
                    $('#r'+i).prop('checked', true);
                    break;
                }
            }
        }

        $questPage.fadeIn(200);
    }).fail( function() {
     alert("Quiz JSON file not found");   
    });
    
    
    

}  

function toLogin() {
	$loginPage.show();
	$questPage.hide();
}




$nameIn = $('#name');
$loginPage = $('#login');
$questPage = $('#questions');
$finPage = $('#fin');
$questPage.hide();
$finPage.hide();
$('#back').hide();



$('#continue').on('click', nameIsThere);

$nameIn.on('return', function(e) {
    alert("Enter");
	e.preventDefault();
    nameIsThere();
})
$('#getAnswer').on('click', function() {
	pageAnswered[currentPage] = false;
})

$('#forward').on('click', function() {
	
	

	if (pageAnswered[currentPage] === false) {
		for (var i = 0; i < quiz.questions[questsToUse[currentPage]].answers.length; i++) {
			if ($('#r'+i).is(':checked')) {
				answChoice[currentPage] = i;
				if (i == quiz.questions[questsToUse[currentPage]].correct_answer) {
					answCorrect[currentPage] = true;
				}
				pageAnswered[currentPage] = true;
				okToGo = true;
				break;
			} else if (i === quiz.questions[questsToUse[currentPage]].answers.length - 1) {
				okToGo = false;
			}
		}
	}

	if (currentPage === questsToUse.length - 1) {
				fadeAgain = false;
			}

	if (okToGo) {
		$questPage.fadeOut(200);
		setTimeout(function(){
			$('#lForward').text('');


			currentPage++;


			if (currentPage === questsToUse.length) {
				toFinish();
			}

			var radioHTML = "";

			for (var i = 0; i < quiz.questions[questsToUse[currentPage]].answers.length; i++) {
				radioHTML += "<input type=\"radio\" id=\"r"+i+"\" name=\"answer\"><label id=\"lr"+i+"\" for=\"r"+i+"\"></label><br>";
			}

			$('#getAnswer').html(radioHTML);





			if (currentPage !== 0) {
				$('#back').show();
			}

			$('input[name="answer"]').prop('checked', false);
			if (pageAnswered[currentPage]) {
				for (var i = 0; i < quiz.questions[questsToUse[currentPage]].answers.length; i++) {
					if (i === answChoice[currentPage]) {
						$('#r'+i).prop('checked', true);
						break;
					}
				}
			}

			for (var i = 0; i < quiz.questions[questsToUse[currentPage]].answers.length; i++) {
				$('#lr'+i).text(quiz.questions[questsToUse[currentPage]].answers[i])
			}

			if (currentPage === questsToUse.length-1) {
				$('#forward').val('Finish');
			} else {
				$('#forward').val('Next');
			}


			$('#quest').text(quiz.questions[questsToUse[currentPage]].text);
		}, 180);

if (fadeAgain) {
	$questPage.fadeIn(200);
}

}

else {
	$('#lForward').text('You need to answer the question before continuing!');
}

})

$('#back').on('click', function() {
	if (pageAnswered[currentPage] === false) {
		for (var i = 0; i < quiz.questions[questsToUse[currentPage]].answers.length; i++) {
			if ($('#r'+i).is(':checked')) {
				answChoice[currentPage] = i;
				if (i == quiz.questions[questsToUse[currentPage]].correct_answer) {
					answCorrect[currentPage] = true;
				}
				pageAnswered[currentPage] = true;
				okToGo = true;
				break;
			} else if (i === quiz.questions[questsToUse[currentPage]].answers.length - 1) {
				okToGo = false;
			}
		}
	}

	$questPage.fadeOut(200);
	setTimeout(function(){

		currentPage--;

		var radioHTML = "";

		for (var i = 0; i < quiz.questions[questsToUse[currentPage]].answers.length; i++) {
			radioHTML += "<input type=\"radio\" id=\"r"+i+"\" name=\"answer\"><label id=\"lr"+i+"\" for=\"r"+i+"\"></label><br>";
		}

		$('#getAnswer').html(radioHTML);

		$('#lForward').text('');
		okToGo = true;


		if (currentPage === 0) {
			$('#back').hide();
		}

		$('#forward').val('Next');

		$('input[name="answer"]').prop('checked', false);
		if (pageAnswered[currentPage]) {
			for (var i = 0; i < quiz.questions[questsToUse[currentPage]].answers.length; i++) {
				if (i === answChoice[currentPage]) {
					$('#r'+i).prop('checked', true);
					break;
				}
			}
		}

		for (var i = 0; i < quiz.questions[questsToUse[currentPage]].answers.length; i++) {
			$('#lr'+i).text(quiz.questions[questsToUse[currentPage]].answers[i])
		}

		$('#quest').text(quiz.questions[questsToUse[currentPage]].text);

	}, 200);

	$questPage.fadeIn(200);
})
