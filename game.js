 function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}
Point.prototype.toString = function () {
    var str = "(" + this.x + ", " + this.y + ")";
    return str;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
        pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}

function Player() {
    this.node = svgdoc.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
}

Player.prototype.isOnVerticalPlatform = function() {
    var node = svgdoc.getElementById("verticalPlatform");
        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
         ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
         (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            (this.position.y + PLAYER_SIZE.h >= y-1.5&&this.position.y + PLAYER_SIZE.h <= y+1.5)) return true;


    return false;
}

Player.prototype.isOnPlatform = function() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
         ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
         (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.OnDisappearingPlatform = function() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;
        if(node.getAttribute("type")!="disappearing") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
         ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
         (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return node;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return node;

    return null;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;


        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
			if(node.getAttribute("id")!="verticalPlatform") position.x = this.position.x;

            if (intersect(position, PLAYER_SIZE, pos, size)) {

                if (this.position.y+1.5>= y + h)
                    position.y = y + h+1.5;

                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}

function Monster(point) {
    this.position = point;
    this.faceRight = true;

    var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    monsters.appendChild(monster);


    monster.setAttribute("transform", "translate(" + this.position.x + "," + this.position.y + ")");
    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#theMonster");
}

function SpecialMonster(point) {
    this.position = point;
    this.faceRight = true;

    var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    monsters.appendChild(monster);


    monster.setAttribute("transform", "translate(" + this.position.x + "," + this.position.y + ")");
    monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#theSpecialMonster");
}

function Gear(point) {
    this.position = point;
    this.faceRight = true;

    var gear = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    gears.appendChild(gear);

    gear.setAttribute("transform", "translate(" + this.position.x + "," + this.position.y + ")");
    gear.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#theGear");
}

var PLAYER_INIT_POS  = new Point(0, 0);

var PLAYER_SIZE = new Size(20, 40);
var SCREEN_SIZE = new Size(600, 560);
var MONSTER_SIZE = new Size(40, 40);
var EXIT_SIZE = new Size(40, 40);
var GEAR_SIZE = new Size(40, 40);
var PORTAL_SIZE = new Size(10, 40);

var MONSTER_SCORE = 10;
var GEAR_SCORE = 20;
var LEVEL_SCORE = 100;
var monstershootcount=0;


var MOVE_DISPLACEMENT = 5;
var JUMP_SPEED = 14;
var VERTICAL_DISPLACEMENT = 1;

var MONSTER_SPEED = 1.75;

var GAME_INTERVAL = 25;
var LEVEL_TIME = 100;

var svgdoc = null;

var gameInterval = null;
var gameTimer = null;
var bCheat = false;
var platformMovingDown=true;

var scoreCount = null;
var timeCount = null;
var timeCountRect = null;
var bulletCount = null;
var levelCount = null;

var bFacingLeft = true;

var player = null;
var motionType = {NONE:0, LEFT:1, RIGHT:2};

var txtName = null;

var monsters = null;
var monsterList = [];
var specialmonsterbullets=null;
var monsterCanShoot=true;

var bullets = null;
var BULLET_SIZE = new Size(10, 10);
var BULLET_SPEED = 10.0;
var SHOOT_INTERVAL = 500.0;
var canShoot = true;

var exit = null;
var exitPos = null;

var gears = null;
var gearList = [];

var platforms = null;

var portal1 = null;
var portal2 = null;
var portal1Pos = null;
var portal2Pos = null;

function load(evt) {
    svgdoc = evt.target.ownerDocument;

    svgdoc.documentElement.addEventListener("keydown", keydown, false);
    svgdoc.documentElement.addEventListener("keyup", keyup, false);

    cleanUpGroup("platforms", true);

    player = new Player();

    scoreCount = svgdoc.getElementById("scoreCount");
    timeCount = svgdoc.getElementById("timeCount");
    timeCountRect = svgdoc.getElementById("timeCountRect");
    bulletCount = svgdoc.getElementById("bulletCount");
    levelCount = svgdoc.getElementById("levelCount");

    scoreCount.innerHTML = "0";

    bullets = svgdoc.getElementById("bullets");

    specialmonsterbullets = svgdoc.getElementById("monsterbullets")

    monsters = svgdoc.getElementById("monsters");

    exit = svgdoc.getElementById("exit");
    exitPos = new Point (exit.getAttribute("x"), exit.getAttribute("y"));

    gears = svgdoc.getElementById("gears");

    platforms = svgdoc.getElementById("platforms");

    txtName = svgdoc.getElementById("txtName");

    portal1 = svgdoc.getElementById("portal1");
    portal2 = svgdoc.getElementById("portal2");
    portal1Pos = new Point(portal1.getAttribute("x"), portal1.getAttribute("y"));
    portal2Pos = new Point(portal2.getAttribute("x"), portal2.getAttribute("y"));
}

function start(){
    promptName();


    if(levelCount.innerHTML==null){
        levelCount.innerHTML = "1";
    }
    startGame();
}

function startGame(){
    if(gameInterval!=null){
        clearInterval(gameInterval);
    }
    if(gameTimer!=null){
        clearInterval(gameTimer);
    }
    svgdoc.getElementById("startupscreen").style.setProperty("visibility", "hidden", null);
    svgdoc.getElementById("highscoretable").style.setProperty("visibility", "hidden", null);
    cleanBullets();
    cleanMonsters();
    cleanGears();
    addMonsters(6+(parseInt(levelCount.innerHTML)-1)*4);
    player.position.x = 0;
    player.position.y = 0;
    bulletCount.innerHTML = "8";
    timeCount.innerHTML = ""+LEVEL_TIME;
    addGear(8);
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);
    gameTimer = setInterval("timeUpdate()", 1000);
	function createElementNS(){
        var platforms = svgdoc.getElementById("platforms");
        var newPlatform = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");
        newPlatform.setAttribute("x", 50);
        newPlatform.setAttribute("y", 50);
        newPlatform.setAttribute("width", 50);
        newPlatform.setAttribute("height", 20);
        newPlatform.setAttribute("type", "dfd");
        newPlatform.style.setProperty("opacity", 1, null);
        platforms.appendChild(newPlatform);
	}
}


function cleanUpGroup(id, textOnly) {
    var node, next;
    var group = svgdoc.getElementById(id);
    node = group.firstChild;
    while (node != null) {
        next = node.nextSibling;
        if (!textOnly || node.nodeType == 3)
            group.removeChild(node);
        node = next;
    }
}

function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
        player.motion = motionType.LEFT;
        bFacingLeft = true;
        break;

        case "D".charCodeAt(0):
        player.motion = motionType.RIGHT;
        bFacingLeft = false;
        break;

        case "W".charCodeAt(0):
        if (player.isOnPlatform()||player.isOnVerticalPlatform()) {
            player.verticalSpeed = JUMP_SPEED;
        }

        break;

        case 32:
        if(canShoot){
            if(bCheat){
                shootBullet();
                playsnd("shoot");
            }else if(parseInt(bulletCount.innerHTML) > 0 ){
                shootBullet();
                playsnd("shoot");
                bulletCount.innerHTML = parseInt(bulletCount.innerHTML) - 1;
            }
        }
        break;

        case "C".charCodeAt(0):
        bCheat = true;
        svgdoc.getElementById("txtCheat").style.setProperty("visibility", "visible", null);
        svgdoc.getElementById("player").style.opacity = "0.5";
		break;

        case "V".charCodeAt(0):
        bCheat = false;
        svgdoc.getElementById("txtCheat").style.setProperty("visibility", "hidden", null);
		svgdoc.getElementById("player").style.opacity = "1";
		break;
    }
}

