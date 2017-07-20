//Setup
//Get canvas location from html
var stage = document.getElementById("gameCanvas");
var ctx = stage.getContext("2d");

//Set Up variables
var STAGE_WIDTH = 400,
	STAGE_HEIGHT = 600,
	TIME_PER_FRAME = 10, 
	GAME_FONTS = "bold 20px Arial";

stage.width = STAGE_WIDTH;
stage.height = STAGE_HEIGHT;
ctx.fillStyle = "grey";
ctx.font = GAME_FONTS;
	
var BUG_WIDTH = 10,
	BUG_HEIGHT = 40;
	FOOD_DEM = 20;

//Initial values
var gameloop, mouseX, mouseY, level, highscore,level_sel, pause, isClicked, bugArrayBlack,bugArrayRed,
bugArrayOrange, foodArray, score, bugDeath;
isClicked = false;
kill_bug = false;
bug_score = 0;
bc = "white";
test = false;
score = 0;
//Repeated in case user decides to play level 1 only 
if (typeof localStorage.highscore_lvl1 === 'undefined'){
	localStorage.highscore_lvl1 = 0;
}
if (typeof localStorage.highscore_lvl2 === 'undefined'){
	localStorage.highscore_lvl2 = 0;
}
level_sel = 1;

//Setup bug and food arrays
var one;
var spawn;
var time_frames;
var death_frames;
var bug_frames;
var time;
var food_num;
var bSpeed;
var rSpeed;
var oSpeed;

//start menu and mouse click
window.addEventListener("load", start_menu, false);	
stage.addEventListener("click", canvasClick, false);		


//Start Page
function start_menu() {
	//Set background colour
	ctx.fillStyle = "grey";
	ctx.fillRect(0, 0, stage.width, stage.height);

	//Level 
	ctx.font = "20px Arial";
	ctx.fillStyle = "black";
	ctx.fillText("Level: " , 40, 200); 
	ctx.closePath();
	ctx.stroke();

	//Level selection 
	if (level_sel == 1) {
		//Level 1 box
		ctx.beginPath();
		ctx.fillStyle = "#266548";
		ctx.fillRect(100,170,50,50);
		ctx.fillStyle = "black";
		ctx.font = "20px Arial"
		ctx.fillText("One", 105, 200);
		ctx.closePath();
		ctx.stroke();

		//Level 2 box
		ctx.beginPath();
		ctx.rect(200,170,50,50);
		ctx.fillStyle = "black";
		ctx.fillText("Two", 205, 200);
		ctx.closePath();
		ctx.stroke();

		//Highsore
		ctx.fillText("Highscore: " + localStorage.highscore_lvl1, 40, 250);
	} else {
		//Level 1 box
		ctx.beginPath();
		ctx.rect(100,170,50,50);
		ctx.fillStyle = "black";
		ctx.font = "20px Arial"
		ctx.fillText("One", 105, 200);
		ctx.closePath();
		ctx.stroke();

		//Level 2 box
		ctx.beginPath();
		ctx.fillStyle = "#266548";
		ctx.fillRect(200,170,50,50);
		ctx.fillStyle = "black";
		ctx.fillText("Two", 205, 200);
		ctx.closePath();
		ctx.stroke();

		//Highscore
		ctx.fillText("Highscore: " + localStorage.highscore_lvl2, 40, 250);
	}

	//Start button
	ctx.fillStyle= "#416330";
	ctx.fillRect(125,300,150,50);
	ctx.font = "30px Arial";
	ctx.fillStyle= "black";
	ctx.fillText("Start", 167, 335);

	//Press
    stage.addEventListener("click", start_menu_buttons);
}

