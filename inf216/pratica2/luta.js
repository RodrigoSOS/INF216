const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.width = 675;
ctx.height=353;

const intervalo=10;
var tempo =0;
const maxtempo = 10000;

const somMove = new Audio("chute.ogg");
const somPancada = new Audio("pancada.ogg");
const somAh = new Audio("ah.ogg");

function Personagem(imagem, x, y, h, w) {
    this.x=x;
    this.y=y;
    this.estado=0;
    this.img = new Image();
    this.img.src = imagem; 
    this.width = w;
    this.height = h;
}

function Estado(ini,fini, sx, sy, vel) {
    this.frameIni=ini;
    this.frameFim=fini;
    this.num=ini;
    this.sx = sx;
    this.sy = sy;
    this.velocidade=vel;
    this.transx=0;
    this.transy=0;
    this.tabelatrans;  
    
    this.prox = function() {
        if (this.num===this.frameFim){
            this.num= this.frameIni;
        } 
        else { 
            this.num=  this.num+1;
            this.trans();
        }
    }
    this.muda = function() {
        var x = tempo/this.velocidade;
        if (x-Math.floor(x)>0) return false;
        else  return true;;
        
    }
    this.trans = function() {
        if (this.tabelatrans==undefined) {
            this.transx=0;
            this.transy=0;
        } else {
            this.transx=this.tabelatrans[this.num].x;
            this.transy=this.tabelatrans[this.num].y;
        }
    }
}

var fundo =  new function(){
    this.img = new Image();
    this.img.src = 'fundonoite.png';  
    this.desenha = function(){
        ctx.drawImage(this.img,0,0); 
    }  
}

function novoObjeto(outX,outY){
    this.aux = new Object();
    this.aux.x=outX;
    this.aux.y=outY;
    return aux;
}

var lutador =  new function(){
    this.agente = new Personagem('ken2.png', 230,180, 72,120 );
    this.frames = 6;
    this.corrente=0;
    this.estados= new Array();
    this.vec = [0,0];
    this.estados[0] = new Estado(0,5,0,0,100);

    this.estados[1] = new Estado(17,28,0,0,70);
/* 
    this.estados[1] = new Estado(0,6,0,0,100);
    this.estados[1].tabelatrans = new Array();
    this.estados[1].tabelatrans[0]=novoObjeto(0,0);
    this.estados[1].tabelatrans[1]=novoObjeto(0,-20);
    this.estados[1].tabelatrans[2]=novoObjeto(0,-40);
    this.estados[1].tabelatrans[3]=novoObjeto(0,-40);
    this.estados[1].tabelatrans[4]=novoObjeto(0,-20);
    this.estados[1].tabelatrans[5]=novoObjeto(0,-10);
    this.estados[1].tabelatrans[6]=novoObjeto(0,0);
*/
    this.estados[2] = new Estado(6,13,0,0,80);

    this.estados[3] = new Estado(15,16,0,0,200);

    
      
    this.desenha = function(){
        var sx = this.agente.width*this.estados[this.corrente].num+this.estados[this.corrente].sx;
        if ( this.estados[this.corrente].muda()) this.estados[this.corrente].prox();
        try {
            ctx.save();
            ctx.translate(this.estados[this.corrente].transx, this.estados[this.corrente].transy)
            ctx.drawImage(this.agente.img, sx, 0 ,this.agente.width,this.agente.height,
                this.agente.x, this.agente.y, this.agente.width,this.agente.height); 
            ctx.restore();
            
        } catch (e) {
            alert(e.toString());
        }
        this.calculaProxEstado();
    }
    
    this.iniciaEstado = function(n) {
        if (this.corrente!=n){
            a=this.corrente;
            this.corrente = n;
            console.log(`${a}->${n} , ${this.vec}`);
            if (n===1) {
                this.estados[lutador.corrente].num=lutador.estados[lutador.corrente].frameIni; 
                //  somMove.play();
            }
        }
    }
    
    this.calculaProxEstado = function() {
        switch(this.corrente) {
            case 1:
                if (this.estados[this.corrente].num === 
                    this.estados[this.corrente].frameFim) {
                    this.iniciaEstado(0);
                }
                break;
            case 2:
                if (this.estados[this.corrente].num === 
                    this.estados[this.corrente].frameFim) {
                        this.estados[this.corrente].num=
                        this.estados[this.corrente].frameIni;
                        this.vec=[0,0];
                }
                if (this.vec[0]==0) {
                    this.iniciaEstado(0);
                }
                break;
            case 0:
                break;
        }
        this.move();
    }   
    this.move = function(){
        this.agente.x+=this.vec[0];
        this.agente.y+=this.vec[1];
    }
}

function desenha(){
    fundo.desenha();
    lutador.desenha();
}

var lutadora =  new function(){
    this.agente = new Personagem('chunli.png', 500,177, 72,72 );
    this.frames = 5;
    this.corrente=0;
    this.estados= new Array();
    this.estados[0] = new Estado(0,5,0,0,110);
    
    this.estados[1] = new Estado(6,8,0,0,400); 
      
    this.desenha = function(){
        var sx = this.agente.width*this.estados[this.corrente].num+this.estados[this.corrente].sx;
        if ( this.estados[this.corrente].muda()) this.estados[this.corrente].prox();
        try {
            ctx.save();
            ctx.translate(this.estados[this.corrente].transx, this.estados[this.corrente].transy)
            ctx.drawImage(this.agente.img, sx, 0 ,this.agente.width,this.agente.height,
                this.agente.x, this.agente.y, this.agente.width,this.agente.height); 
            ctx.restore();
        } catch (e) {
            alert(e.toString());
        }
        this.calculaProxEstado();
    }
    
     this.iniciaEstado = function(n) {
        this.corrente = n;
    }
    
    this.calculaProxEstado = function() {
        switch(this.corrente) {
            case 1:
                if (this.estados[this.corrente].num === 
                    this.estados[this.corrente].frameFim) {
                        this.estados[this.corrente].num=this.estados[this.corrente].frameIni;
                    this.corrente =0;
                }
                break;
            case 0:
                break;
        }
    }
}

function desenha(){
    fundo.desenha();
    lutador.desenha();
    lutadora.desenha();
}

var GameLoop = function(){
    desenha();
    setTimeout(GameLoop, intervalo);
    tempo = tempo+intervalo;
    if (tempo>maxtempo) tempo=0;
}

document.onkeydown = function(e){
    let keycode;
    lutador.vec=[0,0];
    if (window.event) keycode = window.event.keyCode;
    else if (e) keycode = e.which;
    if (keycode===40) {                 //down arrow
        lutador.iniciaEstado(3);        
    } else if(keycode===38) {           //up arrow
        lutador.iniciaEstado(1);
    } else if(keycode===39) {           //right arrow
        lutador.vec=[1,0];
        lutador.iniciaEstado(2);
    } else if(keycode===37) {           //left arrow
        lutador.vec=[-1,0];
        lutador.iniciaEstado(2);
    } else if(keycode===32) {           //espaço
        lutadora.iniciaEstado(1);
    } 


}

GameLoop();