function keyup(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();
    switch (keyCode) {
        case "A".charCodeAt(0):
        if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
        break;

        case "D".charCodeAt(0):
        if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
        break;
    }
}

function animatePlatform(){
	node=svgdoc.getElementById("verticalPlatform");
	y=parseFloat(node.getAttribute("y"));
	if(y>250) platformMovingDown=false;
	if(y<200) platformMovingDown=true;

	if(platformMovingDown){
		y+=1;
		node.setAttribute("y",y);
	}else{
		y-=1;
		node.setAttribute("y",y);
	}
}


function gamePlay() {

    animatePlatform();

    collisionDetection();

    var isOnPlatform = player.isOnPlatform();

    var displacement = new Point();

    if (player.motion == motionType.LEFT)
        displacement.x = -MOVE_DISPLACEMENT;
    if (player.motion == motionType.RIGHT)
        displacement.x = MOVE_DISPLACEMENT;

    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    player.collidePlatform(position);

    player.collideScreen(position);

    player.position = position;

    platforms=svgdoc.getElementById("platforms");
    updateScreen();
    platform=player.OnDisappearingPlatform();
	if(platform!=null){
		var platformOpacity = parseFloat(platform.getAttribute("opacity"));
		if(platformOpacity<=0){
			platforms.removeChild(platform);
		}
	    platformOpacity -= 0.05;
		platform.setAttribute("opacity", platformOpacity);
    }
}