//Initalize variables for game stages depending on buttons selected
function start_menu_buttons(event){
	//Mouse position
	var rect = stage.getBoundingClientRect();
    var pointX = event.clientX - rect.left;
    var pointY = event.clientY - rect.top;

    //Level selection
    //Level 1 box
    if ((100 <= pointX) && (100 + 50 >= pointX) &&
                 (170 <= pointY) && (170 + 50 >= pointY)) {

		level_sel = 1;
		stage.width = 400;
		start_menu()

    }
    //Level two box
    if ((200 <= pointX) && (200 + 50 >= pointX) &&
                 (170 <= pointY) && (170 + 50 >= pointY)) {

		level_sel = 2;
		stage.width = 400;
		start_menu()
    }

    //Start button pressed
    if ((125 <= pointX) && (125 + 150 >= pointX) &&
                 (300 <= pointY) && (300 + 50 >= pointY)) {

    	stage.removeEventListener("click", start_menu_buttons);

    	//Initialize starting variables
    	foodArray = new Array();
    	bugArray = new Array();
    	bugDeath = new Array();
    	one = 1;
		spawn = Math.floor(Math.random() * 200 + 101);
		time_frames = 0;
		bug_frames = 0;
		death_frames = 0;
		time = 60;
		food_num = 5;

		//Always start at level 1
		bSpeed = 1.5;
		rSpeed = 0.75;
		oSpeed = 0.6;
		level_sel = 1;

    	gameloop = setInterval(frame, TIME_PER_FRAME);
    }
}

//Game Pages
//Constant Functions
function info_bar() {
	//bar
	ctx.clearRect(0, 0, stage.width, 50);
	ctx.beginPath();
	ctx.rect(0, 0, stage.width, 50);
	ctx.fillStyle = "#525252";
	ctx.fill();

	//score
	ctx.fillStyle= "#000000";
	ctx.font = "20px Arial";
	ctx.fillText("Score: ", 275, 35);

	//timer 
	ctx.fillText("Timer: ", 20, 35);

	//pause
	ctx.beginPath();
	ctx.rect(175, 5, 50, 40);
	ctx.fillStyle = "#36648B";
	ctx.fill();
	ctx.fillStyle = "white";
	ctx.fillText("||", 195, 30);

	//Press
    stage.addEventListener("click", pause_button);

}

function pause_button(event){
	//Mouse position
	var rect = stage.getBoundingClientRect();
    var pointX = event.clientX - rect.left;
    var pointY = event.clientY - rect.top;
    //Start button attributes
    var rectX = 175;
    var rectY = 5;
    var rectWidth = 50;
    var rectHeight = 40;

	//Start button pressed
    if ((rectX <= pointX) && (rectX + rectWidth >= pointX) &&
                 (rectY <= pointY) && (rectY + rectHeight >= pointY)) {

    	if (pause == 0){
    		ctx.beginPath();
			ctx.rect(175, 5, 50, 40);
			ctx.fillStyle = "#36648B";
			ctx.fill();

    		//Play button
    		ctx.beginPath();
			ctx.fillStyle="white";
			ctx.moveTo(192, 15);
			ctx.lineTo(212, 25);
			ctx.lineTo(192, 35);
			ctx.closePath();
			ctx.fill();

    		clearTimeout(gameloop);
    		pause = 1;
    	} else {
    		gameloop = setInterval(frame, TIME_PER_FRAME);
    		pause = 0;
    	}
    }
}

