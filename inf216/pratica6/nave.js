  const phaserConfig = {
      type: Phaser.AUTO,
      parent: "game",
      width: 200,
      height: 300,
      physics: {
         default: 'arcade',
         debug: false 
      },
      scene: {
          preload: preload,
          create: create,
          update: update
      }
  };

  const game = new Phaser.Game(phaserConfig);
  var cursors;
  var nave;
  var asteroide;

  function preload() {
       this.load.image("fundo", "assets/fundo.png");
       this.load.spritesheet('nave', 'assets/player.png', { frameWidth: 24, frameHeight: 24 });
       this.load.spritesheet('asteroide', 'assets/asteroid.png', { frameWidth: 64, frameHeight: 64 });
  }

  function create() {
      cursors = this.input.keyboard.createCursorKeys();

      espaco = this.add.tileSprite(0, 0, 200, 300, "fundo").setOrigin(0, 0);

      nave = this.physics.add.sprite(88, 270, 'nave').setOrigin(0, 0);
      nave.setCollideWorldBounds(true);
      this.anims.create({ key: 'centro', frames: this.anims.generateFrameNumbers('nave', { start: 1, end: 1 }), frameRate: 2, repeat: 0 });
      this.anims.create({ key: 'esq', frames: this.anims.generateFrameNumbers('nave', { start: 0, end: 0 }), frameRate: 2, repeat: 0 });
      this.anims.create({ key: 'dir', frames: this.anims.generateFrameNumbers('nave', { start: 2, end: 2 }), frameRate: 2, repeat: 0 });
      nave.anims.play('centro', true);

      asteroide = this.physics.add.sprite(80, 0, 'asteroide').setOrigin(0, 0);
      this.anims.create({ key: 'rola', frames: this.anims.generateFrameNumbers('asteroide', { start: 0, end: 19 }), frameRate: 30, repeat: -1 });
      asteroide.anims.play('rola', true);

      this.physics.add.collider(nave, asteroide);

      var collider = this.physics.add.collider(nave, asteroide, function (nave, asteroide) {
        asteroide.destroy();
        asteroide = null;  
      }, null, this);

  }

  function update() {
      espaco.tilePositionY -= 0.5;
      if (asteroide != null) {
          asteroide.y = (asteroide.y+1) % phaserConfig.height;
      }
      if (cursors.left.isDown) {
         nave.setVelocityX(-100);
         nave.anims.play('esq', true);
      }
      else if (cursors.right.isDown) {
         nave.setVelocityX(100);
         nave.anims.play('dir', true);
      }
      else if (cursors.up.isDown)    {
         nave.setVelocityX(0);
         nave.anims.play('centro', true);
      }
  }
