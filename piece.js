class Piece {
    constructor(fenName) {
        this.fenName = fenName;
        this.displayName = this.setDisplayName();
        this.player = this.setPlayer();
        this.possibleMoves = this.setPossibleMoves();
        this.coords = [null, null]
    }
    
    isFen(fenName) {
        return this.fenName.toLowerCase() === fenName.toLowerCase();
    }

    isFenCase(fenName) {
        return this.fenName === fenName;
    }
    
    setDisplayName() {
        if (this.isFen("P")) return "Pawn";
        else if (this.isFen("R")) return "Rook";
        else if (this.isFen("N")) return "Knight";
        else if (this.isFen("B")) return "Bishop";
        else if (this.isFen("Q")) return "Queen";
        else if (this.isFen("K")) return "King";
        console.log("FEN not recognised [DISPLAY]: " + this.fenName);
        return null;
    }
    
    setPlayer() {
        if (this.fenName.charAt(0) === this.fenName.charAt(0).toUpperCase()) {
            // White piece
            return "w";
        } else if (this.fenName.charAt(0) === this.fenName.charAt(0).toLowerCase()) {
            // Black piece
            return "b";
        }
        console.log("FEN not recognised [PLAYER]: " + this.fenName);
        return null;
    }
    
    setPossibleMoves() {
        if (this.isFen("K")) { // King
            return [
                [ // All
                    [-1, -1],
                    [0, -1],
                    [1, -1],
                    [-1, 0],
                    [1, 0],
                    [-1, 1],
                    [0, 1],
                    [1, 1]
                ]
            ];
        } else if (this.isFen("R")) { // Rook
            return [
                [ // <- H
                    [-1, 0],
                    [-2, 0],
                    [-3, 0],
                    [-4, 0],
                    [-5, 0],
                    [-6, 0],
                    [-7, 0]
                ],
                [ // -> H
                    [1, 0],
                    [2, 0],
                    [3, 0],
                    [4, 0],
                    [5, 0],
                    [6, 0],
                    [7, 0]
                ],
                [ // ^ V
                    [0, -1],
                    [0, -2],
                    [0, -3],
                    [0, -4],
                    [0, -5],
                    [0, -6],
                    [0, -7]
                ],
                [ // v V
                    [0, 1],
                    [0, 2],
                    [0, 3],
                    [0, 4],
                    [0, 5],
                    [0, 6],
                    [0, 7]
                ]
            ];
        } else if (this.isFen("B")) { // Bishop
            return [
                [ // \ D
                    [-1, -1],
                    [-2, -2],
                    [-3, -3],
                    [-4, -4],
                    [-5, -5],
                    [-6, -6],
                    [-7, -7]
                ],
                [ // \ D
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7]
                ],
                [ // / D
                    [1, -1],
                    [2, -2],
                    [3, -3],
                    [4, -4],
                    [5, -5],
                    [6, -6],
                    [7, -7]
                ],
                [ // / D
                    [-1, 1],
                    [-2, 2],
                    [-3, 3],
                    [-4, 4],
                    [-5, 5],
                    [-6, 6],
                    [-7, 7]
                ]
            ];
        } else if (this.isFen("N")) { // Knight
            return [
                [ // All
                    [-1, -2], // Top Left
                    [-2, -1],
                    [-1, 2], // Bottom Left
                    [-2, 1],
                    [1, -2], // Top Right
                    [2, -1],
                    [1, 2], // Bottom Right
                    [2, 1]
                ]
            ];
        } else if (this.isFen("Q")) { // Queen
            return [
                [ // <- H
                    [-1, 0],
                    [-2, 0],
                    [-3, 0],
                    [-4, 0],
                    [-5, 0],
                    [-6, 0],
                    [-7, 0]
                ],
                [ // -> H
                    [1, 0],
                    [2, 0],
                    [3, 0],
                    [4, 0],
                    [5, 0],
                    [6, 0],
                    [7, 0]
                ],
                [ // ^ V
                    [0, -1],
                    [0, -2],
                    [0, -3],
                    [0, -4],
                    [0, -5],
                    [0, -6],
                    [0, -7]
                ],
                [ // v V
                    [0, 1],
                    [0, 2],
                    [0, 3],
                    [0, 4],
                    [0, 5],
                    [0, 6],
                    [0, 7]
                ],
                [ // \ D
                    [-1, -1],
                    [-2, -2],
                    [-3, -3],
                    [-4, -4],
                    [-5, -5],
                    [-6, -6],
                    [-7, -7]
                ],
                [ // \ D
                    [1, 1],
                    [2, 2],
                    [3, 3],
                    [4, 4],
                    [5, 5],
                    [6, 6],
                    [7, 7]
                ],
                [ // / D
                    [1, -1],
                    [2, -2],
                    [3, -3],
                    [4, -4],
                    [5, -5],
                    [6, -6],
                    [7, -7]
                ],
                [ // / D
                    [-1, 1],
                    [-2, 2],
                    [-3, 3],
                    [-4, 4],
                    [-5, 5],
                    [-6, 6],
                    [-7, 7]
                ]
            ];
        } else if (this.isFen("P") && this.player == "w") { // White Pawn
            return [
                [ // Normal
                    [0, -1],
                    [0, -2]
                ],
                [ // Take
                    [-1, -1]
                ],
                [
                    [1, -1]
                ]
            ];
        } else if (this.isFen("P") && this.player == "b") { // Black Pawn
            return [
                [ // Normal
                    [0, 1],
                    [0, 2]
                ],
                [ // Take
                    [-1, 1]
                ],
                [
                    [1, 1]
                ]
            ];
        } else {
            console.log("FEN not recognised [POSSIBLE]: " + this.fenName);
            return [[]]; // Empty
        }
    }
    
    getFen() {
        return String(this.fenName);
    }
    
    getName() {
        return this.displayName;
    }
    
    getPossibleMoves() {
        return this.possibleMoves;
    }
    
    getPlayer() {
        return this.player;
    }
}