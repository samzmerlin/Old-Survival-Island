//scripts
var canvas = document.getElementById('canvas'); //selects the canvas
var draw = canvas.getContext('2d'); //makes draw be the thing that draws
canvas.width = window.innerWidth; //makes it use up all available width pixels
canvas.height = window.innerHeight; //makes it use up all available hight pixels
draw.translate(canvas.width / 2, canvas.height / 2); //makes 0, 0 middle
addEventListener('resize', () => { //when you change window size
  canvas.width = window.innerWidth; //set width for new window size
  canvas.height = window.innerHeight; //set hight for new window size
  draw.setTransform(1, 0, 0, 1, 0, 0); //resets transforms
  draw.translate(canvas.width / 2, canvas.height / 2); //makes 0, 0 middle
  RW = canvas.width; //how many pixles it is willing to render in the width direction
  RH = canvas.height; //how many pixles it is willing to render in the height direction
});
var px = 0; //player x			     
var py = 0; //player y
var up = false, //are you pressing w or up arrow
  right = false, //are you pressing d or right arrow
  down = false, //are you pressing s or down arrow
  left = false; //are you pressing a or left arrow
var ekey = false; //are you pressing e
var mouse; //what direction the player needs to point
var temporary; //temporary storage
var times = []; //fps thing
var fps; //fps thing
var hunger = 0; //hunger
var time = 15; //time, counts down from 15 to 0 the resets
var nearfire = 0; //are you close to a fire
var health = 10; //health
var inHand = ""; //are you holding anything
var foodpoisoned = 0; // do you have food poisoning
var rL = 60; //reach length
var RW = canvas.width; //how many pixles it is willing to render in the width direction
var RH = canvas.height; //how many pixles it is willing to render in the height direction
var moveSpeed = 4;
var holding = 0; //number of the item you are holding
var inventory = [{ item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }];
var mouseDown = 0;
var say = "";
var planeAngle = random(0, 360);
var nextsechelth = 0;
var second = false;
if (random(1, 2) == 1) {
  var planey = random(500, 1000);
} else {
  var planey = random(-500, -1000);
}
if (random(1, 2) == 1) {
  var planex = random(500, 1000);
} else {
  var planex = random(-500, -1000);
}
var insidePlane = false;
var prevX;
var prevY;
var hours = 0;
var day = true;
var dayNum = 1;
var heat = 35;
var pan = false;
var mousedown = false;
var punch = 0;
var justCollected = 0;
var itemX = [];
var itemY = [];
var itemType = [];
var itemAmount = [];
var npcNumber = []; //number of npc's
var npcIndex = -1; //next npc to move
var npcMoveInterval;
var wolfGroups = {};
var spex = 0; //spear x and y
var spey = 0;
var cy = 0; //ctable x and y
var cx = 0;
function distanceToPoint(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

function random(min, max) { //when you call the function put the minimum number, a comma, and the maximum number
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function isEven(n) {
  return n % 2 == 0;
}
//rect and other shape functions
function rect(x, y, width, height) { //draws a centered rectangle
  if (x > (-RW - width) / 2 && x < (RW + width) / 2 && y > (-RH - height) / 2 && y < (RH + height) / 2) { //makes sure it is on the screen(if not then why render)
    draw.fillRect(x - (width / 2), y - (height / 2), width, height); //becuse by default the courdenate is the top left corner of the rect it compensates by subtracting half the hight and with
  }
}
function drawBerry(x, y) {
  draw.fillStyle = "red";
  ellipse(x, y, 20, 20)
}
function drawRock(x, y) {
  draw.fillStyle = "gray";
  ellipse(x, y, 20, 20)
}
function drawStone(x, y) {
  draw.fillStyle = "gray";
  ellipse(x, y, 100, 100); //renders a circle at the stone location
}
function drawTree(x, y) {
  draw.fillStyle = "green";
  rect(x, y, 60, 60); //renders a rectangle at the tree location
}
function drawBush(x, y, berries) {
  draw.fillStyle = "green";
  ellipse(x, y, 80, 80); //renders a circle at the bush location
  draw.fillStyle = "red";
  if (berries >= 1) {
    ellipse(x - 25, y + 20, 20, 20); //renders a circle at the berry location
    if (berries >= 2) {
      ellipse(x + 25, y + 10, 20, 20); //renders a circle at the berry location
      if (berries >= 3) {
        ellipse(x - 20, y - 20, 20, 20); //renders a circle at the berry location
        if (berries >= 4) {
          ellipse(x + 10, y + 5, 20, 20); //renders a circle at the berry location
          if (berries >= 5) {
            ellipse(x - 19, y + 14, 20, 20); //renders a circle at the berry location
          }
        }
      }
    }
  }
}
function drawStick(x, y) {
  draw.fillStyle = "brown";
  rect(x, y, 20, 20)
}
function drawCTable(x, y) {
  draw.fillStyle = "black";
  rect(x, y, 40, 40)
}
function drawSpear(x, y) {
  draw.fillStyle = "black";
  ellipse(x, y, 20, 20)
}
function borderRect(x, y, width, height) { //draws a border
  if (x > (-RW / 2) && x < (RW / 2) && y > (-RH / 2) && y < (RH / 2)) { //makes sure it is on the screen(if not then why render)
    draw.strokeRect(x - (width / 2), y - (height / 2), width, height);
  }
}

function ellipse(x, y, width, height) { //draws an elipse
  if (x > (-RW - width) / 2 && x < (RW + width) / 2 && y > (-RH - height) / 2 && y < (RH + height) / 2) { //makes sure it is on the screen(if not then why render)
    draw.beginPath();
    draw.ellipse(x, y, width / 2, height / 2, Math.PI, 0, 2 * Math.PI); //becuse by default the courdenate is the top left corner of the elipse it compensates by subtracting half the hight and with
    draw.fill(); //since there is no fillellipse like there is for rect this is code after
  }
}

function write(text, x, y, maxWidth, size) {
  if (x > (-RW / 2) && x < (RW / 2) && y > (-RH / 2) && y < (RH / 2)) { //makes sure it is on the screen(if not then why render)
    draw.fillStyle = "black";
    draw.font = size + 'px Arial';
    draw.fillText(text, x, y, maxWidth); //i googled writing in canvases js and this is how its done 
  }
}

function talk() {
  if (say != "") {
    draw.fillStyle = "black";
    rect(0, 100, 505, 125)
    draw.fillStyle = "white";
    rect(0, 100, 500, 120)
    write(say, -240, 70, 480, 25);
  }
}
//gen stuff
function genTrees() {
  for (let i = 0; i < random(55, 70); i++) { //repeats 90-120 times
    itemX.push(random(-3000, 3000)); //adds a location
    itemY.push(random(-3000, 3000)); //adds a location
    itemType.push("tree"); //sets it as a tree
    itemAmount.push(1);
    for (let e = 0; e < random(0, 2); e++) { //adds a couple stick nearby
      itemX.push(itemX[itemX.length - 1] + random(-50, 50));
      itemY.push(itemY[itemY.length - 1] + random(-50, 50));
      itemType.push("stick");
      itemAmount.push(1);
    }
  }
}

function genNpcs() {
  itemX.push((Math.random() * 75) - 75); //adds a location
  itemY.push((Math.random() * 75) - 75); //adds a location
  itemType.push("crafter"); //sets it as a tree
  itemAmount.push(1);
}

function genStones() { //big rocks
  for (let i = 0; i < random(40, 55); i++) { //repeats 90-100 times
    itemX.push(random(-3000, 3000)); //adds a location to stone xs and ys
    itemY.push(random(-3000, 3000));
    itemType.push("stone"); //sets it as a stone
    itemAmount.push(1);
    for (let e = 0; e < random(1, 3); e++) { //adds a couple rocks nearby
      itemX.push(itemX[itemX.length - 1] + random(-100, 100)); //withing 100 pixles
      itemY.push(itemY[itemY.length - 1] + random(-100, 100));
      itemType.push("rock"); //sets it as a stone
      itemAmount.push(1);
    }
  }
}

function genBushes() {
  for (let i = 0; i < random(30, 40); i++) { //repeats 90-100 times
    itemX.push(random(-3000, 3000)); //adds a location to bushxs and ys
    itemY.push(random(-3000, 3000));
    itemAmount.push(random(0, 3));
    itemType.push("bush"); //sets it as a stone

  }
}

function genRabbits() {
  for (let i = 0; i < random(10, 15); i++) { //repeats 40-50 times
    itemX.push(random(-2500, 2500)); //adds a location to bushxs and ys
    itemY.push(random(-2500, 2500));
    itemAmount.push(1);
    itemType.push("rabbit")

  }
}

function genwolf() {
  for (let i = 0; i < random(5, 6); i++) { //repeats 40-50 times
    let newgroup = []
    itemX.push(random(-2500, 2500)); //adds a location to stone xs and ys
    itemY.push(random(-2500, 2500));
    itemType.push("wolf"); //sets it as a wolf
    itemAmount.push(i);
    newgroup.push([itemX.length - 1])
    for (let e = 0; e < random(3, 4); e++) { //adds a couple wolves nearby
      itemX.push(itemX[itemX.length - 1] + random(-100, 100)); //within 100 pxles
      itemY.push(itemY[itemY.length - 1] + random(-100, 100));
      itemType.push("wolf"); //sets it as a stone
      itemAmount.push(i);
      newgroup.push([itemX.length - 1])
    }
    wolfGroups[i] = newgroup;
  }
}
//redering
function renderCharacter() { //render character
  draw.fillStyle = "tan";
  temporary = mouse; //makes sure mouse pos dosnt change during the rendering prosses becuse that would mess it up
  if (pan == false) {
    ellipse(0, 0, 40, 40); //makes character
    if (punch != 0 && inHand == "") {
      draw.rotate(temporary); //rotates twards mouse
      if (punch == 1) {
        ellipse(-13, 15, 14, 14); //makes hand
        ellipse(13, 35, 14, 14); //makes hand
        rect(13, 20, 9, 20);
      } else {
        ellipse(13, 15, 14, 14); //makes hand
        ellipse(-13, 35, 14, 14); //makes hand
        rect(-13, 20, 9, 20);
      }

    } else {
      draw.rotate(temporary); //rotates twards mouse
      ellipse(13, 15, 14, 14); //makes hand
      ellipse(-13, 15, 14, 14); //makes hand
    }
  } else {
    ellipse(0 - px, 0 - py, 40, 40); //makes character at center
    draw.rotate(temporary); //rotates twards mouse
  }
  renderHand();
  draw.rotate(-temporary); //rotates back
}

function renderHand() {
  if (inHand == "stick") {
    drawStick(-13, 20, 14, 14);
  } else if (inHand == "berry") {
    drawBerry(-13, 20, 14, 14);
  } else if (inHand == "rock") {
    drawRock(-13, 20, 14, 14);
  } else if (inHand == "spear") {
    //render spear
  }
}

function renderPlane() {
  if (insidePlane) {
    draw.fillStyle = "#D3D3D3"//plane walls
    rect(planex - px, planey - 150 - py, 1500, 20)
    rect(planex - px, planey + 150 - py, 1500, 20)
    ellipse(750 - px, planey - py, 620, 20);
    ellipse(-750 - px, planey - py, 1020, 20);

    draw.fillStyle = "grey";//plane structure
    rect(750 - px, planey - py, 1500, 300);
    ellipse(planex + 750 - px, planey - py, 600, 300);
    ellipse(planex - 750 - px, planey - py, 1000, 300);
    for (let i = 0; i < 62; i++) { //seat
      if (i > 52) {
        draw.fillStyle = "blue"//seats
        rect(planex - 750 - px + (60 * (i - 63)), planey - 120 - py, 40, 40)
        draw.fillStyle = "#00008B"//seat backs
        rect(planex - 770 - px + (60 * (i - 63)), planey - 120 - py, 10, 40)
      } else if (i > 41) {
        draw.fillStyle = "blue"//seats
        rect(planex - 750 - px + (60 * (i - 42)), planey - 70 - py, 40, 40)
        draw.fillStyle = "#00008B"//seat backs
        rect(planex - 770 - px + (60 * (i - 42)), planey - 70 - py, 10, 40)
      } else if (i > 20) {
        draw.fillStyle = "blue"//seats
        rect(planex - 750 - px + (60 * (i - 21)), planey + 70 - py, 40, 40)
        draw.fillStyle = "#00008B"//seat backs
        rect(planex - 770 - px + (60 * (i - 21)), planey + 70 - py, 10, 40)
      } else {
        draw.fillStyle = "blue"//seats
        rect(planex - 750 - px + (60 * i), planey + 120 - py, 40, 40)
        draw.fillStyle = "#00008B"//seat backs
        rect(planex - 770 - px + (60 * i), planey + 120 - py, 10, 40)
      }
    }
  } else {
    draw.fillStyle = "#5A5A5A" //plane walls
    rect(planex - px, planey - py, 1500, 320);
    ellipse(planex + 750 - px, planey - py, 600, 320);
    ellipse(planex - 750 - px, planey - py, 1000, 320);
    draw.fillStyle = "#ADD8E6" //plane walls
    for (let i = 0; i < 40; i++) { //windows
      if (i < 20) {
        rect(planex - px - 750 + (i * 80), planey + 150 - py, 50, 20)
      } else {
        rect(planex - px - 750 + (i * 80 - 1600), planey - 150 - py, 50, 20)
      }
    }
  }
}

function daynight() {
  if (day == false) {
    draw.fillStyle = "#00000070"
    rect(0, 0, canvas.width, canvas.height);
  }
}

function border() {
  draw.fillStyle = "blue";
  rect(0 - px, 3500 - py, 8000, 1000, 1); //does ocean
  rect(3500 - px, 0 - py, 1000, 8000, 1);
  rect(0 - px, -3500 - py, 8000, 1000, 1);
  rect(-3500 - px, 0 - py, 1000, 8000, 1);
  draw.fillStyle = "yellow";
  rect(0 - px, 2900 - py, 6000, 200, 1); //does sand
  rect(2900 - px, 0 - py, 200, 6000, 1);
  rect(0 - px, -2900 - py, 6000, 200, 1);
  rect(-2900 - px, 0 - py, 200, 6000, 1);

}

function backround() { //grass
  draw.fillStyle = "#90EE90"; //light green
  rect(0, 0, canvas.width, canvas.height) //covers entire map
}

function renderInventory() {
  draw.fillStyle = "black";
  rect(0, (canvas.height / 2) - 30, 580, 60); //bar
  draw.fillStyle = "white"
  for (let i = 0; i < 9; i++) { //slots
    if (i == holding) {
      rect(-260 + (65 * i), (canvas.height / 2) - 30, 55, 55);
    } else {
      rect(-260 + (65 * i), (canvas.height / 2) - 30, 50, 50);
    }
  }
  for (let i = 0; i < 9; i++) { //numbers of how much item
    if (inventory[i].ammount != 0) {
      write(inventory[i].ammount, -282.5 + (65 * i), (canvas.height / 2) - 10, 20, 20);
      if (inventory[i].item == "stick") {
        drawStick(-260 + (65 * i), (canvas.height / 2) - 40);
      } else if (inventory[i].item == "rock") {
        drawRock(-260 + (65 * i), (canvas.height / 2) - 40);
      } else if (inventory[i].item == "berry") {
        drawBerry(-260 + (65 * i), (canvas.height / 2) - 40);
      } else if (inventory[i].item == "spear") {
        drawSpear(-260 + (65 * i), (canvas.height / 2) - 40);
      } else if (inventory[i].item == "ctable") {
        drawCTable(-260 + (65 * i), (canvas.height / 2) - 40);
      }
    }
  }
}

function renderItems(i) { //trees
  if (itemType[i] == "tree") {
    drawTree(itemX[i] - px, itemY[i] - py); //renders a rectangle at the tree location
  } else if (itemType[i] == "stick") {
    drawStick(itemX[i] - px, itemY[i] - py)
  } else if (itemType[i] == "stone") {
    drawStone(itemX[i] - px, itemY[i] - py); //renders a circle at the stone location
  } else if (itemType[i] == "rock") {
    drawRock(itemX[i] - px, itemY[i] - py)
  } else if (itemType[i] == "berry") {
    drawBerry(itemX[i] - px, itemY[i] - py)
  } else if (itemType[i] == "bush") {
    drawBush(itemX[i] - px, itemY[i] - py, itemAmount[i]); //renders a circle at the stone location
  } else if (itemType[i] == "crafter") {
    draw.fillStyle = "tan";
    ellipse(itemX[i] - px, itemY[i] - py, 50, 50);
  } else if (itemType[i] == "wolf") {
    draw.fillStyle = "grey";
    ellipse(itemX[i] - px, itemY[i] - py, 40, 40);
  } else if (itemType[i] == "rabbit") {
    draw.fillStyle = "white";
    ellipse(itemX[i] - px, itemY[i] - py, 30 * itemAmount[i], 30 * itemAmount[i]); //renders a circle at the berry location
  } else if (itemType[i] == "spear") {
    drawSpear(itemX[i] - px, itemY[i] - py)
  }
  else if (itemType[i] == "ctable") {
    drawCTable(itemX[i] - px, itemY[i] - py)
  }
}
function itemjump(startx, starty, endx, endy, time, id) {
  //set the movement it needs to do each run
  let cx = (startx - endx) / time;
  let cy = (starty - endy) / time;
  // update the coordinates over the specified amount of time
  for (let i = 0; i < time + 1; i++) {
    setTimeout(function() {
      itemX[id] -= cx;
      itemY[id] -= cy;
      if (i < (time / 2)) {
        itemAmount[id] += 0.5 / (time / 2)
      } else {
        itemAmount[id] -= 0.5 / (time / 2)
      }
      if (i == time) {
        itemX[id] = endx;
        itemY[id] = endy;
        itemAmount[id] = 1;
      }
    }, (i));
  }
}

function itemglide2(endx, endy, time, id) {
  //set the movement it needs to do each time
  let cx = (itemX[id] - endx) / time;
  let cy = (itemY[id] - endy) / time;
  // update the coordinates over the specified amount of time
  for (let i = 0; i < time + 1; i++) {
    setTimeout(function() {
      itemX[id] -= cx;
      itemY[id] -= cy;
      if (i == time) {
        itemX[id] = endx;
        itemY[id] = endy;
      }
    }, (i));
  }
}
function itemglide(endx, endy, duration, id) {
  const cx = (endx - itemX[id]) / (duration / 10);
  const cy = (endy - itemY[id]) / (duration / 10);

  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    if (currentStep >= (duration / 10)) {
      clearInterval(interval);
    }
    itemX[id] += cx;
    itemY[id] += cy;
  }, 10);
}

