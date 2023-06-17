/*

extension 1 - Adding Sound :
for extension 1 I did the sound part, this game project taught me lots of things like I learn how to build character drawing on a computer and especially how the whole game work was one of the important concepts to know as a programmer and with regards to this extension of adding sound in our project completes the feeling of proper working game for me. At first, finding where to call sound function was a little bit tricky but after some practice, I figured it out how sound playing and stoping work and that's the beauty of programming once you start practising you start figuring it out that "how things works ?" 
extension 2 - building platform :
for extension 2 I did the building platform part, and I learn a lot from this game project, Building platform was an interesting thing, at first I got stuck on the concept that how it should check that it's on the platform but after learning it from professor video, I was good to go. Adding platform to our final game gives the final touch to our game project now it feels a bit more interactive and I feel like I'm getting closer and closer to become a proper game developer. the main skills which I learn from this are first building 2D drawing and second building logic behind them.

*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var clouds;
var mountains;
var trees_x;
var canyons;
var collectables;

var isPlummetingCanyonFound;
var PlummetingCanyon_details;

var game_score;
var flagpole;
var lives;

var jumpSound;
var flagSound;
var collectablesSound;
var gameoverSound;
var fallingSound;
var backgroundSound;

var platform;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.3);
    flagSound = loadSound('assets/flagpole.wav');
    flagSound.setVolume(0.3);
    collectablesSound = loadSound('assets/coin.wav');
    collectablesSound.setVolume(0.3);
    gameoverSound = loadSound('assets/gameover.wav');
    gameoverSound.setVolume(0.4);
    fallingSound = loadSound('assets/falling.wav');
    fallingSound.setVolume(0.3);
    backgroundSound = loadSound('assets/background.wav');
    backgroundSound.setVolume(0.3);
}
function setup()
{
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
    lives = 3;
    startGame();

}
function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground
    //translate code
    push();
    translate(scrollPos,0);
	// Draw clouds.
    drawCloud();
	// Draw mountains.
    drawMountains();
	// Draw trees.
    drawTree();
    // Draw platforms
    for(var i=0;i<platform.length;i++)
    {
        platform[i].draw();
    }
	// Draw canyons.
    for(var i=0;i<canyons.length;i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
        whichCanyonPlummeting(canyons[i]);
    }
	// Draw collectable items.
    for(var i=0;i<collectables.length;i++)
    {
        if(!collectables[i].isFound)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
    }
    
    // draw flag
    renderFlagpole();
    if(!flagpole.isReached)
    {
        checkFlagpole();
    }
    
    //translate code pop statement
    pop();
	// Draw game character.
	drawGameChar();
    // To check if player dies
    checkPlayerDie();
    
    // draw game score board
    fill(255);
    noStroke();
    text("Score : " + game_score, 20, 20);
    for(var i=0;i<lives;i++)
    {
        text("How many lives remaining : ", 20, 40);
        life_token_face(185+(i*40),90);
    }
    
    // Condition statement for game over and end of the game 
    if(lives<1)
    {
        push();
        fill(50);
        noStroke();
        textSize(50);
        text("Game Over", (width/2)-100, height/2);
        pop();
        return;
    }
    else if(flagpole.isReached)
    {
        push();
        fill(50);
        noStroke();
        textSize(50);
        text("Level complete", (width/2)-150, height/2);
        pop();
        return;
    }
    
	// Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}

	// Logic to make the game character rise and fall.
    if(gameChar_y!=floorPos_y)
    {
        var isContact=false;
        for(var i=0;i<platform.length;i++)
        {
            if(platform[i].checkContact(gameChar_world_x,gameChar_y))
            {
                isContact=true;
                break;
                
            } 
        };
        if(!isContact)
        {
            gameChar_y=gameChar_y+2;
            isFalling=true;
        }
        else
        {
            isFalling=false;
        }
    }   
    else
    {
        isFalling=false;        
    }
    // Logic to make character Plummet
    if(isPlummeting)
    {
        gameChar_y=gameChar_y+2;
        stayInCanyon_whilePlummeting(PlummetingCanyon_details);
    
    } 
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}
// ---------------------
// Key control functions
// ---------------------
function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.
	//open up the console to see how these work

    if(keyCode == 37)
    {
        isLeft=true;
    }
    else if(keyCode == 39)
    {
        isRight=true;
    }
    if(keyCode == 32)
    {   
        if(!isFalling)
        {
            gameChar_y=gameChar_y-150;
            jumpSound.play();
        }    
    }
}
function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
    if(keyCode == 37)
    {
        isLeft=false;
    }
    else if(keyCode == 39)
    {
        isRight=false;
    }
}
// ------------------------------
// Game character render function
// ------------------------------
// Function of life token face
function life_token_face(gameChar_x, gameChar_y)
{
    push();
    fill(251,227,206);
    rect(gameChar_x-11,gameChar_y-64,22,22,0,0,5,5);//face
    fill(0);
    ellipse(gameChar_x,gameChar_y-65,25,8);//hair
    fill(255,255,255);
    strokeWeight(1);
    stroke(200);
    ellipse(gameChar_x-5,gameChar_y-56,7,7);//eyes
    ellipse(gameChar_x+5,gameChar_y-56,7,7);
    strokeWeight(2);
    stroke('purple');
    point(gameChar_x-5,gameChar_y-54.5);//eye ball
    point(gameChar_x+5,gameChar_y-54.5);
    strokeWeight(1);
    stroke(0);
    line(gameChar_x-3,gameChar_y-48,gameChar_x+3,gameChar_y-48);//smile
    pop();
}
// Function to checkPlayerDie
function checkPlayerDie()
{
    if(gameChar_y<height+3 && gameChar_y>height)
    {
        lives -= 1;
        if(lives>0)
        {
            startGame();
        }
    }
}
// Function to re start the game
function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    game_score = 0;
    flagpole = {isReached: false, x_pos: 3400};
    
    //platform variable initialisations
    platform=[];
    platform.push(createPlatform(300,floorPos_y-100,100));
    platform.push(createPlatform(600,floorPos_y-100,150));
    platform.push(createPlatform(800,floorPos_y-200,150));
    platform.push(createPlatform(700,floorPos_y-300,100));
    platform.push(createPlatform(1250,floorPos_y-130,300));
    platform.push(createPlatform(1727,floorPos_y-100,100));
    platform.push(createPlatform(1900,floorPos_y-200,230));
    platform.push(createPlatform(2627,floorPos_y-100,150));
    platform.push(createPlatform(2827,floorPos_y-200,150));
    platform.push(createPlatform(2727,floorPos_y-300,100));
    platform.push(createPlatform(2430,floorPos_y-300,200));
	// Variable to control the background scrolling.
	scrollPos = 0;
    // Variable to control found Plummeting Canyon
    isPlummetingCanyonFound=true;
	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    clouds = [{x_pos: 100 , y_pos: 100, size: .2},
              {x_pos: 600 , y_pos: 130, size: .5},
              {x_pos: 800 , y_pos: 50 , size: .8},
              {x_pos: 1200, y_pos: 100, size: .7},
              {x_pos: 1600, y_pos: 130, size: .7},
              {x_pos: 2200, y_pos: 50 , size: .9},
              {x_pos: 2600, y_pos: 100, size: .8},
              {x_pos: 3100, y_pos: 70, size: .5},
              {x_pos: 3200, y_pos: 80, size: .8}];
    mountains = [{x_pos: 400, y_pos: 433, size:.7},
                {x_pos: 900, y_pos: 433, size:.6},
                {x_pos: 1600, y_pos: 433, size:.7},
                {x_pos: 1750, y_pos: 433, size:.5},
                {x_pos: 2500, y_pos: 433, size:1},
                {x_pos: 3350, y_pos: 433, size:.8}];
    trees_x = [120,300,900,1170,1430,2150,2250,2500,2850,2930];
    canyons = [{x_pos: 200, width: 80  },
               {x_pos: 800, width: 40  },
               {x_pos: 1300, width: 100},
               {x_pos: 1500, width: 80 },
               {x_pos: 2000, width: 60 },
               {x_pos: 2400, width: 80 },
               {x_pos: 3100, width: 150}];
    collectables = [{x_pos: 200 , y_pos: 405, size: 40, isFound : false},
                    {x_pos: 750 , y_pos: 100, size: 40, isFound : false},
                    {x_pos: 300 , y_pos: 405, size: 40, isFound : false},
                    {x_pos: 400 , y_pos: 405, size: 40, isFound : false},
                    {x_pos: 1000, y_pos: 405, size: 40, isFound : false},
                    {x_pos: 1100, y_pos: 405, size: 40, isFound : false},
                    {x_pos: 1200, y_pos: 405, size: 40, isFound : false},
                    {x_pos: 2000, y_pos: 405, size: 40, isFound : false},
                    {x_pos: 2100, y_pos: 405, size: 40, isFound : false},
                    {x_pos: 2200, y_pos: 405, size: 40, isFound : false},
                    {x_pos: 2500, y_pos: 405, size: 40, isFound : false},
                    {x_pos: 2600, y_pos: 405, size: 40, isFound : false},
                    {x_pos: 2700, y_pos: 405, size: 40, isFound : false},
                    {x_pos: 1970, y_pos: 210, size: 40, isFound : false},
                    {x_pos: 2070, y_pos: 210, size: 40, isFound : false},
                    {x_pos: 2477, y_pos: 110, size: 40, isFound : false},
                    {x_pos: 2577, y_pos: 110, size: 40, isFound : false}];
    backgroundSound.stop();
    backgroundSound.loop();
}
// Function to draw the flag
function renderFlagpole()
{
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    fill(255, 0, 255);
    if(flagpole.isReached)
    {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
    }
    pop();
}
// Function to check flag
function checkFlagpole()
{
    var d= abs(gameChar_world_x - flagpole.x_pos);
    if(d<15)
    {
        flagpole.isReached=true;
        flagSound.play();
        backgroundSound.stop();
    }
}
// Function to draw the game character.
function drawGameChar()
{
	// draw game character
    if(isLeft && isFalling)
	{
		// add your jumping-left code
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x-5,gameChar_y-18,16,5,0,0,2,2);//left leg
        rect(gameChar_x,gameChar_y-19,16,4,0,0,2,0);//right leg
        pop();
        fill(153,158,55);
        rect(gameChar_x-7,gameChar_y-42,14,25);//body
        push();
        strokeWeight(1);
        stroke(255,100,100);
        fill(255,0,0);
        rect(gameChar_x-7,gameChar_y-28,13,4);//belt
        pop();
        fill(251,227,206);
        rect(gameChar_x-11,gameChar_y-64,22,22,0,0,20,5);//face
        fill(0);
        ellipse(gameChar_x,gameChar_y-65,25,8);//hair
        push();
        fill(255,255,255);
        strokeWeight(1);
        stroke(200);
        ellipse(gameChar_x-8,gameChar_y-56,7,7);//eyes
        strokeWeight(2);
        stroke('purple');
        point(gameChar_x-10,gameChar_y-55);//eye ball
        strokeWeight(1);
        stroke(0);
        line(gameChar_x-6,gameChar_y-48,gameChar_x-9,gameChar_y-48);//smile
        pop();
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x,gameChar_y-52,3,13);//right hand
        pop();
	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x-12,gameChar_y-18,16,5,0,0,2,2);//right leg
        rect(gameChar_x-17,gameChar_y-19,16,4,0,0,0,2);//left leg
        pop();
        fill(153,158,55);
        rect(gameChar_x-7,gameChar_y-42,14,25);//body
        push();
        strokeWeight(1);
        stroke(255,100,100);
        fill(255,0,0);
        rect(gameChar_x-7,gameChar_y-28,13,4);//belt
        pop();
        fill(251,227,206);
        rect(gameChar_x-11,gameChar_y-64,22,22,0,0,5,20);//face
        fill(0);
        ellipse(gameChar_x,gameChar_y-65,25,8);//hair
        push();
        fill(255,255,255);
        strokeWeight(1);
        stroke(200);
        ellipse(gameChar_x+8,gameChar_y-56,7,7);//eyes
        strokeWeight(2);
        stroke('purple');
        point(gameChar_x+10,gameChar_y-55);//eye ball
        strokeWeight(1);
        stroke(0);
        line(gameChar_x+5,gameChar_y-48,gameChar_x+8,gameChar_y-48);//smile
        pop();
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x-4,gameChar_y-52,3,13);//left hand
        pop();
	}
	else if(isLeft)
	{
		// add your walking left code
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x+2,gameChar_y-20,4,16,0,0,0,2);//right leg
        rect(gameChar_x-6,gameChar_y-20,4,16,0,0,0,2);//left leg
        pop();
        fill(153,158,55);
        rect(gameChar_x-7,gameChar_y-42,14,25);//body
        push();
        strokeWeight(1);
        stroke(255,100,100);
        fill(255,0,0);
        rect(gameChar_x-7,gameChar_y-28,13,4);//belt
        pop();
        fill(251,227,206);
        rect(gameChar_x-11,gameChar_y-64,22,22,0,0,20,5);//face
        fill(0);
        ellipse(gameChar_x,gameChar_y-65,25,8);//hair
        push();
        fill(255,255,255);
        strokeWeight(1);
        stroke(200);
        ellipse(gameChar_x-8,gameChar_y-56,7,7);//eyes
        strokeWeight(2);
        stroke('purple');
        point(gameChar_x-10,gameChar_y-55);//eye ball
        strokeWeight(1);
        stroke(0);
        line(gameChar_x-6,gameChar_y-48,gameChar_x-9,gameChar_y-48);//smile
        pop();
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x,gameChar_y-40,3,13);//right hand
        pop();
	}
	else if(isRight)
	{
		// add your walking right code
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x+2,gameChar_y-20,4,16,0,0,2,0);//right leg
        rect(gameChar_x-6,gameChar_y-20,4,16,0,0,2,0);//left leg
        pop();
        fill(153,158,55);
        rect(gameChar_x-7,gameChar_y-42,14,25);//body
        push();
        strokeWeight(1);
        stroke(255,100,100);
        fill(255,0,0);
        rect(gameChar_x-7,gameChar_y-28,13,4);//belt
        pop();
        fill(251,227,206);
        rect(gameChar_x-11,gameChar_y-64,22,22,0,0,5,20);//face
        fill(0);
        ellipse(gameChar_x,gameChar_y-65,25,8);//hair
        push();
        fill(255,255,255);
        strokeWeight(1);
        stroke(200);
        ellipse(gameChar_x+8,gameChar_y-56,7,7);//eyes
        strokeWeight(2);
        stroke('purple');
        point(gameChar_x+10,gameChar_y-55);//eye ball
        strokeWeight(1);
        stroke(0);
        line(gameChar_x+5,gameChar_y-48,gameChar_x+8,gameChar_y-48);//smile
        pop();
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x-4,gameChar_y-40,3,13);//left hand
        pop();
	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x+2,gameChar_y-27,4,16,0,0,2,0);//right leg
        rect(gameChar_x-6,gameChar_y-27,4,16,0,0,0,2);//left leg
        pop();
        fill(153,158,55);
        rect(gameChar_x-8,gameChar_y-42,16,25);//body
        push();
        strokeWeight(1);
        stroke(255,100,100);
        fill(255,0,0);
        rect(gameChar_x-8,gameChar_y-28,15,4);//belt
        pop();
        fill(251,227,206);
        rect(gameChar_x-11,gameChar_y-64,22,22,0,0,5,5);//face
        fill(0);
        ellipse(gameChar_x,gameChar_y-65,25,8);//hair
        push();
        fill(255,255,255);
        strokeWeight(1);
        stroke(200);
        ellipse(gameChar_x-5,gameChar_y-56,7,7);//eyes
        ellipse(gameChar_x+5,gameChar_y-56,7,7);
        strokeWeight(2);
        stroke('purple');
        point(gameChar_x-5,gameChar_y-54.5);//eye ball
        point(gameChar_x+5,gameChar_y-54.5);
        strokeWeight(1);
        stroke(0);
        line(gameChar_x-3,gameChar_y-48,gameChar_x+3,gameChar_y-48);//smile
        pop();
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x+9   ,gameChar_y-52,3,13);//right hand
        rect(gameChar_x-12.9,gameChar_y-52,3,13);//left hand
        pop();
	}
	else
	{
		// add your standing front facing code
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x+2,gameChar_y-20,4,16,0,0,2,0);//right leg
        rect(gameChar_x-6,gameChar_y-20,4,16,0,0,0,2);//left leg
        pop();
        fill(153,158,55);
        rect(gameChar_x-8,gameChar_y-42,16,25);//body
        push();
        strokeWeight(1);
        stroke(255,100,100);
        fill(255,0,0);
        rect(gameChar_x-8,gameChar_y-28,15,4);//belt
        pop();
        fill(251,227,206);
        rect(gameChar_x-11,gameChar_y-64,22,22,0,0,5,5);//face
        fill(0);
        ellipse(gameChar_x,gameChar_y-65,25,8);//hair
        push();
        fill(255,255,255);
        strokeWeight(1);
        stroke(200);
        ellipse(gameChar_x-5,gameChar_y-56,7,7);//eyes
        ellipse(gameChar_x+5,gameChar_y-56,7,7);
        strokeWeight(2);
        stroke('purple');
        point(gameChar_x-5,gameChar_y-54.5);//eye ball
        point(gameChar_x+5,gameChar_y-54.5);
        strokeWeight(1);
        stroke(0);
        line(gameChar_x-3,gameChar_y-48,gameChar_x+3,gameChar_y-48);//smile
        pop();
        push();
        strokeWeight(1);
        stroke(100);
        fill(251,227,206);
        rect(gameChar_x+9   ,gameChar_y-40,3,13);//right hand
        rect(gameChar_x-12.9,gameChar_y-40,3,13);//left hand
        pop();
	}
}
// ---------------------------
// Background render functions
// ---------------------------
// Function to draw cloud objects.
function drawCloud()
{
    // Draw clouds.
    for(var i=0;i<clouds.length; i++)
    {
        fill(255,255,255);
        ellipse(clouds[i].x_pos                  ,clouds[i].y_pos,100*clouds[i].size,100*clouds[i].size);
        ellipse(clouds[i].x_pos+55*clouds[i].size,clouds[i].y_pos,80*clouds[i].size ,80*clouds[i].size );
        ellipse(clouds[i].x_pos-55*clouds[i].size,clouds[i].y_pos,80*clouds[i].size ,80*clouds[i].size );
        ellipse(clouds[i].x_pos+95*clouds[i].size,clouds[i].y_pos,40*clouds[i].size ,40*clouds[i].size );
    }
}
// Function to draw mountains objects.
function drawMountains()
{
    // Draw mountains.
    for(var i=0;i<mountains.length; i++)
    {
        fill(168,134,117);
        triangle(mountains[i].x_pos                       ,mountains[i].y_pos    
                 ,mountains[i].x_pos+420*mountains[i].size,mountains[i].y_pos    
                 ,mountains[i].x_pos+225*mountains[i].size,mountains[i].y_pos-252*mountains[i].size);
        fill(148,114,96);
        triangle(mountains[i].x_pos                       ,mountains[i].y_pos    
                 ,mountains[i].x_pos+150*mountains[i].size,mountains[i].y_pos    
                 ,mountains[i].x_pos+225*mountains[i].size,mountains[i].y_pos-252*mountains[i].size);
        fill(255,255,255);
        triangle(mountains[i].x_pos+206*mountains[i].size ,mountains[i].y_pos-197*mountains[i].size
                 ,mountains[i].x_pos+268*mountains[i].size,mountains[i].y_pos-197*mountains[i].size
                 ,mountains[i].x_pos+225*mountains[i].size,mountains[i].y_pos-252*mountains[i].size);
        triangle(mountains[i].x_pos+245*mountains[i].size ,mountains[i].y_pos-200*mountains[i].size
                 ,mountains[i].x_pos+268*mountains[i].size,mountains[i].y_pos-197*mountains[i].size
                 ,mountains[i].x_pos+289*mountains[i].size,mountains[i].y_pos-169*mountains[i].size);
        fill(235,222,216);
        triangle(mountains[i].x_pos+176*mountains[i].size ,mountains[i].y_pos-197*mountains[i].size
                 ,mountains[i].x_pos+209*mountains[i].size,mountains[i].y_pos-197*mountains[i].size
                 ,mountains[i].x_pos+225*mountains[i].size,mountains[i].y_pos-252*mountains[i].size);
        triangle(mountains[i].x_pos+177*mountains[i].size ,mountains[i].y_pos-198*mountains[i].size
                 ,mountains[i].x_pos+209*mountains[i].size,mountains[i].y_pos-198*mountains[i].size
                 ,mountains[i].x_pos+180*mountains[i].size,mountains[i].y_pos-147*mountains[i].size);
    }
}
// Function to draw trees objects.
function drawTree()
{
	// Draw trees.
    for(var i=0;i<trees_x.length;i++)
    {
        push();
        fill(104,89,38);
        rect(trees_x[i],floorPos_y-120,30,120);
        stroke(2);
        strokeWeight(2);
        fill(0,155,0);
        line(trees_x[i]   ,floorPos_y-120,trees_x[i]   ,floorPos_y);
        line(trees_x[i]+30,floorPos_y-120,trees_x[i]+30,floorPos_y);
        triangle(trees_x[i]-70  ,floorPos_y-82 
                 ,trees_x[i]+100,floorPos_y-82
                 ,trees_x[i]+15 ,floorPos_y-182);
        triangle(trees_x[i]-70  ,floorPos_y-132 
                 ,trees_x[i]+100,floorPos_y-132
                 ,trees_x[i]+15 ,floorPos_y-232);
        triangle(trees_x[i]-70  ,floorPos_y-182 
                 ,trees_x[i]+100,floorPos_y-182
                 ,trees_x[i]+15 ,floorPos_y-282);
        pop();
    }
}
// ---------------------------------
// Canyon render and check functions
// ---------------------------------
// Function to draw canyon objects.
function drawCanyon(t_canyon)
{
    
    push();
    fill(100,155,255);
    rect(t_canyon.x_pos,432,t_canyon.width,144);
    fill(0,107,0);
    triangle(t_canyon.x_pos                        ,432
            ,t_canyon.x_pos                        ,576
            ,t_canyon.x_pos+t_canyon.width*30/100,576);
    stroke(2);
    strokeWeight(2);
    line(t_canyon.x_pos              ,432
         ,t_canyon.x_pos             ,576);
    line(t_canyon.x_pos+t_canyon.width ,432
         ,t_canyon.x_pos+t_canyon.width,576);
    pop();
    
	
}
// Function to check character is over a canyon.
function checkCanyon(t_canyon)
{
    if(gameChar_world_x >= t_canyon.x_pos && gameChar_world_x <= t_canyon.x_pos+t_canyon.width && gameChar_y == floorPos_y)
    {
        isPlummeting=true;
    }
}
function whichCanyonPlummeting(t_canyon)
{
    if(isPlummeting && isPlummetingCanyonFound)
    {
        isPlummetingCanyonFound=false;
        PlummetingCanyon_details=t_canyon;
        if(lives>1)
        {
            fallingSound.play();
        }
        else
        {
            gameoverSound.play();
            backgroundSound.stop();
        }
    }
}
function stayInCanyon_whilePlummeting(t_canyon)
{
    if(gameChar_world_x < t_canyon.x_pos)
    {
        gameChar_x=gameChar_x+5;
    }
    else if(gameChar_world_x > t_canyon.x_pos+t_canyon.width)
    {
        gameChar_x=gameChar_x-5;
    }
}
// ----------------------------------
// Collectable items render and check functions
// ----------------------------------
// Function to draw collectable objects.
function drawCollectable(t_collectable)
{
    // Draw collectable items
    push();
    fill(255,215,0);
    stroke(236,168,28);
    strokeWeight(5);
    ellipse(t_collectable.x_pos,t_collectable.y_pos,t_collectable.size,t_collectable.size);
    pop();
    push();
    fill(255,140,0);
    textSize(t_collectable.size*66.66/100);
    text("$",t_collectable.x_pos-8,t_collectable.y_pos+10);
    pop();
    
}
// Function to check character has collected an item.
function checkCollectable(t_collectable)
{
    if(dist(gameChar_world_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos)<30)
    {
        t_collectable.isFound=true;
        collectablesSound.play();
        game_score += 1;
    }
}
//platform functions
function createPlatform(x,y,length)
{
    var p = 
    {
        x:x,
        y:y,
        length:length,
        draw: function()
        {
            fill(154,205,50);
            rect(this.x,this.y,this.length, 20);
            fill(168,134,117);
            rect(this.x,this.y+10,this.length, 10);
            fill(104,89,38);
            rect(this.x,this.y+18,this.length, 3);
            rect(this.x+(this.length-2),this.y,this.length-(this.length-3), 20);
            
        },
        checkContact: function(gc_x,gc_y)
        {
            if(gc_x > this.x && gc_x < this.x+this.length)
            {
                var d=this.y-gc_y;
                if(d<0 && d>-4)
                {
                    return true;
                }
                
            };
            return false;
        }
    };
    return p;
}
