class Game {
    constructor(FEN, moves) {
        const fenInfo = FEN.split(" ");
        this.moves = moves;
        this.board = new Board(fenInfo[0]); // Create board with piece positions
        this.currentPlayer = fenInfo[1]; // 'w' or 'b'
        this.availableCastles = fenInfo[2]; // KQkq
        this.enPassantTarget = fenInfo[3]; // Target square for en passant
        this.halfMoveClock = parseInt(fenInfo[4]); // Used to implement the fifty-move rule
        this.fullMoves = parseInt(fenInfo[5]); // Incremented after black's move
    }

    changePlayer(pass = false) {
        if (this.currentPlayer == "w") { // Change to black
            this.currentPlayer = "b";
        } else {
            this.currentPlayer = "w";
            if (!pass) this.fullMoves++;
        }
        // if (!pass) this.halfMoveClock++;
    }

    gameToFen() { //E.g. rnbqkbnr/pp1ppppp/2p5/8/8/1P6/1PPPPPPP/RNBQKBNR w KQkq - 0 1
        let fenElements = [];

        fenElements[0] = this.board.boardToFen();
        fenElements[1] = this.currentPlayer;
        fenElements[2] = this.availableCastles;
        fenElements[3] = this.enPassantsTarget;
        fenElements[4] = this.halfMoveClock;
        fenElements[5] = this.fullMoves;

        return fenElements.join(" ");
    }
}