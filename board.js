const UP = 1;
const DOWN = -1;

class Piece {
    //direction should be 1 or -1
    constructor(dir) {
        this.direction = dir;
        this.promoted = false;
    }
    function moveIsValid(pos1, pos2){
        return false;
    }
    function canPlace(pos){
        return true;
    }
}

class P extends Piece {
    constructor(dir) {
        super(dir);
    }
    function moveIsValid(curx, cury, newx, newy){
        return curx == newx && newy = (this.direction) + cury
    }
}

class Board {
    constructor() {
        this.board = [
            [],
            [],
            [new P(DOWN), new P(DOWN), new P(DOWN), new P(DOWN), new P(DOWN), new P(DOWN), new P(DOWN), new P(DOWN), new P(DOWN)],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null, null],
            [new P(UP), new P(UP), new P(UP), new P(UP), new P(UP), new P(UP), new P(UP), new P(UP), new P(UP)],
            [],
            []
        ]
    }
    function inBounds(x,y){
        return 0 <= x && x < 9 && 0 <= y && y < 9;
    }
    //Is a square on the board empty
    function isEmpty(x,y){
        return inBounds(x,y) && this.board[x][y] == null;
    }
}

class Game {
    constructor() {
        this.board = new Board();
        this.turn = 0;
        this.player1_extra = [];
        this.player2_extra = [];
    }
}
