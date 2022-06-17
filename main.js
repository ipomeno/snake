let canvas = document.getElementById('snake');
let context = canvas.getContext('2d');
let box = 32;
let snake = [];
let direction = 'right';

snake[0] = {
  x: 8 * box,
  y: 8 * box
};

function criarBG() {
  context.fillStyle = 'lightGreen';
  context.fillRect(0, 0, 16 * box, 16 * box);
}

function criarCobrinha() {
  for(index = 0; index < snake.length; index++) {
    context.fillStyle = 'green';
    context.fillRect(snake[ index ].x, snake[ index ].y, box, box);
  }
}

function iniciarJogo() {
  criarBG();
  criarCobrinha();

  let snakex = snake[0].x;
  let snakey = snake[0].y;

  if (direction == 'right') snakex += box;
  if (direction == 'left') snakex -= box;
  if (direction == 'up') snakey -= box;
  if (direction == 'down') snakey += box;

  snake.pop();

  let head = {
    x: snakex,
    y: snakey
  };

  snake.unshift(head);  
}

let jogo = setInterval(() => { iniciarJogo(); }, 100);