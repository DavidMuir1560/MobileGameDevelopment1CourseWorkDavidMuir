
// Sets the Variables for the canvas
var canvas;
var canvasContext;
var canvasX;   // Canvas X value
var canvasY;   // Canvas Y value
var mouseIsDown = 0; // If the mouse is being clicked


var sPlayerJet;   // The Player's object
var sPlayerBullet; // The player's Bullets
var sEnemyJet1;    // The 1st Enemy Plane
var sEnemyJet2;    // The 2nd Enemy Plane
var sEnemyJet3;    // The 3rd Enemy Plane
var LevelBackground;  // The Level background

// Buttons


var sPlayButton;    // The sprite for the Play Button
var sReplayButton;  // The sprite for the Replay Button
var sInstructionButtons;  // The button for the Instructions page
var sQuitButton;     // The Sprite for the Quit button

var LeftArrowButton;    // The sprite for the Left on Screen Virtual Controller
var RightArrowButton;   // The Sprite for the Right on Screen Virtual Controller
var FireButton;         // The Sprite for the onscreen Fire Button


var lastPt= null;
var fired = false;     // Boolean that checks if the player has fired their gun

var EJet1Active = true;    // Booleans to check if the Enemy jets are spawned
var EJet2Active = false;
var EJet3Active = false;

var GameState = 0;   // The game's currrent State
var PlayerScore =0;  // The players Current Score while playing the game
var FinalScore = 0;  // The Player's score once they have lost the game

var PlayerLives = 3; // The players Lives

var TouchX = 0;      // The X position of the users touch
var TouchY = 0;      // The Y position of the Users touch
var TouchXUp = 0;    // The X position of the users stopping the touch
var TouchYUP = 0;    // The Y position of the users stopping the touch


var MainMusic = new Audio ("MainMusic.mp3");    // The Music for the game
var GunfireSound = new Audio ("PlayerFiring.wav");  // Sound played when the Player shoots their gun
var EnemyDestroyed = new Audio ("Explosion.wav");   // Sound that play when an enemy is destroyed
var GameOverSound = new Audio ("Explosion.wav");    // Sound that plays when the player loses

function load()   // This function is called when the game is started
{

canvas = document.getElementById ("gameCanvas");  // Gets the gameCanvas from the CSS file
canvasContext = canvas.getContext("2d");

init();     // Calls the Initialisation function

canvasX = canvas.width/2;  // Sets the X value for the canvas
canvasY = canvas.height -30; // Sets the Y value for the canvas

GameLoop();  // Calls the gameloop function

}


function aSprite (x,y, imageSRC, velx, vely)    // Sets the variables for sprites
{
this.zindex = 0;
this.x = x;  // The sprites X value
this.y = y;  // The Sprites Y value
this.vx = velx;  // The sprites X velocity
this.vy = vely;  // The sprites Y velocity
this.sImage = new Image();
this.sImage.src = imageSRC;
}

aSprite.prototype.renderF = function(width, height)    // This functions renders sprites with a set width and height
{
canvasContext.drawImage(this.sImage, this.x,this.y, width,height);
}

aSprite.prototype.render = function()    // This function renders sprites without parameters
{
canvasContext.drawImage(this.sImage, this.x,this.y);
}

aSprite.prototype.update = function (deltaTime, tX, tY)  // This function updates the sprites X and Y position
{
this.x += deltaTime * this.vx;
this.y += deltaTime * this.vy;

}