function npcCencus() {
  //if (second) {
  npcNumber = [];
  for (let i = 0; i < itemX.length; i++) {
    if (itemType[i] == "wolf" || itemType[i] == "rabbit") {
      npcNumber.push(i);
    }
  }
  clearInterval(npcMoveInterval);
  npcMoveInterval = setInterval(npcmove, 400 / npcNumber.length)
  //}
}
function npcmove() {
  npcIndex += 1;
  if (npcIndex > npcNumber.length) {
    npcIndex = 0;
  }
  let i = npcNumber[npcIndex];
  if (itemType[i] == "wolf" || itemType[i] == "rabbit") {
    let xchange = 0;
    let ychange = 0;
    if (itemType[i] == "wolf") {
      if (distanceToPoint(px, py, itemX[i], itemY[i]) < 40) {//if player close
        if (itemX[i] + 80 > px && itemX[i] - 80 < px) {       //if player within 1 x movement away
          //go to player
          xchange = -itemX[i] + px;
        } else {//if player is too far to get to in one movement
          //wolf moves faster when attacking
          if (px > itemX[i]) {                    //move twards player
            xchange = 80;
          } else {
            xchange = -80;
          }

        }
        if (itemY[i] - 80 < py && py < itemY[i] + 80) {     //if player within 1 x movement away
          //go to player
          ychange = -itemY[i] + py;//if player is too far to get to in one movement
        } else {
          if (py > itemY[i]) {                    //move twards player
            ychange = 80;
          } else {
            ychange = -80;
          }
        }
      } else {
        let fartestwolf = 0;
        for (let x = 0; x < wolfGroups[itemAmount[i]].length; x++) {//repeat for every wolf in the group
          let otherWolfIndex = wolfGroups[itemAmount[i][x]];
          let distanceToWolf = distanceToPoint(itemX[i], itemY[i], itemX[otherWolfIndex], itemY[otherWolfIndex])
          if (distanceToWolf > 40 && distanceToWolf > fartestwolf) {
            fartestwolf = x;
          }
        }
        if (fartestwolf != 0) {
          let farthestWolfIndex = wolfGroups[itemAmount[i][fartestwolf]];
          if (itemX[i] + 80 > itemX[farthestWolfIndex] && itemX[i] - 80 < itemX[farthestWolfIndex]) {       //if player within 1 x movement away
            //go to player
            xchange = -itemX[i] + itemX[farthestWolfIndex];
          } else {//if player is too far to get to in one movement
            //wolf moves faster when attacking
            if (itemX[farthestWolfIndex] > itemX[i]) {      //move twards player
              xchange = 80;
            } else {
              xchange = -80;
            }

          }
          if (itemY[i] - 80 < itemY[farthestWolfIndex] && itemY[farthestWolfIndex] < itemY[i] + 80) {     //if player within 1 x movement away
            //go to player
            ychange = -itemY[i] + itemY[farthestWolfIndex];//if player is too far to get to in one movement
          } else {
            if (itemY[farthestWolfIndex] > itemY[i]) {                    //move twards player
              ychange = 80;
            } else {
              ychange = -80;
            }
          }
        } else {
          var wolfMoveDir = random(1, 14);
          if (wolfMoveDir == 1) {
            xchange = -50;
            //wolf moves leftwwwd for 1 second
          }
          if (wolfMoveDir == 2) {
            xchange = 50;
            //wolf moves right for 1 second
          }
          if (wolfMoveDir == 3 || wolfMoveDir == 4) {
            ychange = 50;
            //wolf moves up for 1 second
          }
          if (wolfMoveDir == 5 || wolfMoveDir == 6) {
            ychange = -50;
            //wolf moves down for 1 second
          }
          if (wolfMoveDir == 7) {
            ychange = 50;
            xchange = 50;
            //wolf moves up and right fwaor 1 second
          }
          if (wolfMoveDir == 8) {
            ychange = 50;
            xchange = -50;
            //wolf moves up and left for 1 second
          }
          if (wolfMoveDir == 9) {
            ychange = -50;
            xchange = 50;
            //wolf moves down and right for 1 second
          }
          if (wolfMoveDir == 10) {
            ychange = -50;
            xchange = -50;
            //wolf moves down and left for 1 second
          }
        }
        itemglide(itemX[i] + xchange, itemY[i] + ychange, 400, i);
      }
    }
    if (itemType[i] == "rabbit" && second) {
      if (random(1, 5) >= 4) {
        xchange = random(100, 130);
      } else {
        xchange = random(-130, -100);
      }
      if (random(1, 2) == 1) {
        ychange = random(100, 130);
      } else {
        ychange = random(-130, -100);
      }
      itemjump(itemX[i], itemY[i], itemX[i] + xchange, itemY[i] + ychange, 400, i);
    }
  }
}

