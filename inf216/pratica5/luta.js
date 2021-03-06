var config = {
    type: Phaser.AUTO,
    width: 675,
    height: 353,
    physics: {
        default: 'arcade',
        arcade: {gravity: { y: 300 }, debug: false }
    },
    scene: { preload: preload, create: create, update: update }
};

var game = new Phaser.Game(config);

var cursors;
var plataformas;
var lutA;
var lutB;
var chao = 277;
var cont = 0;
var actionsA = ['idleA', 'kickA', 'punchA', 'lowpunchA', 'blockA', 'mortalA' ];
var golpesA = ['kickA', 'punchA', 'lowpunchA', 'blockA', 'mortalA' ];
var statesA = ['aliveA','fall1A','fall2A', 'dyingA','deadA']
var stateFragil=['idle','left','right']
var valorVidaA = 100;
var valorVidaB = 100;
var vidaA, vidaB ;
var chute;
var ah;

function preload () {
    this.load.spritesheet('lutadorA', 'assets/karatea.png', { frameWidth: 75, frameHeight: 75 });
    this.load.spritesheet('lutadorB', 'assets/karateb.png', { frameWidth: 75, frameHeight: 75 });
    this.load.image('fundo', 'assets/fundonoite.png');
    this.load.image('plata', 'assets/plataforma.png');
    this.load.audio('chute', ['assets/chute.ogg']);
    this.load.audio('ah', ['assets/ah.ogg']);
}

class HealthBar {
    constructor (scene, x, y)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);
        this.x = x;
        this.y = y;
        this.value = 100;
        this.p = 76 / 100;
        this.draw();
        scene.add.existing(this.bar);
    }

    decrease (amount)
    {
        this.value -= amount;
        if (this.value < 0){this.value = 0;}
        this.draw();
        return (this.value === 0);
    }

    draw ()
    {
        this.bar.clear();
        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 80, 16);
        //  Health
        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);
        if (this.value < 30){
            this.bar.fillStyle(0xff0000);
        }
        else{
            this.bar.fillStyle(0x00ff00);
        }
        var d = Math.floor(this.p * this.value);
        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }
}





