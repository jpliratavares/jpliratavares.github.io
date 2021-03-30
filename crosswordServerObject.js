var fs = require('fs');

var crosswordClues = [];
var crosswordAnswers = {};
var crosswordBoard = [];
var crosswordData = {};

module.exports.clientCrossword = crosswordData;

module.exports.init = function () {
	var data, crosswordRawData, startpos, newClues, crosswordRow,
		i, l;

	data = fs.readFileSync('crossword.json');
	crosswordRawData = JSON.parse(data);

	startpos=[[-1,-1]];
	startpos=startpos.concat(crosswordRawData.clues.map(function(x){
		return x.position.split(",").map(function(x){return parseInt(x.trim());});
		}).sort(function(x,y){return x[0]==y[0]?x[1]-y[1]:x[0]-y[0];}));
	l=startpos.length;
        for(i=0;i<l-1;i++){
		if(startpos[i].toLocaleString()==startpos[i+1].toLocaleString()){
			startpos.splice(i,1);
			i-=1;
			l-=1;
		}
	}
	newClues = {};
	crosswordRawData.clues.forEach(function(clue){
		var clueKey = startpos.map(function(x){ return x.toLocaleString() }).indexOf(clue.position)+(clue.direction=="across"?"a":"d");
		newClues[clueKey]={q: clue.clue, length: clue.answer.length};
		crosswordAnswers[clueKey]=clue.answer.toUpperCase();
	});
	crosswordData.type="createCrossword";
	crosswordData.title=crosswordRawData.title;
	crosswordData.description=crosswordRawData.description;
	crosswordData.height=crosswordRawData.height;
	crosswordData.width=crosswordRawData.width;
	crosswordData.startpos=startpos;
	crosswordData.clues=newClues;
	//Creating the crossword board
	crosswordBoard = new Array();
	i=crosswordData.height;
	while(i--){
		j=crosswordData.width;
		crosswordRow=new Array();
		while(j--){
			crosswordRow.push(-1);
		}
		crosswordBoard.push(crosswordRow);
	}
}

module.exports.addAnswer = function (clueKey, guess, playerIndex) {
	var score = 0,
		noSquaresFilled = 0,
		i, j, x, y, clueNo, clueDir, length;
	if(crosswordAnswers[clueKey] == guess){
		clueNo=parseInt(clueKey);
		clueDir=clueKey.slice(-1);
		i=crosswordData.startpos[clueNo][0];
		j=crosswordData.startpos[clueNo][1];
		length=guess.trim().length;
		while(length--){
			x=(clueDir=="d")?i+length:i;
			y=(clueDir=="a")?j+length:j;
			
			if(crosswordBoard[x][y]==-1){
				crosswordBoard[x][y]=playerIndex;
				noSquaresFilled+=1;
			}
		}
		score = 10;
		if(noSquaresFilled==0)
			score=0;
	} else {
		score = -3;
	}
	return score;
}