function healthBar() {
  draw.strokeStyle = "black"
  borderRect((canvas.width / 2) - 120, (-canvas.height / 2) + 30, 200, 30); //border
  draw.fillStyle = "red";
  rect((canvas.width / 2) - 120 - (10 * Math.abs(health - 10)), (-canvas.height / 2) + 30, 20 * health, 30); //filling
}

function hungerBar() {
  draw.strokeStyle = "black"
  borderRect((canvas.width / 2) - 120, (-canvas.height / 2) + 70, 200, 30); //border
  draw.fillStyle = "brown";
  rect((canvas.width / 2) - 120 - (10 * hunger), (-canvas.height / 2) + 70, 20 * (10 - hunger), 30); //fillingssssss
}

function heatBar() {
  if (heat > 0) {
    draw.strokeStyle = "black";
    borderRect((canvas.width / 2) - 120, (-canvas.height / 2) + 110, 200, 30); //border
    draw.fillStyle = "blue";
    rect((canvas.width / 2) - 120 - (2.5 * (40 - heat)), (-canvas.height / 2) + 110, 5 * heat, 30); //filling
  }
}
//colect stuff
function interactWithItems(i) {
  if (px > itemX[i] - rL && px < itemX[i] + rL && py > itemY[i] - rL && py < itemY[i] + rL) {
    let whatItem = "none";
    if (itemType[i] == "rock") {
      whatItem = "rock";
    }
    if (itemType[i] == "bush" && itemAmount[i] > 0) {
      whatItem = "berry";
    }
    if (itemType[i] == "stick") {
      whatItem = "stick";
    }
    if (itemType[i] == "berry") {
      whatItem = "berry";
    }
    if (itemType[i] == "spear") {
      whatItem = "spear";
    }
    if (itemType[i] == "ctable") {
      whatItem = "ctable";
    }
    if (itemType[i] == "crafter") {
      whatItem = "crafter";
    }
    if (holding == "Pickaxe" && itemType[i] == "stone") {
      whatItem = "mine";
    }
    if (ekey && justCollected == 0 && whatItem != "none") {
      if (whatItem == "crafter") {
        //itemammount is set to 1 if you havent interacted before
        if (itemAmount[i] == 1) {
          setTimeout(function() {
            say = "Builder: Oi bruv, it seems we've crashed";
          }, 0);
          setTimeout(function() {
            say = "Builder: I'm a builder though mate...";
          }, 1000);
          setTimeout(function() {
            say = "Builder: Maybe this can help.";
          }, 2000)
          setTimeout(function() {
            itemX.push(px + spex);
            itemY.push(py + spey);
            itemAmount.push(1);
            itemType.push("spear")
            itemX.push(px + cx);
            itemY.push(py + cy);
            itemAmount.push(1);
            itemType.push("ctable")//(crafting table)
            say = "";
          }, 3000)
          //crafting table crafting bench. You must first learn every instruction guide before use. To do this, simply left click with it selected. Then you can use any learned guide by hitting (insert key) and selecting something to craft in the menu. Crafting is hard so this takes a while and you may want to be in a safe spot as to not get killed."
          itemAmount[i] = 2;//itemammount is set
        } else {
          //buildmenu
        }
      } else if (addToInventory(whatItem) == true) {
        justCollected = 1;
        if (itemType[i] == "bush") {
          itemAmount[i] -= 1;
        } else {

          itemX.splice(i, 1);
          itemY.splice(i, 1);
          itemType.splice(i, 1);
          itemAmount.splice(i, 1);
        }
      }
    } else {
      if (whatItem != "none") {
        showAction(whatItem);
      }
    }
  }
  if (itemType[i] == "wolf") {
    if (itemY[i] - 20 < py && py < itemY[i] + 20 && itemX[i] + 20 > px && itemX[i] - 20 < px) {
      nextsechelth = -3;
    }
  }
}