function updateScreen() {
    var tx, ty;
    if(!bFacingLeft){
        player.node.setAttribute("transform", "translate(" + (player.position.x + PLAYER_SIZE.w) + "," + player.position.y + ") scale(-1,1)");
    }else{
        player.node.setAttribute("transform", "translate(" + player.position.x + "," + player.position.y + ")");
	}
    txtName.setAttribute("transform", "translate(" + player.position.x + "," + (player.position.y - 10) + ")");
    tx = 0;
    ty = 0;
    svgdoc.getElementById("gamearea").setAttribute("transform", "translate(" + tx + ", " + ty + ")");
    moveBullets();
    moveMonsters();
    drawMonsters();
    shootMonsterBullet();
    moveMonstersBullets();
}

function timeUpdate(){
    var t = parseInt(timeCount.innerHTML) - 1;
    timeCount.innerHTML = "" + t;

    playsnd("bgm");

    if(t<=0){
        endGameDie();
    }

    var width = t / LEVEL_TIME * 140;
    timeCountRect.setAttribute("width", width);
}

function shootBullet(){
    var bullet;
    var x, y;
    var bToLeft;

    canShoot = false;
    setTimeout("canShoot = true", SHOOT_INTERVAL);

    bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");

    if(bFacingLeft){
        x = player.position.x - BULLET_SIZE.w;
        bToLeft = true;

    }else{
        x = player.position.x + PLAYER_SIZE.w;
    }

    y = player.position.y + PLAYER_SIZE.h / 2;

    bullet.setAttribute("x", x);
    bullet.setAttribute("y", y);

    bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#theBullet");

    bullets.appendChild(bullet);
}

function shootMonsterBullet(){
    monstershootcount+=25;
    for (i=0;i<monsterList.length;i++){
		if(!(monsterList[i] instanceof SpecialMonster)) continue;
		node=monsterList[i];
		var bullet;
		var x, y;
        var bToLeft;
        monsterCanShoot=false;
        if(specialmonsterbullets.childNodes.length==0){
            if(monstershootcount>=1000){
				monstershootcount=0;
				monsterCanShoot=true;
			}
		}
        if(monsterCanShoot){
        bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
        var x;
        if(!node.faceRight){
			bToLeft = true;
			x=node.position.x-BULLET_SIZE.w;

		}else{
			x=node.position.x+MONSTER_SIZE.w;
		}
		y=node.position.y+MONSTER_SIZE.h/2;
		bullet.setAttribute("x", x);
		bullet.setAttribute("y", y);
        bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#theMonsterBullet");
		specialmonsterbullets.appendChild(bullet);
        }
	}
}


function moveBullets() {
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);

        var x = parseFloat( node.getAttribute("x") );
        if(x < player.position.x){
            node.setAttribute("x", x - BULLET_SPEED);
        }else{
            node.setAttribute("x", x + BULLET_SPEED);
        }

        if(x < 0){
            node.parentNode.removeChild(node);
        }
        if(x + BULLET_SIZE.w > SCREEN_SIZE.w){
            node.parentNode.removeChild(node);
        }
    }
}

function moveMonstersBullets() {
	if(specialmonsterbullets.childNodes.length!=0){
        var node = specialmonsterbullets.childNodes.item(0);
        var x = parseFloat( node.getAttribute("x") );
        var monster;
        for(i=0;i<monsterList.length;i++){
			if(monsterList[i] instanceof SpecialMonster){
				monster=monsterList[i];
			}
		}
        if(x<monster.position.x){

            node.setAttribute("x", x - BULLET_SPEED);
        }else{
            node.setAttribute("x", x + BULLET_SPEED);
        }
        if(x<0){
            node.parentNode.removeChild(node);
        }
        if(x + BULLET_SIZE.w > SCREEN_SIZE.w){
            node.parentNode.removeChild(node);
        }
	}
}

