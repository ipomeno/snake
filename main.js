const TAMANHO_CAIXA = 32;

class Ponto {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Quadrado {
  constructor(x, y, largura, altura, cor) {
    this.x = x;
    this.y = y;
    this.largura = largura;
    this.altura = altura;
    this.cor = cor;
  }

  desenhar(app) {
    app.desenharQuadrado(this);
  }

  clonar() {
    return new Quadrado(
      this.x, this.y, 
      this.largura, this.altura, 
      this.cor);
  }
}

class Comida extends Quadrado {
  constructor() {
    super(0, 0, 0, 0, 'red');
    this.altura = TAMANHO_CAIXA;
    this.largura = TAMANHO_CAIXA;
    this.posicionar();
  }

  posicionar() {
    this.x = this.posicaoAleatoria();
    this.y = this.posicaoAleatoria();
  }

  posicaoAleatoria() {
    return Math.floor(Math.random() * 15 + 1) * TAMANHO_CAIXA;
  }
}

class Cobra {
  constructor(app) {
    let posicao = 8 * TAMANHO_CAIXA/2;
    this.direcao = 'right';
    this.corpo = [ new Quadrado(posicao, posicao, TAMANHO_CAIXA, TAMANHO_CAIXA, 'green') ];
    this.app = app;
  }

  orientarCabeca() {
    let cabeca = this.corpo[ 0 ];
    if ((cabeca.x > (15 * TAMANHO_CAIXA)) && (this.direcao == 'right')) {
      cabeca.x = 0;
    }

    if ((cabeca.x < 0) && (this.direcao == 'left')) {
      cabeca.x = 16 * TAMANHO_CAIXA;
    }

    if ((cabeca.y > (15 * TAMANHO_CAIXA)) && (this.direcao == 'down')) {
      cabeca.y = 0;
    }

    if ((cabeca.y < 0) && (this.direcao == 'up')) {
      cabeca.y = 16 * TAMANHO_CAIXA;
    }

    if (this.colisao()) {
      this.app.stop();
    }
  }

  mudarDirecao(code) {
    if ((code == 37) && (this.direcao != 'right')) { this.direcao = 'left'; }
    if ((code == 38) && (this.direcao != 'down')) { this.direcao = 'up'; }
    if ((code == 39) && (this.direcao != 'left')) { this.direcao = 'right'; }
    if ((code == 40) && (this.direcao != 'up')) { this.direcao = 'down'; }
  }

  andar() {
    let cabeca = this.corpo[ 0 ].clonar();
    if (this.direcao == 'right') { cabeca.x += TAMANHO_CAIXA; }
    if (this.direcao == 'left') { cabeca.x -= TAMANHO_CAIXA; }
    if (this.direcao == 'up') { cabeca.y -= TAMANHO_CAIXA; }
    if (this.direcao == 'down') { cabeca.y += TAMANHO_CAIXA; }
    this.corpo.unshift(cabeca);
  }

  comer(comida) {
    let cabeca = this.corpo[ 0 ];

    if ((cabeca.x != comida.x) || (cabeca.y != comida.y)) {
      this.corpo.pop();
    }
    else {
      comida.posicionar();
    }
  }

  colisao() {
    let cabeca = this.corpo[ 0 ];
    let result = false;
    for(let index = 1; index < this.corpo.length; index++) {
      let cauda = this.corpo[ index ];
      if ((cabeca.x == cauda.x) && (cabeca.y == cauda.y)) {
        result = true;
        break;
      }
    }

    return result;
  }

  desenhar(comida) {
    this.orientarCabeca();
    for(let index = 0; index < this.corpo.length; index++) {
      let quadrado = this.corpo[ index ];
      quadrado.desenhar(this.app);
    }

    this.andar();
    this.comer(comida);
  }
}

class Tela {
  constructor(app) {
    this.area = new Quadrado(
      0, 0, 
      16 * TAMANHO_CAIXA, 
      16 * TAMANHO_CAIXA, 
      'lightGreen');
    this.app = app;
  }

  desenhar() {
    this.app.desenharQuadrado(this.area);
  }
}

class App {

  constructor() {
    this.canvas = document.getElementById('snake');
    this.context = this.canvas.getContext('2d');
    this.tela = new Tela(this);
    this.cobra = new Cobra(this);
    this.comida = new Comida();
  }

  start () {
    document.addEventListener('keyup', (event) => {
      this.cobra.mudarDirecao(event.keyCode);
    });

    this.appId = setInterval(() => {
      this.tela.desenhar();
      this.cobra.desenhar(this.comida);
      this.comida.desenhar(this);
    }, 100);
  }

  stop() {
    clearInterval(this.appId);
    alert('Game Over :(');
  }

  desenharQuadrado(quadrado) {
    this.context.fillStyle = quadrado.cor;
    this.context.fillRect(quadrado.x, quadrado.y, quadrado.largura, quadrado.altura);
  }

}

new App().start();