function frame() {
	//Set pause value
	pause = 0;
	//Background colour
	if (level_sel == 1){ 
		//Level 1
		ctx.fillStyle = "#435d3f";
	} else { 
		//Level 2
		ctx.fillStyle = "#7e9775";
	}
	ctx.fillRect(0, 0, stage.width, stage.height);
	ctx.fillStyle = "white";
	ctx.fillText("Level: " + level_sel, 325, 595);

	//Test region for 20% food spawn
	//ctx.fillStyle = "blue";
	//ctx.fillRect(0, 0, stage.width, 120);	

	//Time management
	spawn -= one;
	time_frames += one;

	if (time_frames == 100) {
		time -=1;
		time_frames = 0;
	}

	//Show bug score for 30 seconds
	if (kill_bug == true) {
		bug_frames += one
		if (bug_frames <= 50) {
			if (bc == "orange"){
				ctx.fillStyle = bc;
				ctx.fillText("+" + bug_score, 5, 595);
			} else if (bc == "red") {
				ctx.fillStyle = bc;
				ctx.fillText("+" + bug_score, 25, 595);
			} else if (bc == "black"){
				ctx.fillStyle = bc;
				ctx.fillText("+" + bug_score, 45, 595);
			}
		} else {
			bug_frames = 0;
			kill_bug = false;
		}
	}

	//Food init
	if (foodArray.length < food_num) {
		var newFood = new Object();
		newFood.x = Math.floor(Math.random() * (375 - 5 + 1)) + 5;
		newFood.y = Math.floor(Math.random() * (575 - 120 + 1)) + 120;
		foodArray.push(newFood);
	}

	//Spawn food
	for (var i=foodArray.length - 1; i >= 0; i--){
		drawFood(foodArray[i].x, foodArray[i].y);
	}
	
	//Bug init
	if (spawn == 0) {
		var newBug = new Object();
		newBug.x = Math.floor(Math.random() * (390 - 10 + 1)) + 10;
		newBug.y = 45;
		newBug.xPrev1 = newBug.x;
		newBug.xPrev2 = newBug.x;
		newBug.yPrev1 = newBug.y;
		newBug.yPrev2 = newBug.y;
		newBug.count = 0;

		var ran = Math.floor(Math.random() * 10 + 1);
		if (ran <= 3) {
			newBug.speed = bSpeed;
			newBug.maxSpeed = 4;
			newBug.score = 5;
			newBug.colour = "0,0,0";
			newBug.bc = "black";
			newBug.fade = 1;
		} else if (ran <= 6) {
			newBug.speed = rSpeed;
			newBug.maxSpeed = 11;
			newBug.score = 3;
			newBug.colour = "255,0,0";
			newBug.bc = "red";
			newBug.fade = 1;
		} else {
			newBug.speed = oSpeed;
			newBug.maxSpeed = 12;
			newBug.score = 1;
			newBug.colour = "255,128,0";
			newBug.fade = 1;
			newBug.bc = "orange";
		}

		bugArray.push(newBug);
		spawn = Math.floor(Math.random() * 200 + 101);
	}

	//Bug movement
	for (var i=bugArray.length - 1; i >= 0; i--){
		var closest = 0;
		var closestDist = 1000;
		var closestX;
		var closestY; 
		for (var f = 0; f < foodArray.length; f++) {

			var xCoord = foodArray[f].x - bugArray[i].x;
			var yCoord = foodArray[f].y - bugArray[i].y;
			var dist = Math.sqrt(Math.pow(xCoord, 2) + Math.pow(yCoord, 2));

			if (dist < 2) {
				foodArray.splice(f, 1);
				food_num -= 1;
			}

			if (closestDist > dist) {
				closest = f;
				closestDist = dist;
				closestX = Math.abs(xCoord);
				closestY = Math.abs(yCoord);
				xDir = xCoord / closestX;
				yDir = yCoord / closestY;
			}
		}

		if (bugArray[i].count <= 0) {
			bugArray[i].xPrev2 = bugArray[i].xPrev1;
			bugArray[i].yPrev2 = bugArray[i].yPrev1;
			bugArray[i].xPrev1 = bugArray[i].x;
			bugArray[i].yPrev1 = bugArray[i].y;
			bugArray[i].count = bugArray[i].maxSpeed;
		}
		else {
			bugArray[i].count -= 1;
		}

		if (i in bugDeath) {
			death_frames += one;
			if (death_frames <= 100) {
				bugArray[i].fade -= .01;
			} else {
				bugArray[i].click = false;
				death_frames = 0;
				bugArray.splice(i, 1);
    			index = -1;
				for(var x = 0, len = bugDeath.length; x < len; x++) {
				    if (bugDeath[x] === i) {
				        index = x;
				        break;
				    }
				}
				bugDeath.splice(index, 1);
			}
		} else {
			bugArray[i].x += xDir * (closestX / (closestX + closestY)) * bugArray[i].speed;
			bugArray[i].y += yDir * (closestY / (closestX + closestY)) * bugArray[i].speed;
		}

		if (typeof bugArray[i] != 'undefined'){
			drawBug(bugArray[i].x, bugArray[i].y,
			bugArray[i].xPrev1, bugArray[i].yPrev1,
			bugArray[i].xPrev2, bugArray[i].yPrev2,
			bugArray[i].colour, bugArray[i].fade);
		}
		//Check for a click on the canvas
		if (isClicked) {
			//Check for click on a bug
			if (TestClick(bugArray[i].x - BUG_WIDTH - 30, bugArray[i].y - BUG_HEIGHT - 30, 
				BUG_WIDTH + 60, BUG_HEIGHT + 60, mouseX, mouseY) && mouseY > 50){
				score += bugArray[i].score;
				bug_score = bugArray[i].score;
				bc = bugArray[i].bc;
				//bugArray.splice(i, 1);
				kill_bug = true;
				bugDeath.push(i);
			}				
		}
	}

	isClicked = false;

	//Score and menu
	info_bar();
	ctx.fillStyle = "white";
	ctx.fillText(score, 350, 35);
    ctx.fillText(time, 90, 35);
    if (level_sel == 1 && localStorage.highscore_lvl1 < score){
		localStorage.highscore_lvl1 = score;
	} else if (level_sel == 2 && localStorage.highscore_lvl2 < score){
		localStorage.highscore_lvl2 = score;
	}
    
    //End game on no food (lose) then go back to end page
    if (foodArray.length == 0) {
    	time =  60;
    	food_num = 5;
    	foodArray = null;
    	bugArray = null;
    	bugDeath = null;
    	score = 0;
    	clearTimeout(gameloop);
    	stage.width = 400;
    	game_end();
    //End game on a win then proceed to next or end page
    } else if (time == 0){ 
    	time =  60;
    	food_num = 5;
    	foodArray = null;
    	bugArray = null;
    	bugDeath = null;
    	score = 0;
    	clearTimeout(gameloop);
    	stage.width = 400;
    	
    	//Go to level 2 or end page
    	if (level_sel == 1) {
    		//Initalize variables for level 2
    		time = 60;
	    	clearTimeout(gameloop);
	    	score = 0;
	    	foodArray = new Array();
	    	bugArray = new Array();
	    	bugDeath = new Array();
	    	one = 1;
			spawn = Math.floor(Math.random() * 200 + 101);
			time_frames = 0;
			bug_frames = 0;
			death_frames = 0;
			food_num = 5;
			level_sel = 2;

			//Initalize level 2 speed here since it skips starting function
			bSpeed = 2;
			rSpeed = 1;
			oSpeed = 0.8;

    		gameloop = setInterval(frame, TIME_PER_FRAME);

    	} else if (level_sel == 2) {
    		game_end();
    	}

    }
}