function init()   // This function initialises the game
{

if (canvas.getContext)  //If the canvas has a context
{

window.addEventListener ('resize', resizeCanvas, false);       // Create a Event Listner for a canvas Resize
window.addEventListener ('orientationchange', resizeCanvas, false);  // Creates an event listener for a oreintation change
canvas.addEventListener ("touchstart", TouchDown, false);  // Creates an event listner for the start of a touch
canvas.addEventListener ("touchMove", TouchXY, true);     // Creates an event listner for touch movement
canvas.addEventListener ("touchend", TouchUp, false);    // Creates an event listner for the end of a touch
document.body.addEventListener ("touchcancel", TouchUp, false);  // Creates an event listner for a canceled touch

resizeCanvas();  // Resizes the canvas

LevelBackground = new aSprite (0,0, "LevelBackground.png",0,0);  // Loads and sets the Background image for the game
sPlayerJet = new aSprite (canvas.width/2 -50, canvas.height - 150, "PlayerJet.png",0,0); // Loads and sets the Sprite for the Player's Jet
sPlayerBullet = new aSprite (sPlayerJet.x+500,sPlayerJet.y+300, "BulletSprite.png", +120,0);  // // Loads and sets the sprite for the players Bullet

sEnemyJet1 =new aSprite(canvas.width/2 -300 , canvas.height/ 2- 120 , "EnemyJet.png", ((Math.random() * 50) + 25), 0); // Loads and sets the sprites for the Enemy Jets
sEnemyJet2 =new aSprite(canvas.width/2 -300 , canvas.height/ 2 +10 , "EnemyJet.png", ((Math.random() * 50) + 25), 0);
sEnemyJet3 =new aSprite(canvas.width/2 -300 , canvas.height/ 2- 50 , "EnemyJet.png", ((Math.random() * 50) + 25), 0);

// Menu Buttons
sTitle = new aSprite (canvas.width/2 -300,canvas.height/2 -180, "Title.png",0,0);   // Loads and sets the Image for the Title card on the main menu
sPlayButton = new aSprite(canvas.width/2 - 100 , canvas.height /2 - 120, "PlayButton.png",0,0);   // Loads and sets the Sprite for the Play Button
sInstructionButtons = new aSprite (canvas.width/2  , canvas.height/2 - 120 , "InstructionsButton.png",0,0);  // Loads and sets the sprite for the Instructions button
sQuitButton = new aSprite (canvas.width/2 +100 , canvas.height/2 -120, "QuitButton.png", 0,0); // Loads and sets the sprite for the Quit button
sMenuButton = new aSprite (canvas.width/2 - 120, canvas.height/2 - 120, "MenuButton.png",0,0); // Loads and sets the sprite for the Menu button
sReplayButton = new aSprite (canvas.width/2 - 120, canvas.height/2 - 350, "ReplayButton.png", 0,0); // Loads and sets the sprite for the Replay button

sInterceptInfo = new aSprite(canvas.width/2 -250,canvas.height/2 -120, "Interceptinfo.png",0,0);   // Loads and sets the image for the How to play text
sButtonInfo = new aSprite(canvas.width/2 -150,canvas.height/2 -120, "Buttoninfo.png",0,0);
sShootInfo = new aSprite(canvas.width/2 -50,canvas.height/2 -120, "ShootInfo.png",0,0);
sGameOverInfo = new aSprite(canvas.width/2 +40 ,canvas.height/2 -120, "GameOverInfo.png",0,0);
sLifeInfo = new aSprite(canvas.width/2 + 100 ,canvas.height/2-50 ,"LifeInfo.png",0,0);
sPointsInfo = new aSprite(canvas.width/2 +150 ,canvas.height/2 -120, "PointsInfo.png",0,0);

CurrentTime = Date.now();   // Sets the current time
startTimeMS = Date.now();

GameState = 0;   // Sets the Game state to 0, The main Menu state

}

}

function resizeCanvas()   // Resizes the canvas
{
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}



function GameLoop()    // This function holds the Game loop
{

var elapsed = (Date.now() - startTimeMS)/1000;   // Finds the elapsed time in milliseconds
update(elapsed); // Updates the game
render(elapsed); // Draws the update
startTimeMS = Date.now(); //
requestAnimationFrame(GameLoop);
collisionDetection();   // calls the Collision detection function
PlayerScore = elapsed;  // Adds to the players score based on how long they have survived



}


