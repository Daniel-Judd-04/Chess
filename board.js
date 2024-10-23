class Board {
    constructor(FEN) {
        this.boardArray = new Array(8).fill().map(() => new Array(8).fill(""));
        this.boardPieceArray = new Array(8).fill().map(() => new Array(8).fill(""));
        this.pieces = [];
        this.fenPieces = "rnbqkbnrppppppppPPPPPPPPRNBQKBNR".split('');
        this.allPieces = FEN.split('/').join("");
        this.savedPassant = null;
        this.generatePieces();
        console.log("Pieces generated");
        this.fenToBoard(FEN);
        console.log("Pieces added to Board");
        this.count = 0;
    }
  
    fenToBoard(FEN) { // E.g. rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR
        let skips;
        const boardRows = FEN.split("/");
        for (let i = 0; i < boardRows.length; i++) {
            skips = 0;
            const rowPieces = boardRows[i].split("");
            for (let j = 0; j < rowPieces.length + skips; j++) {
                this.count++; if (/\d/.test(rowPieces[j - skips])) { // Leave these board slots free
                    const oldJ = j;
                    j += parseInt(rowPieces[j - skips]) - 1;
                    skips += parseInt(rowPieces[oldJ - skips]) - 1;
                } else {
                    this.boardArray[i][j] = rowPieces[j - skips];
                    let piece = this.getPieceFromPieces(rowPieces[j - skips]);
                    for (let k = 0; k < this.fenPieces.length; k++) {
                        this.count++; if (rowPieces[j - skips] == this.fenPieces[k]) {
                            this.fenPieces.splice(k, 1);
                            break;
                        }
                    }
                    piece.coords = [i, j];
                    this.count++; if (piece.isFen("P")) {
                        // Check it is pawn and that it is first move
                        this.count++; if ((piece.player == 'w') && (i != 6)) piece.possibleMoves[0] = [[0, -1]];
                        else this.count++; if ((piece.player == 'b') && (i != 1)) piece.possibleMoves[0] = [[0, 1]];
                    }
                    this.boardPieceArray[i][j] = piece;
                    gameInterface.addPieceToBoard(i, j, piece);
                }
            }
        }
    }

    boardToFen() {
        let FEN = [];
        let row = [];
        let skips = 0

        for (let i = 0; i < this.boardArray.length; i++) { // For each row
            row = [];
            skips = 0;
            for (let j = 0; j < this.boardArray[i].length; j++) {
                this.count++; if (this.boardArray[i][j] != "") {
                    this.count++; if (skips > 0) {
                        row.push(skips);
                    }
                    row.push(this.boardArray[i][j]);
                    skips = 0;
                } else {
                    skips++;
                }
            }
            this.count++; if (skips > 0) row.push(skips);
            FEN.push(row.join(""));
        }

        return FEN.join("/");
    }

    getMove(draggingCoords, droppingCoords) {
        let move = '';
        let draggedPiece = this.getPieceFromBoard(draggingCoords);
        let droppingPiece = this.getPieceFromBoard(droppingCoords);

        // Convert pieces to algebraic move

        // If no take
        this.count++; if (droppingPiece == null) {
            this.count++; if (draggedPiece.isFen("P")) {
                move = this.coordsToSquare(droppingCoords);
            } else {
                move = draggedPiece.fenName.toUpperCase() + this.coordsToSquare(droppingCoords);
            }
        } else {
            this.count++; if (draggedPiece.isFen("P")) {
                move = this.coordsToSquare(draggingCoords).substring(0, 1) + 'x' + this.coordsToSquare(droppingCoords);
            } else {
                move = draggedPiece.fenName.toUpperCase() + 'x' + this.coordsToSquare(droppingCoords);
            }
            
        }

        // If put king in check add '+' to end
        // If checkmate add '#' to end
        return move;
    }

    coordsToSquare(coords) {
        return String.fromCharCode(coords[1] + 97) + (8 - coords[0])
    }
  
    getPieceFromPieces(fenName) { // Use FEN and remove once found
        for (let i = 0; i < this.pieces.length; i++) {
            this.count++; if (this.pieces[i].fenName === fenName) {
                const piece = this.pieces[i];
                this.pieces.splice(i, 1);
                return piece;
            }
        }
        console.log("FEN not recognised [GET PIECE]: " + fenName);
        return null;
    }

    getPieceFromBoard(coords) { // Use Coords
        for (let i = 0; i < this.boardPieceArray.length; i++) {
            for (let j = 0; j < this.boardPieceArray[i].length; j++) {
                this.count++; if (this.boardPieceArray[i][j] != "") {
                    this.count++; if ((this.boardPieceArray[i][j].coords[0] == coords[0]) && (this.boardPieceArray[i][j].coords[1] == coords[1])) return this.boardPieceArray[i][j];
                }
            }
        }
        return null;
    }

    getPieceFromBoardWithFen(FEN) {
        for (let i = 0; i < this.boardArray.length; i++) {
            for (let j = 0; j < this.boardArray[i].length; j++) {
                this.count++; if (this.boardArray[i][j] != "") {
                    this.count++; if (this.getPieceFromBoard([i, j]).isFenCase(FEN)) return this.boardPieceArray[i][j];
                }
            }
        }
        return null;
    }
  
    generatePieces() {
        const individualPieces = this.allPieces.split("");
  
        for (let i = 0; i < individualPieces.length; i++) {
            this.count++; if (individualPieces[i].match(/[a-z]/i)) {
                const piece = new Piece(individualPieces[i]);
                this.pieces.push(piece);
            }
        }
    }

    checkPawn(initialCoords) {
        let initialPiece = this.getPieceFromBoard(initialCoords);
        this.count++; if (initialPiece.isFen("P")) {
            // Check it is pawn and that it is first move
            this.count++; if ((initialPiece.player == 'w') && (initialCoords[0] != 6)) initialPiece.possibleMoves[0] = [[0, -1]];
            else this.count++; if ((initialPiece.player == 'b') && (initialCoords[0] != 1)) initialPiece.possibleMoves[0] = [[0, 1]];
        }
    }

    movePiece(initialCoords, finalCoords) {
        this.count++; if (this.coordsToSquare(finalCoords) == game.enPassantTarget) { // Check if target is EP
            this.count++; if (game.currentPlayer == 'b') {
                this.boardArray[finalCoords[0] - 1][finalCoords[1]] = "";
                this.boardPieceArray[finalCoords[0] - 1][finalCoords[1]] = "";
                this.savedPassant = this.boardPieceArray[finalCoords[0] - 1][finalCoords[1]];
            } else {
                this.boardArray[finalCoords[0] + 1][finalCoords[1]] = "";
                this.boardPieceArray[finalCoords[0] + 1][finalCoords[1]] = "";
                this.savedPassant = this.boardPieceArray[finalCoords[0] + 1][finalCoords[1]];
            }
        } 
        // else this.count++; if (this.coordsToSquare(initialCoords) == game.enPassantTarget) { // For recursive calls only
        //     this.count++; if (game.currentPlayer == 'b') {
        //         this.boardArray[initialCoords[0] - 1][initialCoords[1]] = "P";
        //         this.boardPieceArray[initialCoords[0] - 1][initialCoords[1]] = this.savedPassant;
        //     } else {
        //         this.boardArray[initialCoords[0] + 1][initialCoords[1]] = "p";
        //         this.boardPieceArray[initialCoords[0] + 1][initialCoords[1]] = this.savedPassant;
        //     }
        //     this.savedPassant == null;
        // }
        this.boardArray[finalCoords[0]][finalCoords[1]] = this.boardArray[initialCoords[0]][initialCoords[1]];
        this.boardArray[initialCoords[0]][initialCoords[1]] = "";

        this.boardPieceArray[finalCoords[0]][finalCoords[1]] = this.boardPieceArray[initialCoords[0]][initialCoords[1]];
        this.boardPieceArray[initialCoords[0]][initialCoords[1]] = "";

        this.getPieceFromBoard(initialCoords).coords = finalCoords;
    }

    replacePiece(returningPiece, initialPiece, oldCoords) {
        let returningCoords = oldCoords;
        let initialCoords = initialPiece.coords;

        this.boardArray[returningCoords[0]][returningCoords[1]] = initialPiece.fenName;
        this.boardArray[initialCoords[0]][initialCoords[1]] = returningPiece.fenName;

        this.boardPieceArray[returningCoords[0]][returningCoords[1]] = initialPiece;
        this.boardPieceArray[initialCoords[0]][initialCoords[1]] = returningPiece;

        initialPiece.coords = returningCoords;
        returningPiece.coords = initialCoords;
    }

    checkForCheckmate() {
        for (let i = 0; i < this.boardArray.length; i++) { // For each row
            for (let j = 0; j < this.boardArray[i].length; j++) { // For each col
                let piece = this.getPieceFromBoardWithFen(this.boardArray[i][j]);
                this.count++; if ((piece != null) && (piece.player == game.currentPlayer)) {
                    for (let k = 0; k < 64; k++) { // For every possible target piece
                        this.count++; if (piece.coords.join("") != [Math.floor(k / 8), k % 8].join("")) { // Make sure not same coords
                            this.count++; if (this.validSquare(piece.coords, [Math.floor(k / 8), k % 8], true, true)) { // Check if valid move
                                // If valid, there is at least one possible move
                                console.log('No Checkmate', piece);
                                return false;
                            }
                        }
                    }
                }
            }
        }
        return true;
    }

    validSquare(draggingCoords, targetCoords, checkForCheck = false, lookAhead = true) {
        let draggingPiece = this.getPieceFromBoard(draggingCoords);
        let targetPiece = this.getPieceFromBoard(targetCoords);
        let currentKing;
        let valid = false;
        let blocked = false;
        
        // ONLY CHECK POSSIBLE MOVES
        for (let i = 0; i < draggingPiece.possibleMoves.length; i++) { // For each possible direction
            for (let j = 0; j < draggingPiece.possibleMoves[i].length; j++) { // For each possible move
                this.count++; if ((draggingPiece.possibleMoves[i][j][0] + draggingCoords[1] == targetCoords[1]) && (draggingPiece.possibleMoves[i][j][1] + draggingCoords[0] == targetCoords[0])) valid = true;
            }
        }

        this.count++; if (targetPiece != null) {
            this.count++; if (draggingPiece.player == targetPiece.player) valid = false;
        }
        
        // FOR PAWNS
        this.count++; if (draggingPiece.isFen("P")) { // Check if it is Pawn
            // Check for taking pieces possibilities
            this.count++; if ((draggingPiece.possibleMoves[1][0][0] + draggingCoords[1] == targetCoords[1]) && (draggingPiece.possibleMoves[1][0][1] + draggingCoords[0] == targetCoords[0]) && (targetPiece == null)) {
                this.count++; if ((game.enPassantTarget != '-') && (game.enPassantTarget== this.coordsToSquare(targetCoords))) {
                    valid = true;
                } else {
                    valid = false;
                }
            } else this.count++; if ((draggingPiece.possibleMoves[2][0][0] + draggingCoords[1] == targetCoords[1]) && (draggingPiece.possibleMoves[2][0][1] + draggingCoords[0] == targetCoords[0]) && (targetPiece == null)) {
                this.count++; if ((game.enPassantTarget != '-') && (game.enPassantTarget == this.coordsToSquare(targetCoords))) {
                    valid = true;
                } else {
                    valid = false;
                }
            }
            
            // Check for forward possibilities
            this.count++; if ((draggingPiece.possibleMoves[0][0][0] + draggingCoords[1] == targetCoords[1]) && (draggingPiece.possibleMoves[0][0][1] + draggingCoords[0] == targetCoords[0]) && (targetPiece != null)) {
                valid = false;
            } 
            this.count++; if ((draggingPiece.possibleMoves[0].length > 1) && (draggingPiece.possibleMoves[0][1][0] + draggingCoords[1] == targetCoords[1]) && (draggingPiece.possibleMoves[0][1][1] + draggingCoords[0] == targetCoords[0])) {
                this.count++; if ((targetPiece != null) || (this.getPieceFromBoard([targetCoords[0] - draggingPiece.possibleMoves[0][0][1], targetCoords[1]]) != null)) {
                    valid = false;
                }
            }
        }

        // IS BLOCKED BY ANYTHING
        this.count++; if (!(draggingPiece.isFen("K")) && !(draggingPiece.isFen("N"))) { // Check that not King or Knight (These are fine)
            // This will be for Queen, Rook and Bishop
            this.count++; if (valid == true) { // Check if target is possible
                // valid = false;
                for (let i = 0; i < draggingPiece.possibleMoves.length; i++) { // For each direction
                    this.count++; if (draggingPiece.possibleMoves[i].some(innerArr => innerArr.every((val, k) => val === targetCoords[k] - draggingCoords[k]))) { // Check if target is in this direction
                        for (let j = 0; j < draggingPiece.possibleMoves[i].length; j++) { // For each move in this direction
                            let checkingCoords = [draggingPiece.possibleMoves[i][j][0] + draggingCoords[0], draggingPiece.possibleMoves[i][j][1] + draggingCoords[1]];
                            this.count++; if ((targetCoords[0] == checkingCoords[0]) && (targetCoords[1] == checkingCoords[1])) {
                                this.count++; if (blocked) {
                                    valid = false;
                                } else {
                                    valid = true;
                                }
                            } else this.count++; if (this.getPieceFromBoard(checkingCoords) != null) { // There is piece
                                blocked = true;
                            }
                        }
                    }
                }
            }
        }

        this.count++; if (targetPiece != null) {
            this.count++; if (draggingPiece.player == targetPiece.player) valid = false; // Same player

            this.count++; if (draggingPiece == targetPiece) valid = true; // Same square
        }

        // PUTS KING IN CHECK
        this.count++; if ((valid == true) && (draggingPiece != targetPiece) && (checkForCheck)) { // Check if target is even valid or possible
            this.count++; if (lookAhead) {
                this.count++; if (game.currentPlayer == 'w') currentKing = this.getPieceFromBoardWithFen("K");
                else currentKing = this.getPieceFromBoardWithFen("k");
            } else {
                this.count++; if (game.currentPlayer == 'w') currentKing = this.getPieceFromBoardWithFen("k");
                else currentKing = this.getPieceFromBoardWithFen("K");
            }
            let oldCoords = draggingCoords;
            this.movePiece(draggingCoords, targetCoords); // TEMP move
            // This does NOT work. The piece needs to be remembered, or it will be removed.
            for (let i = 0; i < 8; i++) { // Check all moves that could be made by other player
                for (let j = 0; j < 8; j++) {
                    let possiblePiece = this.getPieceFromBoard([i, j]);
                    this.count++; if (possiblePiece != null) {
                        this.count++; if ((lookAhead) && (possiblePiece.player != game.currentPlayer)) { // Check that it is piece from oposition if look ahead
                            this.count++; if (this.validSquare(possiblePiece.coords, currentKing.coords, false)) {
                                console.log("PUTS KING IN CHECK", possiblePiece, currentKing);
                                valid = false;
                            }
                        } else this.count++; if ((!lookAhead) && (possiblePiece.player == game.currentPlayer)) { // Check that it is NOT piece from oposition if NOT look ahead
                            this.count++; if (this.validSquare(possiblePiece.coords, currentKing.coords, false)) {
                                console.log("PUTS KING IN CHECK", possiblePiece, currentKing);
                                valid = false;
                            }
                        }
                    }
                }
            }
            // So make new function
            this.count++; if (targetPiece == null) this.movePiece(targetCoords, draggingCoords);
            else this.replacePiece(targetPiece, draggingPiece, oldCoords);
        }

        return valid;
    }
}
  