function moveMonsters(){
    for (i=0;i<monsterList.length;i++){
        if(monsterList[i].faceRight){
            monsterList[i].position.x+=MONSTER_SPEED;

            if(monsterList[i].position.x+MONSTER_SIZE.w>SCREEN_SIZE.w){
                monsterList[i].faceRight=false;
            }
        }else{
            monsterList[i].position.x-=MONSTER_SPEED;
            if(monsterList[i].position.x<0){
                monsterList[i].faceRight=true;
            }
        }
    }
}

function drawMonsters(){
    for (i=0;i<monsters.childNodes.length;i++) {
        var monster = monsters.childNodes.item(i);
        if(monsterList[i].faceRight){
            monster.setAttribute("transform", "translate(" + monsterList[i].position.x + "," + monsterList[i].position.y + ")");
        }else{
            var x=monsterList[i].position.x + MONSTER_SIZE.w;
            monster.setAttribute("transform","translate(" +x+","+monsterList[i].position.y+") scale(-1,1)");
        }
    }
}

function drawGear(){
    for (i=0;i<gears.childNodes.length;i++){
        var gear=gears.childNodes.item(i);
        gear.setAttribute("transform", "translate("+gearList[i].position.x+","+gearList[i].position.y+")");
    }
}

function collisionDetection() {
    if ( intersect(player.position, PLAYER_SIZE, exitPos, EXIT_SIZE) ){
        if(gearList.length==0){
            playsnd("win");
            nextLevel();
			endGame();
        }
    }

    if( intersect(player.position, PLAYER_SIZE, portal1Pos, PORTAL_SIZE) ){
		player.position.y = portal2Pos.y;
        player.position.x = portal2Pos.x + 10 + PLAYER_SIZE.w;

    }else if( intersect(player.position, PLAYER_SIZE, portal2Pos, PORTAL_SIZE) ){
		player.position.y = portal1Pos.y;
        player.position.x = portal1Pos.x - 10 - PLAYER_SIZE.w;

    }

    for (i=0;i<gearList.length;i++){
        if(intersect(player.position,PLAYER_SIZE,gearList[i].position,GEAR_SIZE)){
            gears.removeChild(gears.childNodes.item(i));
            gearList.splice(i,1);
            scoreCount.innerHTML=parseInt(scoreCount.innerHTML)+GEAR_SCORE;
        }
    }

    if(!bCheat){
        for (i=0;i<monsterList.length;i++){

            if(intersect(player.position, PLAYER_SIZE,monsterList[i].position,MONSTER_SIZE) ){
                console.log(player.position.toString() +" x "+monsterList[i].position.toString());
                playsnd("die");
                endGameDie();
            }
        }
        if(specialmonsterbullets.childNodes.length!=0){
			node=specialmonsterbullets.childNodes.item(0);
            var bulletPos = new Point(node.getAttribute("x"),node.getAttribute("y"));
            if ( intersect(bulletPos, BULLET_SIZE,player.position,PLAYER_SIZE)){
				specialmonsterbullets.removeChild(node);
				playsnd("die");
				endGameDie();
			}
		}

    }
    for (i=0;i<bullets.childNodes.length;i++){
        var bullet=bullets.childNodes.item(i);
        if(bullet==null){
            break;
        }
        var bulletPos=new Point(bullet.getAttribute("x"),bullet.getAttribute("y") );
        for (i = 0; i < monsters.childNodes.length; i++) {
            var monster = monsters.childNodes.item(i);
            if( intersect(bulletPos, BULLET_SIZE, monsterList[i].position, MONSTER_SIZE) ){
                bullets.removeChild(bullet);
                if(monsterList[i] instanceof SpecialMonster){
					specialmonsterbullets.removeChild(specialmonsterbullets.childNodes.item(0));
				}
                monsters.removeChild(monster);
                playsnd("kill");
                monsterList.splice(i, 1);
                scoreCount.innerHTML = parseInt(scoreCount.innerHTML) + MONSTER_SCORE;
            }
        }
    }
}

function nextLevel(){
    clearInterval(gameInterval);
    clearInterval(gameTimer);
    var nLevel=parseInt(levelCount.innerHTML);
    var nScore=parseInt(scoreCount.innerHTML);
    var nTimeLeft=parseInt(timeCount.innerHTML);
    nScore+=nLevel*LEVEL_SCORE;
    nScore+=nTimeLeft*4;
    levelCount.innerHTML=nLevel+1;
    scoreCount.innerHTML=nScore;
    bulletCount.innerHTML="8";
    cleanBullets();
    cleanMonsters();
    cleanGears();
    startGame();
}