function render(delta)    // This function renders the game
{
LevelBackground.renderF(canvas.width,canvas.height);  // Renders the Background image for the game

switch(GameState)   // This switch statements carries out different functions based on the games current Game State
{
case 0:  // If the player is at the Main menu

sTitle.renderF(120,380);   // This Renders the Title card
sPlayButton = new aSprite(canvas.width/2 - 100 , canvas.height /2 - 120, "PlayButton.png",0,0); // This loads and sets the values for the Play button
sPlayButton.renderF(100,240); // This renders the Play button
sInstructionButtons = new aSprite (canvas.width/2  , canvas.height/2 - 120 , "InstructionsButton.png",0,0);  // This loads and sets the values for the Play button
sInstructionButtons.renderF (100,240); // This renders the Instructions button
sQuitButton = new aSprite (canvas.width/2 +100 , canvas.height/2 -120, "QuitButton.png", 0,0);  // This loads and sets the values for the Quit button
sQuitButton.renderF (100,240); // This renders the quit button
//canvasContext.fillText("How To Play", canvas.width/2, canvas.height/2 -100);

break;


case 1:   // If the player is at the Instructions screen

styleText ("Black", "50px Courier New", "left", "middle");
MainMusic.play();
sInstructionButtons = new aSprite (canvas.width/2 -350  , canvas.height/2- 100 , "InstructionsButton.png",0,0);   // // Loads and sets the values for the instructions Title card
sInstructionButtons.renderF(100,200);   // This Renders the Title card

sMenuButton = new aSprite (canvas.width/2 + 240, canvas.height/2 , "MenuButton.png",0,0); // Loads and sets the the values for the menu button
sMenuButton.renderF (100,200); // This Renders the menu button
//sPlayButton.renderF (100,240);
sPlayButton = new aSprite(canvas.width/2 +240 , canvas.height /2 -200 , "PlayButton.png",0,0); // This loads and sets the values for the Play Button
sPlayButton.renderF (100,200); // This renders the play button

sInterceptInfo.renderF(100,300);       // This section Renders the informational text explaining how to play the game
sButtonInfo.renderF(100,300);
sShootInfo.renderF(100,300);
sPointsInfo.renderF(100,300);
sGameOverInfo.renderF(100,300);
sLifeInfo.renderF(75,140);


//canvasContext.fillText ("Return To Main Menu", canvas.width/2,canvas.height/2 -100);
//canvasContext.fillText ("PLAY", canvas.width/2+ 200, canvas.height/2 + 100);

break;


case 2:  // If the Player is playing the game
MainMusic();
styleText("Black", "30px Courier New", "left","middle");  // Sets the values for the text
canvasContext.fillText("Score: "+PlayerScore, 20, 20);       // Displays the Players Score on screen
canvasContext.fillText("Player Lives:" +PlayerLives,300,20);      // Displays the Players lives on Screen
sPlayerJet = new aSprite (canvas.width/2 +200, canvas.height/2 -150, "PlayerJet.png",0,0);  // // Loads and sets the Player's jet
sPlayerJet.renderF (100,100);    // This Renders the players Jet
sEnemyJet1.renderF (100,150);    // This Renders the Enemy Jet
sPlayerBullet.renderF(100,50);   // This Renders the Players Bullet


sLeftArrowButton = new aSprite(canvas.width/2 +270 , canvas.height /2+100 , "LeftArrow.png",0,0);   // Loads and sets the On screen Virtual Left button
sLeftArrowButton.renderF (100,75);    // This renders the Left button
sRightArrowButton = new aSprite(canvas.width/2 +270 , canvas.height /2 , "RightArrow.png",0,0);  // // Loads and sets the On screen Virtual Right Button
sRightArrowButton.renderF (100,75);  // This renders the Right button
sFireButton = new aSprite(canvas.width/2 +270 , canvas.height /2 -200 , "FireButton.png",0,0);  // // Loads and sets the On screen Fire button
sFireButton.renderF (100,100); // Renders the fire button
break;


case 3:   // If the player is at the Game Over screen


GameOverSound.Play();
sGameOverTitle = new aSprite (canvas.width/2 -300,canvas.height/2 -180, "GameOver.png",0,0); // Loads and sets the Game over Title Image
sGameOverTitle.renderF(120,380);   //  This renders the game over image

sReplayButton = new aSprite(canvas.width/2 +270 , canvas.height /2 -200 , "ReplayButton.png",0,0);  // // Loads and sets the Replay Button
sReplayButton.renderF(100,200);    // Renders the Replay button

sMenuButton = new aSprite (canvas.width/2 + 270, canvas.height/2  , "MenuButton.png",0,0);  // Loads and sets the Menu button
sMenuButton.renderF (100,200);  // Renders the Menu Button

break;
}
}



