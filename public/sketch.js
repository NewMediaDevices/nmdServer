var socket;
var c;

function setup() {
  createCanvas(400, 400);
  background(0);
  c = color(random(255));
  // Start a socket connection to the server
  // Some day we would run this server somewhere else
  socket = io.connect('http://10.3.211.97:3000');
  socket.on('mouse', newDrawing);
}


function draw() {
  // Nothing

}

function mouseDragged() {
  noStroke();
  fill(c);
  ellipse(mouseX, mouseY, 10, 10);

  var data = {
    x: mouseX,
    y: mouseY,
    color: c
  };

  socket.emit('mouse', data);
}

function newDrawing(data) {
  noStroke();
  fill(random(50));
  ellipse(data.x, data.y, 10, 10);
}