//End Page
function game_end() {
	ctx.clearRect(0, 0, stage.width, stage.height);
	stage.removeEventListener("click", pause_button);

	ctx.fillStyle = "grey";
	ctx.fillRect(0, 0, stage.width, stage.height);	
	ctx.fillStyle ="black";
	ctx.font = "30px Arial";
	ctx.fillText("Game over!" , 30, 150);
	ctx.fillText("Level 1 Highscore: " + localStorage.highscore_lvl1, 30, 200);
	ctx.fillText("Level 2 Highscore: " + localStorage.highscore_lvl2, 30, 250);

	//restart
	ctx.beginPath()
	ctx.rect(125,300,150,50);
	ctx.fillStyle= "#416330";
	ctx.fill();
	ctx.fillStyle= "#000000";
	ctx.font = "30px Arial";
	ctx.fillText("Restart", 150, 335);
	ctx.closePath();

	//quit
	ctx.beginPath()
	ctx.rect(125,400,150,50);
	ctx.fillStyle= "#416330";
	ctx.fill();
	ctx.fillStyle= "#000000";
	ctx.font = "30px Arial";
	ctx.fillText("Quit", 167, 435);
	ctx.closePath();

	//Press
    stage.addEventListener("click", end_button);
}

function end_button(event){
	//Mouse position
	var rect = stage.getBoundingClientRect();
    var pointX = event.clientX - rect.left;
    var pointY = event.clientY - rect.top;

    //Restart at level 1
    if ((125 <= pointX) && (125 + 150 >= pointX) &&
                 (300 <= pointY) && (300 + 50 >= pointY)) {

    	stage.removeEventListener("click", end_button);

        //Initialize starting variables
    	time = 60;
    	clearTimeout(gameloop);
    	stage.width = 400; 
    	score = 0;
    	foodArray = new Array();
    	bugArray = new Array();
    	bugDeath = new Array();
    	one = 1;
		spawn = Math.floor(Math.random() * 200 + 101);
		time_frames = 0;
		bug_frames = 0;
		death_frames = 0;
		food_num = 5;
		level_sel = 1;

    	gameloop = setInterval(frame, TIME_PER_FRAME);
    }

    // quit
    if ((125 <= pointX) && (125 + 150 >= pointX) &&
                 (400 <= pointY) && (400 + 50 >= pointY)) {
		stage.removeEventListener("click", end_button);
		ctx.clearRect(0, 0, stage.width, stage.height);
		stage.width = 400;
		start_menu();
    }
}

