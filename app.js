const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(43, 45)  // scale for the pieces



function arenaSweep() {
    let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 20;
        rowCount *= 2;
    }
}

function collide(arena, player) { 
    const [m, o] = [player.matrix, player.pos];  // here we are iteratorating our player here
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x){
            if (m[y][x] !== 0 &&  // we check 
                (arena[y + o.y] && // if arena has a row
                    arena[y + o.y][x + o.x]) !== 0){  // if arena has a column and if not we return true
                        return true;
                    }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}


function createPiece(type) {
    if (type === 'T'){
            return [   // this is what makes the "T" piece in the game
            [0, 0 ,0], // extra row to determain the center of the piece if we dont have this row and only 2 it would only flip up and down
            [1, 1, 1],
            [0, 1, 0],
        ];
        } else if (type === 'O') {
            return [   // this is what makes the "T" piece in the game
            [2, 2], // extra row to determain the center of the piece if we dont have this row and only 2 it would only flip up and down
            [2, 2],
        ];
    }   else if (type === 'L') {
            return [
            [0, 3 ,0], // extra row to determain the center of the piece if we dont have this row and only 2 it would only flip up and down
            [0, 3, 0],
            [0, 3, 3],
        ];
    }
    else if (type === 'J') {
        return [
        [0, 4 ,0], // extra row to determain the center of the piece if we dont have this row and only 2 it would only flip up and down
        [0, 4, 0],
        [4, 4, 0],
    ];
}
    else if (type === 'I') {
        return [
        [0, 5 ,0, 0], // extra row to determain the center of the piece if we dont have this row and only 2 it would only flip up and down
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0]
    ];
}
        else if (type === 'S') {
            return [
            [0, 6 ,6], // extra row to determain the center of the piece if we dont have this row and only 2 it would only flip up and down
            [6, 6, 0],
            [0, 0, 0],
        ];
     }
     else if (type === 'Z') {
        return [
        [7, 7 ,0], // extra row to determain the center of the piece if we dont have this row and only 2 it would only flip up and down
        [0, 7, 7],
        [0, 0, 0],
    ];
 }
 }


function draw(){
    context.fillStyle = '#C4C4C4'; // color of the canvas
    context.fillRect(0,0, canvas.width, canvas.height); // this calls the html element 

    drawMatrix(arena, {x:0, y: 0});
    drawMatrix(player.matrix, player.pos); // position of the cube 
}

function drawMatrix(matrix, offset){
    matrix.forEach((row, y) => {
        row.forEach((value, x) =>   {
            if (value !==0) {
                context.fillStyle = colors[value];
                context.fillRect(
                    x + offset.x,
                    y + offset.y, 1, 1
                    );
            }
            }); 
        });
}


function merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
}


function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        playerReset();
        arenaSweep();
        updateScore();
    }
    dropCounter = 0;
}

function playerMove(dir) {  // this function makes sure that the pieces dont exit the arena.
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0)-
                    (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {    // if the pieces stack up this will reset the arena
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

function playerRotate(dir) {  /// function that rotate's the pieces
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix, dir);
    while (collide(arena, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if (offset > player.matrix[0].length) {
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}


function rotate(matrix, dir) {   // let's you to rotate each piece 
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {    // function that drops a piece every 1 sec
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop()
    }

    draw();
    requestAnimationFrame(update);

}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

const colors = [  // Colors for each picece

    null,
    '#764AF5',
    '#4A7AF5',
    '#4ACCF5',
    '#E8F54A',
    '#4AF56F',
    '#F54AEF',
    '#F54A4A',
];

const arena = createMatrix(12, 20);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
}

document.addEventListener('keydown', event => {     //Triggerd everytime when a key is pressed
    if (event.keyCode === 37) {                                 // 37 is the number of the left Arrow
        playerMove(-1);                                        
    } else if (event.keyCode === 39) {                       //39 is the number of the right Arrow
        playerMove(1);                                     
    } else if (event.keyCode === 40) {                      // 40 is the number of the down Arrow
        playerDrop();
    }else if (event.keyCode === 81) {                      // 81 is the number for W to rotate picecs
        playerRotate(-1);
    }else if (event.keyCode === 87) {                      // 87 is the number for Q
        playerRotate(1);
    }
    console.log(event.keyCode);
});



playerReset();
updateScore();
update();