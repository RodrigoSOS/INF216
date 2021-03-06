class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('bg', 'assets/stars.jpeg');
        this.load.image('ship', 'assets/nave.png');
        this.load.image('mira', 'assets/mira.png');
        this.load.image('arma', 'assets/arma.png');
        this.load.spritesheet('plasma', 'assets/plasmaball.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('explosao', 'assets/explosion.png', { frameWidth: 35, frameHeight: 49 });
    }

    create ()
    {
        //  Set the camera and physics bounds to be the size of 4x4 bg images
        this.cameras.main.setBounds(0, 0, 1500 * 2, 1000 * 2);
        this.physics.world.setBounds(0, 0, 1500 * 2, 1000 * 2);

        //  Mash 4 images together to create our background
        this.add.image(0, 0, 'bg').setOrigin(0);
        this.add.image(1500, 0, 'bg').setOrigin(0).setFlipX(true);
        this.add.image(0, 1000, 'bg').setOrigin(0).setFlipY(true);
        this.add.image(1500, 1000, 'bg').setOrigin(0).setFlipX(true).setFlipY(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.nave = this.physics.add.image(200, 100, 'ship');
        this.player = this.physics.add.image(400, 300, 'mira');
        this.arma = this.physics.add.image(400, 700, 'arma');

        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0x00ff00 }, fillStyle: { color: 0xff0000 }});

        this.circle = new Phaser.Geom.Circle(this.player.x, this.player.y, 50);
        this.point = new Phaser.Geom.Rectangle(0, 0, 16, 16);

        this.player.setCollideWorldBounds(true);
        this.nave.setCollideWorldBounds(true);
        this.arma.setCollideWorldBounds(true);
        
        this.particles = this.add.particles('plasma');

        this.particles.createEmitter({
            frame: 0,
            lifespan: 1000,
            speedX: { min: -20, max: 20 },
            speedY: { start: -400, end: -600, steps: 12 },
            scale: { start: 0.3, end:  0.3 },
            blendMode: 'ADD',
            on: false
        });

        this.explosao = this.add.particles('explosao');

        this.explosao.createEmitter({
            speed: 20,
            accelerationY: -300,
            angle: { min: -85, max: -95 },
            rotate: { min: -180, max: 180 },
            scale: { start: 10, end:  20 },
            lifespan: { min: 1000, max: 1300 },
            //blendMode: 'ADD',
            frequency: 110,
            maxParticles: 50,
            x: 400,
            y: 300,
            on: false
        });

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    }

    update ()
    {
        this.player.setVelocity(0);

        let velocidade = Math.floor(Math.random() * 1000) -500;
        let v = Math.random() * 100; 
        if (this.nave!=null){
            if (v <5 ) {
                this.nave.setVelocityY(velocidade);
            } else if (v > 95) {
                this.nave.setVelocityX(velocidade);
            }
            this.point.x = this.nave.x;
            this.point.y = this.nave.y;
        }
        if (this.cursors.space.isDown)
        {
            this.particles.emitParticleAt(this.player.x, this.player.y+350);
            if (this.nave!=null){
                //console.log(this.circle,this.nave)
                if (Phaser.Geom.Circle.ContainsPoint(this.circle, this.point)){
                    this.explosao.emitParticleAt(this.point.x, this.point.y);
                    console.log("hit",this.circle,this.point)
                    this.nave.destroy();
                    this.nave = null;
                }
            }
        }
    
        this.arma.x= this.player.x;
        this.arma.y= this.player.y+400;
        
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-500);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(500);
        }

        if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-500);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(500);
        }
        this.circle.x=this.player.x;
        this.circle.y=this.player.y;

        //this.graphics.clear();
        //this.graphics.strokeCircleShape(this.circle);
        //this.graphics.fillRect(this.point.x - 8, this.point.y - 8, this.point.width, this.point.height);
    }
    
    
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
    },
    scene: [ Example ]
};

const game = new Phaser.Game(config);