function update(delta)  // Updates the game
{

switch(GameState)       // Depending on the current Game state certain functions will be carried out
{


case 2:    // If the player is playing the Game

sPlayerJet.update(delta);  // Updates the Players Jet

if (fired == true)   // If the Player has fired their gun
{
sPlayerBullet.update(delta);  // Then update the Player's bullet
}

if (EJet1Active == true)   // If the 1st Enemy Jet has spawned then
{
sEnemyJet1.update(delta);  // Update the 1st Enemy Jet
}

if (EJet2Active == true)  // If the 2nd Enemy Jet has spawned then
{
sEnemyJet2.update(delta);  // Update the 2nd Enemy Jet
}

if (EJet3Active == true)  // If the 3rd Enemy Jet has spawned then
{
sEnemyJet3.update(delta); // Update the 3rd Enemy Jet
}

break;

}

}





function collisionDetection()   // This function checks for collision between objects
{

switch (GameState)  // Checks for different collisions depending on the Game state
{

case 0:  // If the player is at the main menu


if( TouchX <sPlayButton.x + 100 && TouchX > sPlayButton.x && TouchY < sPlayButton.y + 100 && TouchY > sPlayButton.y)    // And they press on the Play button
{
console.log("Playing Game");
TouchX = null;  // The Touch X and Y positions are reset
TouchY = null;
GameState = 2;   // It moves the game state to the game Level
EJet1Active =true; // Sets the Enemy jets to active
EJet2Active =true;
EJet3Active =true;
CurrentTime = Date.now();   // Sets the current time
RestartGame();  // And calls the Restart game Function

}


if (TouchX < sInstructionButtons.x +100 && TouchX > sInstructionButtons.x && TouchY < sInstructionButtons.y + 240 && TouchY > sInstructionButtons.y)  // If the Player presses the instructions button
{
console.log("How to Play");
TouchX = null;  // The Touch X and Y position are reset
TouchY = null;
GameState = 1; // It moves the game state to the How to play screen
}


if (TouchX <sQuitButton + 240 && TouchX > sQuitButton.x && TouchY < sQuitButton.y + 100 && TouchY > sQuitButton.y)    // If the Player presses the Quit Button
{
Console.log("Quitting");
Quit();  // It calls the quit Function
}

break;


case 1:  // In the Instruciton screen

if (TouchX < sPlayButton.x + 100 && TouchX > sPlayButton.x && TouchY < sPlayButton.y +200 && TouchY > sPlayButton.y)   // If the player presses the Play Button
{
TouchX = null;  // The Touch X and Y position are reset
TouchY = null;
GameState = 2;   // The game state moves to the Game level
}

if (TouchX< sMenuButton.x + 100 && TouchX >sMenuButton.x && TouchY < sMenuButton.y + 200 && TouchY > sMenuButton.y)
{
TouchX = null; // The Touch X and Y position are reset
TouchY = null;
GameState =0  // The game state moves back to the main menu
}

break;


case 2:  // If the Player is playing the Game



if (TouchX < sFireButton.x +100 && TouchX > sFireButton.x && TouchY < sFireButton.y + 240 && TouchY > sFireButton.y)     // If the player presses the fire button
{
fired = true;  // Sets fired to True
sPlayerBullet = new aSprite (sPlayerJet.x, sPlayerJet.y- 20 , "BulletSprite.png", -120, 0);   // Creates a bullet sprite
TouchX =null; // The Touch X and Y position are reset
TouchY = null;
PlayerFiring.play();
}

if (TouchX < sLeftArrowButton.x +100 && TouchX > sLeftArrowButton.x && TouchY < sLeftArrowButton.y + 240 && TouchY > sLeftArrowButton.y)   // If the player presses the Left Arrow button
{
console.log ("Move Left");
TouchX =null; // The Touch X and Y position are reset
TouchY = null;
sPlayerJet.x = sPlayerJet.x +30;
}

if (TouchX < sRightArrowButton.x +100 && TouchX > sRightArrowButton.x && TouchY < sRightArrowButton.y + 240 && TouchY > sRightArrowButton.y)  // If the player presses the Right Arrow button
{
TouchX =null; // The Touch X and Y position are reset
TouchY = null;
console.log ("Move Right");

}


if (sPlayerBullet.x +20 > sEnemyJet1.x && sPlayerBullet.x + 20 < sEnemyJet1.x +100 && sPlayerBullet.y > sEnemyJet1.y && sPlayerBullet < sEnemyJet1.y+ 100)   // If the Players Bullet hits Enemy Jet
{
EnemyDestroyed.play();   // Plays the Enemy destoryed Explosion sound
PlayerScore +=1000;  // Increases the players score by 1000
Fired = false;       // Sets fired to false
sEnemyJet1 = new aSprite ( Math.random() * canvas.width, -300, "EnemyJet.png", 40, 20);  // Spawns a new Enemy jet
Explosion.play();
}

if (sPlayerBullet.x +20 > sEnemyJet2.x && sPlayerBullet.x + 20 < sEnemyJet2.x +100 && sPlayerBullet.y > sEnemyJet2.y && sPlayerBullet < sEnemyJet2.y+ 100) // If the Players Bullet hits Enemy Jet
{
EnemyDestroyed.play(); // Plays the Enemy destoryed Explosion sound
PlayerScore +=1000; // Increases the players score by 1000
Fired = false;   // Sets fired to false
sEnemyJet2 = new aSprite ( Math.random() * canvas.width, -300, "EnemyJet.png", 40, 20); // Spawns a new Enemy jet
Explosion.play();
}

if (sPlayerBullet.x +20 > sEnemyJet3.x && sPlayerBullet.x + 20 < sEnemyJet3.x +100 && sPlayerBullet.y > sEnemyJet3.y && sPlayerBullet < sEnemyJet3.y+ 100) // If the Players Bullet hits Enemy Jet
{
EnemyDestroyed.play(); // Plays the Enemy destoryed Explosion sound
PlayerScore +=1000; // Increases the players score by 1000
Fired = false;   // Sets fired to false
sEnemyJet3 = new aSprite ( Math.random() * canvas.width, -300, "EnemyJet.png", 40, 20);  // Spawns a new Enemy jet
Explosion.play();
}

if (EJet1Active == true)      // If the Enemy Jet is alive
{
if (sEnemyJet1.x > canvas.width)  // and if it has escaped past the player
{
console.log ("Jet Escaped");
sEnemyJet1 =new aSprite(canvas.width/2 -300 , canvas.height/ 2- 120 , "EnemyJet.png", ((Math.random() * 50) + 25), 0);   // It Spawns a new jet
sEnemyJet1.renderF (100,150);  // Renders the new jet
if (PlayerLives >0)   // Checks if the player has lives left
{
PlayerLives -= PlayerLives;  // Removes a life
}
else   // Otherwise
{
FinalScore = PlayerScore;  // Sets the final score
GameState = 3;    // Switch to the Game Over screen
}

}
}


if (EJet2Active == true)     // If the Enemy Jet is alive
{
if (sEnemyJet2.x > canvas.width)  // and if it has escaped past the player
{
sEnemyJet2 =new aSprite(canvas.width/2 -300 , canvas.height/ 2 + 20 , "EnemyJet.png", ((Math.random() * 50) + 25), 0); // It spawns a new jet
sEnemyJet2.renderF (100,150);  // Renders the new jet
if (PlayerLives >0)  // Checks if the player still has lives
{
PlayerLives -= PlayerLives; // Removes a life
}
else  // Otherwise
{
FinalScore = PlayerScore;  // Set final score
GameState = 3;  // Switch to game over screen
}
}

}

if (EJet3Active == true)  // If the Enemy Jet is alive
{

if (sEnemyJet3.x > canvas.width) // and if it has escaped past the player
{
sEnemyJet3 =new aSprite(canvas.width/2 -300 , canvas.height/ 2 + 80 , "EnemyJet.png", ((Math.random() * 50) + 25), 0);  // It spawns a new jet
sEnemyJet3.renderF (100,150); // Renders the new jet
if (PlayerLives >0) // Checks if the player still has lives
{
PlayerLives -= PlayerLives; // Removes a life
}
else   // Otherwise
{
FinalScore = PlayerScore; // Set final score
GameState = 3; // Switch to game over screen

}
}
}


////// The following section carries out collision detection between the players jet and the enemy jets
///// This was to add danger to the player flying around the environment however it has been removed as player movement could not be implemented in time


//if (sEnemyJet1.x > sPlayerJet.x && sEnemyJet1.x < sPlayerJet.x + 100 && sEnemyJet1.x +100 > sPlayerJet.x && sEnemyJet1.x +100 < sPlayerJet.x +100)
//{
//sEnemyJet1 = new aSprite (Math.random()* canvas.width , -300, "EnemyJet.png",40,20);
//PlayerLives -= PlayerLives;
//PlayerDestroyed.play();

//if ( PlayerLives =0)
//{
//TouchX =null;
//TouchY = null;
//FinalScore = PlayerScore;
//GameState = 4
//}
//}


//if (sEnemyJet2.x > sPlayerJet.x && sEnemyJet2.x < sPlayerJet.x + 100 && sEnemyJet2.x +100 > sPlayerJet.x && sEnemyJet2.x +100 < sPlayerJet.x +100)
//{
//sEnemyJet2 = new aSprite (Math.random()* canvas.width , -300, "EnemyJet.png",40,20);
//PlayerLives -= PlayerLives;
//PlayerDestroyed.play();

//if ( PlayerLives =0)
//{
//TouchX =null;
//TouchY = null;
//FinalScore = PlayerScore;
//GameState = 4

//}

//}

//if (sEnemyJet3.x > sPlayerJet.x && sEnemyJet3.x < sPlayerJet.x + 100 && sEnemyJet3.x +100 > sPlayerJet.x && sEnemyJet3.x +100 < sPlayerJet.x +100)
//{
//sEnemyJet3 = new aSprite (Math.random()* canvas.width , -300, "EnemyJet.png",40,20);
//PlayerLives -= PlayerLives;
//PlayerDestroyed.play();

//if ( PlayerLives =0)
//{
//TouchX =null;
//TouchY = null;
//FinalScore = PlayerScore;
//gameState = 4
//}


break;


case 3:  //If the player is at the Game over screen

if (TouchX < sReplayButton.x +240 && TouchX > sReplayButton.x && TouchY < sReplayButton.y + 100 && TouchY > sReplayButton.y)  // If they press the Replay button
{

PlayerLives = 3;  // Resets the Players lives
score = 0;       // Resets the players scores
RestartGame();  // Calls the Restart game Function
TouchX = null;  // Resets the Touch X and Y values
TouchY = null;

CurrentTime = Date.now(); // Sets the current time

GameState = 2;  // Switches to the Game level

}

if (TouchX< sMenuButton.x + 100 && TouchX >sMenuButton.x && TouchY < sMenuButton.y + 200 && TouchY > sMenuButton.y)   // If the player presses the Main Menu button
{

TouchX = null; // Resets the Touch X and Y values
TouchY = null;
GameState =0   // Switches to the Main menu

}
break;

}
}