function showAction(what) {
  draw.fillStyle = "black";
  rect(0, -40, 40, 40)
  write(what, -20, 40, 60, 15);
  draw.fillStyle = "white";
  rect(0, -40, 35, 35)
  write("E", -10, -30, 100, 25);
}

function halfsecond() {
  survival();
  if (second) {
    second = false;
  } else {
    second = true;
  }
  health += nextsechelth;
  nextsechelth = 0;
}
//survival functons(likke hunger etc)
function survival() { //runs each half second
  justCollected = 0;
  if (second) { //runs each second
    time -= 1;
    gainHunger();
    heatControl();
    regen();
    if (hours == 25) {
      day = true;
      console.log("day");
      hours = 0;
      dayNum += 1;
    }
  }
}
function save() {
  localStorage.setItem("health", health); //save
  health = localStorage.getItem("health"); //load
}

function heatControl() {
  if (time == 8 && day == false || time == 0 && day == false) {
    heat -= 2;
  }
  if (heat <= 0 || heat >= 40) {
    if (time == 0 || time == 4 || time == 8 || time == 12 || time == 14) {
      health -= 1;
    }
  }
}

function regen() {
  if (health < 10 && hunger <= 3 && heat > 25 && heat < 36 && (time == 7 || time == 14)) {
    health += 1;
  }
}