function create () {
    
    cursors = this.input.keyboard.createCursorKeys();
    
    // Recursos de som
    chute = this.sound.add('chute', {volume: 0.1,loop: false});
    ah    = this.sound.add('ah', {volume: 0.5,loop: false});

    this.sound.once('unlocked', () => {});

    this.add.image(0, 0, 'fundo').setOrigin(0, 0);
    
    plataformas = this.physics.add.staticGroup();
    plataformas.create(18, chao, 'plata').setOrigin(0, 0).setScale(1).refreshBody();
    
    //vidaA = this.add.rectangle(560, 320, valorVidaA, 10, 0x6666ff).setOrigin(0, 0);
    //vidaB = this.add.rectangle(20, 320, valorVidaB, 10, 0xff33cc).setOrigin(0, 0);

    vidaA = new HealthBar(this,560,320);
    vidaB = new HealthBar(this, 20,320);

 
    //*******************
    // Cria a lutador A *
    //*******************
    lutA = this.physics.add.sprite(530, 180, 'lutadorA').setOrigin(0, 0);
    lutA.setBounce(0.2);
    lutA.setCollideWorldBounds(true);
    lutA.body.setGravityY(300)
        
    this.anims.create({ key: 'idleA',
        frames: this.anims.generateFrameNumbers('lutadorA', { start: 8, end: 9 }),
        frameRate: 2, repeat: -1 });
    
    this.anims.create({ key: 'kickA',
        frames: this.anims.generateFrameNumbers('lutadorA', { start: 0, end: 6 }),
        frameRate: 5});

    this.anims.create({ key: 'punchA',
        frames: this.anims.generateFrameNumbers('lutadorA', { start: 17, end: 19 }),
        frameRate: 5});
    
    this.anims.create({ key: 'lowpunchA',
        frames: this.anims.generateFrameNumbers('lutadorA', { start: 11, end: 13 }),
        frameRate: 5});
    
    this.anims.create({ key: 'blockA',
        frames: this.anims.generateFrameNumbers('lutadorA', { start: 9, end: 10 }),
        frameRate: 5});
    
    this.anims.create({ key: 'mortalA',
        frames: this.anims.generateFrameNumbers('lutadorA', { start: 40, end: 49 }),
        frameRate: 5});
    
    this.anims.create({ key: 'dyingA',
        frames: this.anims.generateFrameNumbers('lutadorA', { start: 20, end: 23 }),
        frameRate: 10});
 
    this.anims.create({ key: 'fall1A',
        frames: this.anims.generateFrameNumbers('lutadorA', { start: 20, end: 29 }),
        frameRate: 5});
    
    this.anims.create({ key: 'deadA',
        frames: this.anims.generateFrameNumbers('lutadorA', { start: 23, end: 23 }),
        frameRate: 10});

    lutA.anims.play('idleA', true);

    //*******************
    // Cria a lutador B *
    //*******************
    lutB = this.physics.add.sprite(230, 180, 'lutadorB').setOrigin(0, 0);
    lutB.setBounce(0.2);
    lutB.setCollideWorldBounds(true);
    lutB.body.setGravityY(300)

    this.anims.create({ key: 'left',
        frames: this.anims.generateFrameNumbers('lutadorB', { start: 0, end: 3 }),
        frameRate: 10, repeat: -1 });

     this.anims.create({  key: 'right',
        frames: this.anims.generateFrameNumbers('lutadorB', { start: 0, end: 3 }),
        frameRate: 10,  repeat: -1   });
    
     this.anims.create({ key: 'idle',
        frames: this.anims.generateFrameNumbers('lutadorB', { start: 0, end: 1 }),
        frameRate: 2, repeat: -1 });
    
     this.anims.create({ key: 'kick',
        frames: this.anims.generateFrameNumbers('lutadorB', { start: 4, end: 10 }),
        frameRate: 20});

    /*adicionado*/    
    this.anims.create({ key: 'lowpunch',
        frames: this.anims.generateFrameNumbers('lutadorB', { start: 11, end: 13 }),
        frameRate: 5});

    /*adicionado*/  
    this.anims.create({ key: 'dead',
        frames: this.anims.generateFrameNumbers('lutadorB', { start: 23, end: 23 }),
        frameRate: 10});
    
    /*adicionado*/  
    this.anims.create({ key: 'mortal',
        frames: this.anims.generateFrameNumbers('lutadorB', { start: 40, end: 49 }),
        frameRate: 5});

     this.anims.create({ key: 'fall',
        frames: this.anims.generateFrameNumbers('lutadorB', { start: 30, end: 39 }),
        frameRate: 5});

    
    lutB.anims.play('idle', true);
    
    this.physics.add.collider(lutA, plataformas);
    this.physics.add.collider(lutB, plataformas);

    var collider = this.physics.add.collider(lutA, lutB, function (lutA, lutB) {
        /*alterado*/
        if ((lutB.anims.currentAnim.key == 'kick' && lutA.anims.currentAnim.key== 'idleA') ||
            (lutB.anims.currentAnim.key == 'lowpunch' && lutA.anims.currentAnim.key== 'idleA') ||
            (lutB.anims.currentAnim.key == 'mortal' && lutA.anims.currentAnim.key== 'idleA')
        ) {     
            lutA.anims.play('fall1A', true);
            ah.play(); 
            valorVidaA -= 20;
            vidaA.decrease(20);
            console.log(`a:${valorVidaA} b:${valorVidaB}`);
            if (valorVidaA<=0){
                lutA.anims.play('deadA', true);
                ah.play(); 
            } 
        };
        
        // Lutador A acerta um golpe no lutador B 
        if (stateFragil.indexOf(lutB.anims.currentAnim.key)>-1   && golpesA.indexOf(lutA.anims.currentAnim.key) >-1) {     
            lutB.anims.play('fall', true);
            ah.play(); 
            valorVidaB -= 20;
            vidaB.decrease(20);
            console.log(`a:${valorVidaA} b:${valorVidaB}`);
            if (valorVidaB<=0){
                lutB.anims.play('dead', true);
                ah.play(); 
            } 
        };
        
        lutB.x-=5;
        }, null, this);
}

function update (){
    if (lutA.anims.getProgress()==1 && lutA.anims.currentAnim.key != 'deadA') {
        let n = Math.floor(Math.random() * 100);
        if (n<90) {
            lutA.anims.play('idleA', true);
        } else {
            n = Math.floor(Math.random() * 100) % 6
            lutA.anims.play(actionsA[n],true);
        }
    }
      
    if (lutB.anims.currentAnim.key != 'idle') {
        if (lutB.anims.getProgress()==1) {
            lutB.anims.play('idle', true);
        }
        else return;
    }

    lutB.setVelocity(0);
    if (cursors.left.isDown) {
        lutB.setVelocityX(-100);
        lutB.anims.play('left', true);
    }
    else if (cursors.right.isDown) {
        lutB.setVelocityX(100);
        lutB.anims.play('right', true);
    }
    else if (cursors.up.isDown)    {
        lutB.x+=2;
        chute.play();
        lutB.anims.play('kick', true);
    }
    else if (cursors.down.isDown)    {
        lutB.x+=2;
        chute.play();
        lutB.anims.play('lowpunch', true);
    }
    else if (cursors.space.isDown)    {
        lutB.x+=2;
        chute.play();
        lutB.anims.play('mortal', true);
    }
}