function styleText (TextColour, TextFont, TextAlign, TextBaseLine)   // Sets the Variables for Text being used in the game
{
canvasContext.fillStyle = TextColour;
canvasContext.font = TextFont;
canvasContext.textAlign = TextAlign;
canvasContext.textBaseLine = TextBaseLine



}

function RestartGame()   // This function is used to reset the position of the player and enemy jets when the game is restarted
{
sPlayerJet = new aSprite (canvas.width/2 -50, canvas.height - 150, "PlayerJet.png",0,0);
sPlayerBullet = new aSprite (sPlayerJet.x+500,sPlayerJet.y+300, "BulletSprite.png", +120,0);

sEnemyJet1 =new aSprite(canvas.width/2 -300 , canvas.height/ 2- 120 , "EnemyJet.png", ((Math.random() * 50) + 25), 0);
sEnemyJet2 =new aSprite(canvas.width/2 -300 , canvas.height/ 2 +10 , "EnemyJet.png", ((Math.random() * 50) + 25), 0);
sEnemyJet3 =new aSprite(canvas.width/2 -300 , canvas.height/ 2- 50 , "EnemyJet.png", ((Math.random() * 50) + 25), 0);
}

function TouchUp (Event)   // When the Player stops touching the device
{
Event.preventDefault();
lastPt = null;
}


function TouchDown(Event)   // When the player touches the Device
{
Event.preventDefault();
TouchXY(Event);
}

function TouchXY (Event)
{
Event.preventDefault();

TouchX = Event.touches[0].pageX - canvas.offsetLeft;
TouchY = Event.touches[0].pageY - canvas.offsetTop;


}