//Bug clicking functions
function canvasClick(event)
{	
	mouseX = event.clientX - stage.offsetLeft + document.body.scrollLeft;
	mouseY = event.clientY - stage.offsetTop + document.body.scrollTop;
	isClicked = true;
}

function TestClick(x1, y1, w1, h1, x2, y2)
{
	//x1, y1 = x and y coordinates of object 1
	//w1, h1 = width and height of object 1
	//x2, y2 = x and y coordinates of object 2
	if ((x1 <= x2 && x1+w1 >= x2) &&
		(y1 <= y2 && y1+h1 >= y2)){
			return true;
		} else {
			return false;
		}
}


//Draw functions
function drawFood(xPos, yPos)
{
	// Draw triangle pizza
	ctx.beginPath();
	ctx.fillStyle="#ffdab9";
	ctx.moveTo(0 + xPos, 5 + yPos);
	ctx.lineTo(15 + xPos,0 + yPos);
	ctx.lineTo(20 + xPos,20 + yPos);
	ctx.closePath();
	ctx.fill();

	// Draw pizza crust
	ctx.beginPath();
	ctx.fillStyle="#8e6058";
	ctx.moveTo(0 + xPos,5 + yPos);
	ctx.lineTo(15 + xPos,0 + yPos);
	ctx.lineTo(15 + xPos,2 + yPos);
	ctx.lineTo(3 + xPos,6 + yPos);
	ctx.closePath();
	ctx.fill();

	//Pepperoni
	ctx.beginPath();
	ctx.fillStyle="#962a2a";
	ctx.arc(8 + xPos,7 + yPos,2,0,2*Math.PI);
	ctx.arc(13 + xPos,8 + yPos,2,0,2*Math.PI);
	ctx.closePath();
	ctx.arc(15 + xPos,13 + yPos,2,0,2*Math.PI);
	ctx.fill();
}

function drawBug(xPos, yPos, xPrev1, yPrev1, xPrev2, yPrev2, colour, fade) {
	// bug head
	ctx.beginPath();
	ctx.arc(xPos, yPos, 7, 0, 2*Math.PI);
	ctx.fillStyle = "rgba(" + colour + "," + fade + ")";
	ctx.closePath();
	ctx.fill();

	//eyes
	ctx.beginPath();
	ctx.arc(xPos + 3,yPos + 5,3,0,2*Math.PI);
	ctx.arc(xPos - 5,yPos + 5,3,0,2*Math.PI);
	ctx.fillStyle = "rgba( 255,255,255," + fade + ")";
	ctx.fill();
	ctx.closePath()

	//bug body
	ctx.beginPath();
	ctx.arc(xPrev1, yPrev1 - 4, 5, 0, 2 * Math.PI, false);
	ctx.fillStyle = "rgba(" + colour + "," + fade + ")";
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(xPrev2, yPrev2 - 5, 5, 0, 2 * Math.PI, false);
	ctx.fillStyle = "rgba(" + colour + "," + fade + ")";
	ctx.fill();
	ctx.closePath();
}