function endGame(){
    clearInterval(gameInterval);
    clearInterval(gameTimer);
    var theTable=getHighScoreTable();
    addToTable(txtName.innerHTML,parseInt(scoreCount.innerHTML),theTable);
    showHighScoreTable(theTable);
    setHighScoreTable(theTable);
    redText();
    timeCountRect.setAttribute("width",140);
}

function endGameDie(){
    clearInterval(gameInterval);
    clearInterval(gameTimer);
    var theTable=getHighScoreTable();
    addToTable(txtName.innerHTML,parseInt(scoreCount.innerHTML),theTable);
    showHighScoreTable(theTable);
    setHighScoreTable(theTable);
    redText();
    scoreCount.innerHTML=0;
    levelCount.innerHTML=1;
}

function redText(){
	var nodes = svgdoc.getElementById("highscoretext").childNodes;
	for(i=0;i<nodes.length;i++){
		if((nodes[i].innerHTML==txtName.innerHTML)&&(nodes[i+1].innerHTML==scoreCount.innerHTML)&&(i<9)){
			nodes[i].setAttributeNS(null,"style","fill: red");
			break;
	    }
	}
}

function addToTable(name, score, table){
    var record = new ScoreRecord(name, score);
    for(i=0;i<table.length;i++){
        if(parseInt(score)>parseInt(table[i].score)){
            table.splice(i,0,record);
            return;
        }
    }
    table.splice(10, 0, record);
}

function cleanBullets(){
    while(bullets.childNodes.length>0){
        bullets.removeChild(bullets.childNodes.item(0));
    }
    while(specialmonsterbullets.childNodes.length>0){
	        specialmonsterbullets.removeChild(specialmonsterbullets.childNodes.item(0));
    }
}

function addMonsters(iNum){
    var safeZone = new Size(PLAYER_SIZE.w*2, PLAYER_SIZE.h*2);

    for(i=0;i<iNum;i++){
        var canBorn=false;
        var x,y;
        var pos;
        do{
            x=Math.floor(Math.random()*(SCREEN_SIZE.w-MONSTER_SIZE.w));
            y=Math.floor(Math.random()*(SCREEN_SIZE.h-MONSTER_SIZE.h));
            pos=new Point(x, y);
            if(!intersect(player.position,safeZone,pos,MONSTER_SIZE)){
                canBorn=true;
            }
        }while(!canBorn);
        if(i<iNum-1){
			monsterList.push(new Monster( pos));
		}else{
			specialmonster=new SpecialMonster(pos);
			monsterList.push(specialmonster);
		}
    }
}

function cleanMonsters(){
    monsterList = [];
    while(monsters.childNodes.length>0){
        monsters.removeChild(monsters.childNodes.item(0));
    }
}

function addGear(iNum){
    for(i=0;i<iNum;i++){
        var canBorn=false;
        do{
            var j=Math.floor(Math.random()*(platforms.childNodes.length));
            var targetPlatform=platforms.childNodes.item(j);
            var x = parseInt(targetPlatform.getAttribute("x"))+Math.floor(Math.random()*(parseInt(targetPlatform.getAttribute("width"))-GEAR_SIZE.w));
            var y = parseInt(targetPlatform.getAttribute("y"))-GEAR_SIZE.h ;
            var pos = new Point(x, y);
            canBorn=!inPlatform(pos, GEAR_SIZE);
            if(intersect(player.position,PLAYER_SIZE,pos,GEAR_SIZE)){
               canBorn=false;
           }
       }while(!canBorn);
       gearList.push(new Gear(new Point(x, y)));
   }
}

function cleanGears(){
    gearList=[];
    while(gears.childNodes.length>0){
        gears.removeChild(gears.childNodes.item(0));
    }
}

function inPlatform(targetPoint, targetSize){
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(targetPoint,targetSize,pos,size)){
            return true;
        }
    }
    return false;
}

function promptName(){
    var name=prompt("What is your name?",txtName.innerHTML);
    if(name==""||name==null)
        name="Anonymous";
    txtName.innerHTML=name;
}

function playsnd(id){
    svgdoc.getElementById(id).play();
}