function gainHunger() { //when time is 0 increces hunger(time goes down 1 each second)
  if (time == 7) {
    hours += 1;
  }
  if (time == 0) {
    hours += 1;
    console.log("hour");
    if (hours == 12) {
      day = false;
      console.log("night");
    }
    time = 15; //resets time if time is 0
    if (foodpoisoned == 1) { //if your food is poisoned
      if (hunger <= 10) { //and you aren't dying of hunger
        hunger += 2; //you get two hunger
        window.alert("u gained hunger"); //you get an alert that you got hungry
      }
    } else {
      if (hunger += 1) console.log("hunger; " + hunger);
      time = 15;
    }
    if (hunger >= 10) { //if your hunger if more than 10
      health -= 1; //you lose 1 health
      console.log("eat"); //the console says eat.
      hunger = 10 //your hunger reverts back to 10
      time = 3 //the time resets to 3
    }
  }
}
function addToInventory(item) {
  var success = false;
  for (let i = 0; i < inventory.length; i++) { //looks for preexisting stacks to add to
    if (inventory[i].item == item && inventory[i].ammount < 4) { //if theres a stack that istn full
      inventory[i].ammount += 1; // add to it
      success = true; //returns true(in the future it will tell you you dont have room)
      break;
    }
  }
  if (success == false) { //if there werent any open stacks
    for (let i = 0; i < inventory.length; i++) { //looks if a new stack can be created
      if (inventory[i].ammount == 0) { //if theres an empty slot
        inventory[i].ammount = 1;
        inventory[i].item = item;
        success = true; //returns true(in the future it will tell you you dont have room)
        break;
      }
    }
  }
  if (inventory[holding].ammount != 0) {
    inHand = inventory[holding].item;
  } else {
    inHand = "";
  }
  return success
}
// using items
function use() {
  if (inHand == "berry") {//inhand is what item is being held
    hunger -= 2;
    if (hunger < 0) {
      hunger = 0;
    }
    inventory[holding].ammount -= 1;//holding is a number from 0 to 8 saying what slot is being used
    if (inventory[holding].ammount == 0) {
      inventory[holding].ammount = 0;
      inHand = "";
    }
    if (inventory[holding].ammount < 4) {
      for (let i = 0; i < inventory.length; i++) { //slots 2212
        if (inventory[holding].ammount < 4) {
          if (inventory[i].item == "berry" && inventory[i].ammount > 0 && holding < i) {//
            if (i != holding) {//actually it needs to count down from 8 becuse you want it to take from the farthest right, ill do that
              inventory[i].ammount -= 1;
              inventory[holding].ammount += 1;
            }
          }

        }
      }
    }
  }
}
//ok
function inplane() {
  if (py < planey + 160 && py > planey - 160 && px > planex - 750 && px < planex + 750) { //within x and y range
    insidePlane = true;
  } else {
    insidePlane = false;
  }
}
// This function is used to check if the player has died and, if so, reset the game
function checkDie() {
  // Check if the player's health is less than or equal to 0
  if (health <= 0) {
    canvas = document.getElementById('canvas'); //selects the canvas
    draw = canvas.getContext('2d'); //makes draw be the thing that draws
    canvas.width = window.innerWidth; //makes it use up all available width pixels
    canvas.height = window.innerHeight; //makes it use up all available hight pixels
    draw.translate(canvas.width / 2, canvas.height / 2); //makes 0, 0 middle

    px = 0; //player x							
    py = 0; //player y
    up = false, //are you pressing w or up arrow
      right = false, //are you pressing d or right arrow
      down = false, //are you pressing s or down arrow
      left = false; //are you pressing a or left arrow
    ekey = false; //are you pressing e
    mouse; //what direction the player needs to point
    temporary; //temporary storage
    times = []; //fps thing
    fps; //fps thing
    hunger = 0; //hunger
    time = 15; //time, counts down from 15 to 0 the resets
    nearfire = 0; //are you close to a fire
    health = 10; //health
    inHand = ""; //are you holding anything
    foodpoisoned = 0; // do you have food poisoning
    rL = 60; //reach length
    RW = canvas.width; //how many pixles it is willing to render in the width direction
    RH = canvas.height; //how many pixles it is willing to render in the height direction
    moveSpeed = 4;
    holding = 0; //number of the item you are holding
    inventory = [{ item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }, { item: "", ammount: 0 }];
    mouseDown = 0;
    say = "";
    planeAngle = random(0, 360);
    nextsechelth = 0;
    second = false;
    if (random(1, 2) == 1) {
      planey = random(500, 1000);
    } else {
      planey = random(-500, -1000);
    }
    if (random(1, 2) == 1) {
      planex = random(500, 1000);
    } else {
      planex = random(-500, -1000);
    }
    insidePlane = false;
    prevX;
    prevY;
    hours = 0;
    day = true;
    dayNum = 1;
    heat = 35;
    pan = false;
    mousedown = false;
    punch = 0;
    justCollected = 0;
    itemX = [];
    itemY = [];
    itemType = [];
    itemAmount = [];
    npcNumber = []; //number of npc's
    npcIndex = -1; //next npc to move
    npcMoveInterval;
    document.getElementById("button").style.display = "none";
    document.getElementById("canvas").style.display = "block";
    genTrees(); //gens trees and stiks
    genStones(); //gens large rocks and small rocks
    genBushes(); //gens bushes and berry
    genRabbits();
    genwolf();
    genNpcs();
    /*	genchunk1();
        genchunk2(); */
    npcCencus();
    npcmove();
    paning(planex, planey, 0, 0, 1000);
  }
}
// This function is used to calculate the frames per second (fps) of the game
function getfps() {
  // Get the current time
  const now = performance.now();
  // Remove any old times from the `times` array that are more than one second old
  while (times.length > 0 && times[0] <= now - 1000) {
    times.shift();
  }
  // Add the current time to the `times` array
  times.push(now);
  // Set the fps to the length of the `times` array
  fps = times.length;
}
// This event listener is triggered whenever the user clicks the mouse
document.addEventListener('mousedown', (event) => {
  // Call the `use()` function
  use();
  mousedown = true;
  punch = random(1, 2);
  let repunch = setInterval(() => {
    if (mousedown) {
      if (punch == 1) {
        punch = 2;
      } else {
        punch = 1;
      }
    } else {
      clearInterval(repunch);
    }
  }, 300);

});
addEventListener('mouseup', (event) => {
  mousedown = false;
  punch = 0;
});

