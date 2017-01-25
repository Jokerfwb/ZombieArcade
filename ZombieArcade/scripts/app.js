var game = new Phaser.Game(800, 800, Phaser.Auto, '', { preload: preload, create: create, update: update, render: render });




function preload() {
    game.load.image('background', 'assets/debug-grid-1920x1920.png');
    game.load.spritesheet('player', 'assets/dude.png', 32, 48);
    game.load.image('background2', 'assets/test.png');
    game.load.image('zombie', 'assets/space-baddie.png');
    game.load.image('bullet', 'assets/chunk.png');

}

var survivors;
var player;
var playerSpeed = 0;
var cursors;
var upKey;
var downKey;
var leftKey;
var rightkey;

var bullets;
var fireRate = 50;
var nextFire = 0;

function create() {
    
    
    game.world.setBounds(-1000, -1000, 2000, 2000);
    game.add.tileSprite(-1000, -1000, 2000, 2000, 'background2');
   

    game.physics.startSystem(Phaser.Physics.P2JS);
    //game.physics.startSystem(Phaser.Physics.ARCADE);


   
    zombies = game.add.group();

   
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    //game.physics.arcade.enable(player);
    game.physics.p2.enable(player);
    player.anchor.set(0.5);
    player.enableBody = true;
    player.collideWorldBounds = true;
    
   
    
    

   
    for (var i = 0; i < 200; i++) {
        var zombie;
         zombie = zombies.create(10 + Math.random() * 1900, 10 + Math.random() * 1900, 'zombie');
         game.physics.p2.enable(zombie);
         zombie.enableBody = true;
        zombie.speed = (Math.random() * (115 - 60) + 60);
        console.log(zombie.speed);
        zombie.anchor.set(0.5);
    }

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(40, 'bullet', 0, false);
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    
}

function update() {
    player.body.setZeroVelocity(0);

    zombies.forEachAlive(moveZombies, this);
    // Using this with ARCADE physics will allow the movement of the spite to follow the mouse

    //if (game.physics.arcade.distanceToPointer(player, game.input.activePointer) > 8) {
    //    game.physics.arcade.moveToPointer(player, 150);
    //} else {
    //    player.body.velocity.set(0);
    //}

    //if (cursors.up.isDown || upKey.isDown) {
    //    playerSpeed = 150;
    //} else {
    //    if (playerSpeed > 0) {
    //        playerSpeed -= 4;
    //    }
    //}

    //if (playerSpeed > 0) {
    //    game.physics.arcade.velocityFromRotation(player.rotation, playerSpeed, player.body.velocity);
    //}
    

    //if (cursors.left.isDown || leftKey.isDown) {
    //    player.angle -= 4;
    //}
    //else if (cursors.right.isDown || rightKey.isDown) {
    //    player.angle += 4;
    //}
   
    //Using for movement with P2JS physics
    if (cursors.up.isDown || upKey.isDown) {
        player.body.moveUp(150);
    }
    else if (cursors.down.isDown || downKey.isDown) {
        player.body.moveDown(150);
    }

    if (cursors.left.isDown || leftKey.isDown) {
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown || rightKey.isDown) {
        player.body.moveRight(150);
    }

    if (game.input.activePointer.isDown) {
        fire();
    }
}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);
    game.debug.inputInfo(350, 32);
}

function moveZombies(zombie) {
    moveToPlayer(zombie, player, (Math.random() * (75-30) + 30));
}

function moveToPlayer(zombie, player) {
    
    
    //if (zombie.body.x < player.body.x) {
    //    zombie.body.velocity.x = speed;
    //} else {
    //    zombie.body.velocity.x = speed * -1;
    //}
    //if (zombie.body.y < player.body.y) {
    //    zombie.body.velocity.y = speed;
    //} else {
    //    zombie.body.velocity.y = speed * -1;
    //}

    if (typeof speed === 'undefined') {
        speed = 60;
    }

    var angle = Math.atan2(player.y - zombie.y, player.x - zombie.x);

    zombie.body.rotation = angle + game.math.degToRad(90);
    zombie.body.velocity.x = (Math.cos(angle) * zombie.speed);
    zombie.body.velocity.y = (Math.sin(angle) * zombie.speed);
    //zombie.body.force.x = (Math.cos(angle) * zombie.speed);
   
    //zombie.body.force.y = (Math.sin(angle) * zombie.speed);
    
    
}

function fire () {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstExists(false);

        bullet.reset(player.x, player.y);

        bullet.rotation = game.physics.arcade.moveToPointer(bullet, 1000, game.input.activePointer, 500);
    }

}