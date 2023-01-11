const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
var engine, world;
var canvas, angle, tower, ground, cannon, boat;
var balls = []
var boats = []

var bSpriteSheet; //hoja de sprites
var bSpriteData; //hoja de datos
var bAnimation = []; //array de botes
var brokenBSpriteSheet;
var brokenBSpriteData;
var brokenBAnimation = [];
var explosionS
var fondo;
var isGameOver = false;

function preload() {
  backgroundImg = loadImage("./assets/background.gif");
  towerImage = loadImage("./assets/tower.png");

  bSpriteSheet = loadImage("./assets/boat/boat.png");
  bSpriteData = loadJSON("./assets/boat/boat.json");

  brokenBSpriteSheet = loadImage("./assets/boat/broken_boat.png");
  brokenBSpriteData = loadJSON("./assets/boat/broken_boat.json");

  explosionS = loadSound("./assets/cannon_explosion.mp3");
  fondo = loadSound("./assets/background_music.mp3");
}

function setup() {
  canvas = createCanvas(1200, 600);
  engine = Engine.create();
  world = engine.world;
  angle = 0//-PI / 4;
  ground = new Ground(0, height - 1, width * 2, 1);
  tower = new Tower(150, 350, 160, 310);
  cannon = new Cannon(180, 110, 100, 50, angle);
  cannonBall = new CannonBall(cannon.x, cannon.y);

  var bFrames = bSpriteData.frames;
  for (var i = 0; i < bFrames.length; i++) {//posicion de cada cuadro 
    var pos = bFrames[i].position;
    var img = bSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);//Recorte de la hoja de sprites
    bAnimation.push(img);//guardar el recorte en el array
  }

  var brokenBFrames = brokenBSpriteData.frames;
  for (var i = 0; i < brokenBFrames.length; i++) {//posicion de cada cuadro 
    var pos = brokenBFrames[i].position;
    var img = brokenBSpriteSheet.get(pos.x, pos.y, pos.w, pos.h);//Recorte de la hoja de sprites
    brokenBAnimation.push(img);//guardar el recorte en el array
  }

}


function draw() {
  background(189);
  image(backgroundImg, 0, 0, width, height);

  if (!fondo.isPlaying()) {//!=negación
    fondo.play();
    fondo.setVolume(0.5);//Ajustar el volumen
  }


  Engine.update(engine);
  ground.display();


  cannon.display();
  tower.display();
  cannonBall.display();
  showBoats();



  //Bucle
  for (var i = 0; i < balls.length; i++) {//i++ de 1 en 1
    showCannonBalls(balls[i], i);//ver bala que disparamos
    for (var j = 0; j < boats.length; j++) {
      if (balls[i] !== undefined && boats[j] !== undefined) {//si hay balas y botes
        var colision = Matter.SAT.collides(balls[i].body, boats[j].body);//si chocan
        if (colision.collided) {
          boats[j].destroy(j);

          Matter.World.remove(world, balls[i].body);
          balls.splice(i, 1);
          i--;//le quita la bala que chocó
          var chocar = Matter.SAT.collides(tower.body, boats[j].body);
          if (chocar.collided) {
            isGameOver = true;
            gameOver()
          }
        }
      }
    }
  }


}

function keyPressed() {
  if (keyCode === DOWN_ARROW) {
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    balls.push(cannonBall);

  }
}

function showCannonBalls(ball, index) {//index= NO. de bala
  ball.display();
  if (ball.body.position.x >= width || ball.body.position.y >= height - 50) {
    Matter.World.remove(world, ball.body);
    balls.splice(index, 1);//bala que se elimina
  }
}



function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    balls[balls.length - 1].shoot();
    explosionS.play();
  }
}

function showBoats() {
  if (boats.length > 0) {
    if (boats.length < 4 && boats[boats.length - 1].body.position.x < width - 400) {
      var positions = [-130, -100, -120, -80];
      var posicion = random(positions);
      boat = new Boat(width, height - 100, 200, 100, posicion, bAnimation);
      boats.push(boat);
    }
  } else {
    boat = new Boat(width, height - 100, 200, 100, -100, bAnimation);
    boats.push(boat);
  }

  for (var i = 0; i < boats.length; i++) {//i++ de 1 en 1
    Matter.Body.setVelocity(boats[i].body, {
      x: -0.9,
      y: 0
    });
    boats[i].display();
    boats[i].animate();
  }
}

function gameOver() {
  swal(
    {
      title: "Game over",
      confirmButtonText: "Play again",
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
}