function checkMove(i) {

  if (itemType[i] == "tree") {
    if (itemY[i] - 30 < py && py < itemY[i] + 30 && itemX[i] + 30 > px && itemX[i] - 30 < px) {
      if (up) {
        py += moveSpeed;
      }

      if (right) {
        px -= moveSpeed;
      }

      if (down) {
        py -= moveSpeed;

      }

      if (left) {
        px += moveSpeed;
      }
    }
  }
  if (itemType[i] == "bush") {
    if (distanceToPoint(px, py, itemX[i], itemY[i]) < 50) {
      if (up) {
        py += (moveSpeed - 1);
      }

      if (right) {
        px -= (moveSpeed - 1);

      }

      if (down) {
        py -= (moveSpeed - 1);

      }

      if (left) {
        px += (moveSpeed - 1);
      }
    }
  }
  if (itemType[i] == "stone") {
    if (distanceToPoint(px, py, itemX[i], itemY[i]) < 50) {
      if (up) {
        py += (moveSpeed - .5);
      }

      if (right) {
        px -= (moveSpeed - .5);

      }

      if (down) {
        py -= (moveSpeed - .5);

      }

      if (left) {
        px += (moveSpeed - .5);
      }
    }
  }
}
document.addEventListener('keydown', (e) => {
  if (e.key == "w" || e.key == "W" || e.key == "ArrowUp") { //if the keys w or up are down
    up = true; //the code recognizes that you are holding up or w which moves you in a different function
  }
  if (e.key == "d" || e.key == "D" || e.key == "ArrowRight") { //if the keys d or right are down
    right = true; //the code recognizes that you are holding right or d which moves you in a different function
  }
  if (e.key == "s" || e.key == "ArrowDown") { //if the keys s or down are down
    down = true; //the code recognizes that you are holding down or s which moves you in a different function
  }
  if (e.key == "a" || e.key == "ArrowLeft") { //if the keys a or left are down
    left = true; //the code recognizes that you are holding left or a which moves you in a different function
  }
  if (e.key == "e") { //if the key e is down
    ekey = true; //the code recognizes that you are holding e which moves you in a different function
  }
  if (e.key == "q") {
    if (inventory[holding].ammount > 0) {
      itemX.push(px);
      itemY.push(py);
      itemAmount.push(1);
      itemType.push(inventory[holding].item);
      inventory[holding].ammount -= 1;
      if (inventory[holding].ammount == 0) {
        inHand = "";
      }
      if (inventory[holding].ammount < 4) {
        for (let i = 8; i < 0; i--) { //slots 
          if (inventory[holding].ammount < 4) {
            if (inventory[i].item == inHand && inventory[i].ammount > 0 && holding < i) {
              if (i != holding) {
                inventory[i].ammount -= 1;
                inventory[holding].ammount += 1;

              }
            }

          }
        }
      }
    }
  }
  if (e.key == "1") {
    holding = 0;
    if (inventory[holding].ammount != 0) {
      inHand = inventory[holding].item;
    } else {
      inHand = "";
    }
  }
  if (e.key == "2") {
    holding = 1;
    if (inventory[holding].ammount != 0) {
      inHand = inventory[holding].item;
    } else {
      inHand = "";
    }
  }
  if (e.key == "3") {
    holding = 2;
    if (inventory[holding].ammount != 0) {
      inHand = inventory[holding].item;
    } else {
      inHand = "";
    }
  }
  if (e.key == "4") {
    holding = 3;
    if (inventory[holding].ammount != 0) {
      inHand = inventory[holding].item;
    } else {
      inHand = "";
    }
  }
  if (e.key == "5") {
    holding = 4;
    if (inventory[holding].ammount != 0) {
      inHand = inventory[holding].item;
    } else {
      inHand = "";
    }
  }
  if (e.key == "6") {
    holding = 5;
    if (inventory[holding].ammount != 0) {
      inHand = inventory[holding].item;
    } else {
      inHand = "";
    }
  }
  if (e.key == "7") {
    holding = 6;
    if (inventory[holding].ammount != 0) {
      inHand = inventory[holding].item;
    } else {
      inHand = "";
    }
  }
  if (e.key == "8") {
    holding = 7;
    if (inventory[holding].ammount != 0) {
      inHand = inventory[holding].item;
    } else {
      inHand = "";
    }
  }
  if (e.key == "9") {
    holding = 8;
    if (inventory[holding].ammount != 0) {
      inHand = inventory[holding].item;
    } else {
      inHand = "";
    }
  }
});
//keyup 
document.addEventListener('keyup', (e) => {
  if (e.key == "w" || e.key == "W" || e.key == "ArrowUp") { //if the keys w and up are not being held
    up = false; //the code recognizes that you are not holding up or w which stops you in a different function
  }
  if (e.key == "d" || e.key == "ArrowRight") { //if the keys d and right are not being held
    right = false; //the code recognizes that you are not holding d or right which stops you in a different function
  }
  if (e.key == "s" || e.key == "ArrowDown") { //if the keys s or down are not being held
    down = false; //the code recognizes that you are not holding down or s which stops you in a different function
  }
  if (e.key == "a" || e.key == "ArrowLeft") { //if the keys a or left are not being held
    left = false; //the code recognizes that you are not holding a or left which stops you in a different function
  }
  if (e.key == "e") { //if the key e isn't down
    ekey = false; //the code recognizes that you are not holding e which stops you in a different function
  }
  if (e.key == "g") {
    if (day == true) {
      day = false;
      console.log("night");
    } else {
      day = true;
      console.log("day");
      hours = 0;
      dayNum += 1;
    }
  }
});
function mainForLoop() {
  for (let i = 0; i < itemX.length; i++) {
    checkMove(i);
    interactWithItems(i);
    if (insidePlane) {

    } else {
      renderItems(i);
    }
  }
}
function worldborder() {
  if (py > -3000) {
    if (up) {
      py -= moveSpeed //moves up if you are pressing w or up arrow 
    }
  }
  if (px < 3000) {
    if (right) {
      px += moveSpeed
    }
  }
  if (py < 3000) {
    if (down) {
      py += moveSpeed
    }
  }
  if (px > -3000) {
    if (left) {
      px -= moveSpeed
    }
  }
}

