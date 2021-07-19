var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround,invisibleGround2, groundImage;
var backgroundIMG
var background

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;
var canvas


function preload(){
  trex_running =   loadAnimation("sonicrun1.png","sonicrun2.png");
  trex_collided = loadImage("sonicdead (2).png");
  
  groundImage = loadImage("ground2.png");

  backgroundImage = loadImage("sonicbackground.jpg");

  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("sonicspikes.png");
  obstacle2 = loadImage("sonicspikes.png");
  obstacle3 = loadImage("sonicspikes.png");
  obstacle4 = loadImage("sonicspikes.png");
  obstacle5 = loadImage("sonicspikes.png");
  obstacle6 = loadImage("sonicspikes.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  canvas = createCanvas(2000,1200);

  background = createSprite(100,100,200,600);
  background.addImage(backgroundImage);
  background.scale = 2.5
  
  trex = createSprite(50,180,100,100);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.058;
  
  
  ground = createSprite(200,485,1200,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(600,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(600,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,485,1200,10);  
  invisibleGround2 = createSprite(200,280,1200,10);
  invisibleGround2.visible = false;
  invisibleGround.visible = false;
  invisibleGround2.x = invisibleGround2.width/2;
  invisibleGround2.velocityX = -(6 + 3*score/100);
  invisibleGround.x = invisibleGround.width/2;
  invisibleGround.velocityX = -(6 + 3*score/100);
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  text("Score: "+ score, 1100,50);

   // moving ground
   background.velocityX = -3 

   if (background.x < 600){
     background.x = background.width/2;
   }  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
	trex.velocityX = 3
    
    camera.y = trex.y;
	camera.x = trex.x;
    
    if(keyDown("space") && trex.y >= 140) {
      trex.velocityY = -12;
    }

	if(trex.x > 1000){
		trex.x = 50;
        obstaclesGroup.destroyEach();
        cloudsGroup.destroyEach();
	}
  
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 600){
      ground.x = ground.width/2;
      invisibleGround.x = invisibleGround.width/2;
      invisibleGround2.x = invisibleGround2.width/2;
    }
  
    trex.collide(invisibleGround);
    //spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){          
        gameState = END;
    }
    
    if(invisibleGround2.isTouching(trex)){          
      trex.velocityY=3;
  }
	
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
	trex.velocityX = 0
	
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || keyDown("R")) {
      reset();
    }
  }
   
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(1300,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(1300,465,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.25;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
   trex.x = 50
  
  score = 0;
  
}