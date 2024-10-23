let game, gameInterface;

    // Start layout
let FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    // Queens
// FEN = "qqqqkqqq/qqqqqqqq/8/8/8/8/QQQQQQQQ/QQQQKQQQ w KQkq - 0 1";
    // Rooks
// FEN = "rrrrkrrr/rrrrrrrr/8/8/8/8/RRRRRRRR/RRRRKRRR w KQkq - 0 1";
    // Random layout
// FEN = "r3k2r/pp1n1pbp/2p1pnp1/8/2BP4/2N2N2/PPP2PPP/R1B2RK1 w kq - 2 11";
    // Checkmate layout
// FEN = "7R/5k2/7R/8/8/3Q4/8/K7 b KQkq - 0 1";
    // High Comparisons
// FEN = "rnbq1bnr/pppppppp/8/8/8/8/PPPPPPPP/RNBKQN1k w KQkq - 0 1";

// Set moves to empty list
let moves = [];

saveGame = (gameName) => {
    let savedContent = game.gameToFen() + '||' + game.moves.join('/'); // Add moves

    localStorage.setItem(gameName, savedContent);
}

getGame = (gameName) => {
    let info = localStorage.getItem(gameName);
    return info;
}

makeGame = (FEN, moves) => {
    gameInterface = new Interface();
    gameInterface.createBoard();

    game = new Game(FEN, moves);
    gameInterface.addMoveLayout();
    gameInterface.changePlayer(true);
    gameInterface.updateGameInfo();
    gameInterface.updateMoveSliderPosition();
    for (let i = 0; i < game.board.fenPieces.length; i++) {
        gameInterface.addPieceToSide(game.board.fenPieces[i]);
    }
}

// loads saved game (Comment this to start new game)
if (getGame(getGame("#currentGame#")) != null) { // currentGame will either return the last saved game name or ""
    let info = getGame(getGame("#currentGame#")).split('||');
    FEN = info[0];
    moves = info[1].split('/');
    makeGame(FEN, moves);
} else {
    makeGame(FEN, moves);
}