function tick() { //runs 60 times a second
  checkDie();
  worldborder();
  if (insidePlane) {
  } else {
    backround();
    border();
  }
  mainForLoop();
  renderCharacter();
  renderPlane();
  if (pan == false) {
    daynight();
    talk();
    inplane();
    write(fps + " " + px + ", " + -py + ", " + hours + ", " + time, (-canvas.width / 2) + 10, (-canvas.height / 2) + 10, 100, 10); //top corrner
    healthBar();
    hungerBar();
    heatBar();
    renderInventory();
  }
  getfps();
  window.requestAnimationFrame(tick); //runs tick after making the screen refresh(i think)
}
document.onmousemove = function(e) {
  mouse = -Math.atan2(e.clientX - (canvas.width / 2), e.clientY - (canvas.height / 2));
};

function startGame() {
  document.getElementById("button").style.display = "none";
  document.getElementById("canvas").style.display = "block";
  genTrees(); //gens trees and stiks
  genStones(); //gens large rocks and small rocks
  genBushes(); //gens bushes and berry
  genRabbits();
  genwolf();
  genNpcs();
  /*	genchunk1();
      genchunk2(); */
  setInterval(function() {
    if (pan == false) {
      halfsecond();
    }
  }, 500); //decreces time by 1 each second
  npcCencus();
  npcmove();
  paning(planex, planey, 0, 0, 1000);
  tick(); //runs tick
}
function paning(startx, starty, endx, endy, time) {
  pan = true;
  // set the starting coordinates
  px = startx;
  py = starty;
  //set the movement it needs to do each time
  let cx = (startx - endx) / time
  let cy = (starty - endy) / time
  // update the coordinates over the specified amount of time
  for (let i = 0; i < time + 1; i++) {
    setTimeout(function() {
      px -= cx;
      py -= cy;
      if (i == time) {
        pan = false;
        px = endx;
        py = endy;
        //startingLines();
      }
    }, (i));
  }

}


function startingLines() {
  say = "You: . . .";
  setTimeout(function() {
    say = "You: Where am I";
  }, 1500);
  setTimeout(function() {
    say = "You: I swear I was on a plane…";
  }, 4000);
  setTimeout(function() {
    say = "You: I should search for clues";
  }, 6500);
  setTimeout(function() {
    say = "";
  }, 9500);
}