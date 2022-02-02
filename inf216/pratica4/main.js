const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
//ctx.width = 200;
ctx.height=600;
ctx.width = 400;
var pause = false;

const intervalo=10;//10;
let tempo =0;
let maxtempo = 10000;


var nome=navigator.userAgent; 
var direita=39;
var esquerda=37;
var frente = 0;

if (nome.indexOf('Chrome')!=-1) {
    direita=100;
    esquerda=97;
}


function Personagem(imagem, x, y, h, w) {
    this.x=x;
    this.y=y;
    this.estado=0;
    this.img = new Image();
    this.img.src = imagem; 
    this.width = w;
    this.height = h;
    
    /*
     * Calcula como desenhar o n-esimo frame de um sprite
     */
    this.desenha = function(n) { 
        //console.log("aqui")
        let posX = this.x;
        let sx = this.width*n;
        let sy =0;
        if (sx>this.img.width-this.width) {
            sy = this.height * Math.floor(sx/this.img.width);
            sx = (sx % this.img.width);
        }
        try {
            ctx.drawImage(this.img, sx, sy ,this.width,this.height,
                posX, this.y, this.width,this.height); 
        } catch (e) {
            alert(e.toString());
        }
    }
}
function Estado(ini,fini, sx, sy, vel, personagem) {
    this.frameIni=ini;
    this.frameFim=fini;
    this.num=ini;
    this.sx = sx;
    this.sy = sy;
    this.velocidade=vel;
    this.personagem = personagem;
    this.complemento;
    
    this.prox = function() {
        if (this.num === this.frameFim){
            this.num = this.frameIni;  
        } 
        else { 
            this.num = this.num+1;
            this.trans();
        }
    }
    this.muda = function() {
        let x = tempo/this.velocidade;
        if (x-Math.floor(x)>0) return false;
        else  return true;
        
    }
    this.trans = function() {
        if (this.complemento !== undefined) {
            this.complemento();
        }
    }
}



var heroi =  new function(){
    let that = this;
    this.agente = new Personagem('./inf216_player.png', 0,300, 157,200 );
    this.corrente=0;
    this.estados= new Array();
    this.estados[0] = new Estado(0,11,0,0,30, this);  
    this.estados[1] = new Estado(11,19,0,0,30, this);
    this.estados[2] = new Estado(20,24,0,0,30, this);
    this.estados[3] = new Estado(25,31,0,0,30, this);

    this.estados[1].complemento =  function() {
        that.agente.x= Math.max(0, that.agente.x-5);
    }
    this.estados[2].complemento =  function() {
        that.agente.y= Math.min(900, that.agente.y-60/2);
        that.agente.x= Math.max(0, that.agente.x+5);
    }
    this.estados[3].complemento =  function() {
        that.agente.y= Math.min(900, that.agente.y+40/2);
    }
    this.desenha = function(){
        if ( this.estados[this.corrente].muda()) this.estados[this.corrente].prox();
        this.agente.desenha(this.estados[this.corrente].num);
        this.calculaProxEstado();
    }
    this.calculaProxEstado = function() {
        switch(this.corrente) {
            case 1:
                if (this.estados[this.corrente].num === 
                    this.estados[this.corrente].frameFim) {
                    this.estados[this.corrente].num = this.estados[this.corrente].frameIni;
                    this.corrente = 0;
                } 
            break;
            case 2:
                if (this.estados[this.corrente].num === 
                    this.estados[this.corrente].frameFim) {
                    this.estados[this.corrente].num = this.estados[this.corrente].frameIni;
                    this.corrente = 3;
                } 
            break;
            case 3:
                if (this.estados[this.corrente].num === 
                    this.estados[this.corrente].frameFim) {
                    this.estados[this.corrente].num = this.estados[this.corrente].frameIni;
                    this.corrente = 0;
                } 
            break;
            case 0:
            break;
        }
    }  
}

var fundo = new function(){
    this.img = new Image();
    this.img.src = './inf216_teste.png';  
    this.iniframe = 0;
    this.w =1; //1600/lenght 
    this.h =600;
    this.length=1600;
    this.vel = 10;
}
var fundo2 = new function(){
    this.img = new Image();
    this.img.src = './inf216_teste2.png';  
    this.iniframe = 0;
    this.w =1; //1600/lenght 
    this.h =600;
    this.length=1600;
    this.vel = 2;
}


var nave =  new function(){
    this.x=88;
    this.y=220;
    this.w=24;
    this.h=24;
    this.frame=1;
    this.img = new Image();
    this.img.src = './player.png';  
}

function limpa(){
    ctx.fillStyle = '#d0e7f9';  
    ctx.rect(0, 0,  ctx.width,  ctx.height);    
    ctx.fill();  
}

function desenha(){
    desenhaFundo2();
    desenhaFundo();
    heroi.desenha();

    //ctx.drawImage(new Image('./inf216_plyer.png'),0,0);  
    //ctx.drawImage(nave.img,nave.w*nave.frame,0,nave.w, nave.h,nave.x,nave.y,nave.w, nave.h);  
}

function desenhaFundo(){
    for (let i = fundo.length; i > 0 ; i--) {
        posicaoOrigemX = fundo.w*((fundo.iniframe+i)% fundo.length);
        x = fundo.w+fundo.w*(fundo.length-i);
        ctx.drawImage(fundo.img,posicaoOrigemX,0,fundo.w, fundo.h,x,0,fundo.w, fundo.h); 
    }
    fundo.iniframe = fundo.iniframe-fundo.vel;
    if (fundo.iniframe<0) fundo.iniframe = fundo.length-fundo.vel;
}
function desenhaFundo2(){
    for (let i = fundo2.length; i > 0 ; i--) {
        posicaoOrigemX = fundo2.w*((fundo2.iniframe+i)% fundo2.length);
        x = fundo2.w+fundo2.w*(fundo2.length-i);
        ctx.drawImage(fundo2.img,posicaoOrigemX,0,fundo2.w, fundo2.h,x,0,fundo2.w, fundo2.h); 
    }
    fundo2.iniframe = fundo2.iniframe-fundo2.vel;
    if (fundo2.iniframe<0) fundo2.iniframe = fundo2.length-1;
}

var GameLoop = function(){
    if(!pause)
        desenha();
    setTimeout(GameLoop, intervalo);
    tempo = tempo+intervalo;
    if (tempo>maxtempo) tempo=0;
}

let ESQ=37;
let BAIXO=40;
let CIMA=38;
let DIR=39;

document.onkeydown = function(e){
    let keycode;
    if (window.event) keycode = window.event.keyCode;
    else if (e) keycode = e.which;
 
    if (keycode===BAIXO && heroi.corrente == 0) {
        heroi.corrente=1;
    } else if(keycode===CIMA && heroi.corrente == 0) {
        heroi.corrente=2;
    } else if(keycode===DIR) {
        //heroi.corrente=3;
    } 
    else if(keycode===ESQ) {
        pause=!pause; 
    } 
}

document.ontouchstart = function(e){
    if (heroi.corrente == 0){
        heroi.corrente=2;
    }
}
document.onclick = function(e){
    if (heroi.corrente == 0){
        heroi.corrente=2;
    }
}



GameLoop();