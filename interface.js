let saveName;
let activeBoard = true;

class Interface {
    createBoard = () => {
        let element = document.getElementById("board");
        element.innerHTML = null;
        document.getElementById('black-pieces').innerHTML = null;
        document.getElementById('white-pieces').innerHTML = null;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                let square = document.createElement('div')
                square.id = "square-" + ((i * 8) + j);
                square.onmousedown = function() { gameInterface.dragPiece(this) };
                square.onmouseup = function() { gameInterface.dropPiece(this) };
                if ((i + j) % 2 == 0) square.className = "square light-square"; // Light square
                else square.className = "square dark-square"; // Dark square
                
                let image = document.createElement('img');
                image.className = "square-image";
                image.setAttribute('draggable', false);
                square.appendChild(image);

                if (i == 7) { // Add a letter to bottom right
                    let indicator = document.createElement('div');
                    indicator.className = 'indicator indicator-col';
                    indicator.innerHTML = String.fromCharCode(j + 97);
                    square.appendChild(indicator);
                }
                if (j == 0) { // Add a number to the top left
                    let indicator = document.createElement('div');
                    indicator.className = 'indicator indicator-row';
                    indicator.innerHTML = (8 - i);
                    square.appendChild(indicator);
                }
    
                element.appendChild(square);
            }
        }
        this.hideValidSquares();
    }

    resetGame = () => {
        FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
        moves = [];
        let loadName = saveName;
        makeGame(FEN, moves);
        saveName = loadName;
    }

    addMoveLayout() {
        let element = document.getElementById('move-container');
        element.innerHTML = null;
        this.addMove('Game Moves', '        Show All')
        element.firstElementChild.onclick = function() { gameInterface.showAllMoves() };
        element.firstElementChild.className = 'move title-move';
        // TEMP
        this.showAllMoves(true);
        this.showAllMoves();
    }
    
    addPieceToBoard = (i, j, piece) => {
        document.getElementById('square-' + ((i * 8) + j)).firstElementChild.src = "imgs/" + piece.fenName.toLowerCase() + piece.player + ".png";
    }

    dragPiece = (element) => {
        console.log("dragging", element, this.getCoords(element));
        if (activeBoard) { // Board is on current or previous move
            if (element.firstElementChild.src.substring(element.firstElementChild.src.length - 5, element.firstElementChild.src.length - 4) == game.currentPlayer) { // Correct Player
                draggingElement = element;
                draggingElementCoords = this.getCoords(element);
                draggingImg = element.firstElementChild;
    
                draggingImg.style.filter = 'drop-shadow(0px 0px 5px #444)';
                draggingImg.style.zIndex = '9999';
                draggingImg.style.width = '9.5vh';
    
                draggingImgUrl = element.firstElementChild.src;
                this.showValidSquares(element);
            }
        }
    }

    showValidSquares = (element) => {
        for (let i = 0; i < 64; i++) {
            if (game.board.validSquare(this.getCoords(element), this.getCoords(document.getElementById('square-' + i)), true)) { // Check that it is valid square
                document.getElementById('square-' + i).style.outline = '3px solid #FFAA00';
                document.getElementById('square-' + i).style.outlineOffset = '-15px';
            }
        }
    }

    updateGameInfo = () => {
        document.getElementById('info-castles').firstElementChild.innerHTML = game.availableCastles;
        document.getElementById('info-passant').firstElementChild.innerHTML = game.enPassantTarget;
        document.getElementById('info-half-move').firstElementChild.innerHTML = game.board.count;
        document.getElementById('info-full-move').firstElementChild.innerHTML = game.fullMoves;
    }

    hideValidSquares = () => {
        for (let i = 0; i < 64; i++) {
            document.getElementById('square-' + i).style.outline = '';
            document.getElementById('square-' + i).style.outlineOffset = '';
        }
    }

    getCoords = (element) => {
        if (draggingElement != null) return [Math.floor(element.id.substring(7) / 8), element.id.substring(7) % 8];
        else return null;
    }

    getElementNumber = (coords) => {
        return (coords[0] * 8) + coords[1];
    }

    addPieceToSide = (element, pass = false) => {
        let captured = document.createElement('img');
        captured.className = 'captured-piece';

        if (pass) { // Entered Automatically
            captured.src = element.firstElementChild.src;
            if (game.currentPlayer == 'w') document.getElementById('white-pieces').appendChild(captured);
            else document.getElementById('black-pieces').appendChild(captured);
        } else { // Entered on load
            if (element == element.toUpperCase()) {
                captured.src = "imgs/" + element.toLowerCase() + "w.png";
                document.getElementById('black-pieces').appendChild(captured);
            } else {
                captured.src = "imgs/" + element.toLowerCase() + "b.png";
                document.getElementById('white-pieces').appendChild(captured);
            }
        }
    }

    dropPiece = (element) => {
        let startTime = new Date().getMilliseconds();
        let endTime;
        console.log("dropping", draggingElement, element, this.getCoords(draggingElement), this.getCoords(element));
        if ((draggingElement != null) && (draggingElement != element) && (element.style.outline != '') && (activeBoard)) { // Check that it is dropped on different square && that it is a valid move
            // Update the move log
            this.updateMoveLog(draggingElementCoords, this.getCoords(element));

            // 

            // Piece has just been captured
            if (game.board.getPieceFromBoard(this.getCoords(element)) != null) {
                this.addPieceToSide(element, true);
            }

            // If En Passant
            if (game.board.coordsToSquare(this.getCoords(element)) == game.enPassantTarget) {
                // Remove images and add pawn to side
                if (game.currentPlayer == 'w') {
                    document.getElementById('square-' + (element.id.substring(7) - -8)).firstElementChild.src = '';
                    document.getElementById('square-' + (element.id.substring(7) - -8)).firstElementChild.style.display = 'none';
                    this.addPieceToSide('p');
                } else {
                    document.getElementById('square-' + (element.id.substring(7) - 8)).firstElementChild.src = '';
                    document.getElementById('square-' + (element.id.substring(7) - 8)).firstElementChild.style.display = 'none';
                    this.addPieceToSide('P');
                }
            }

            // Set En Passant target
            let y;
            game.enPassantTarget = '-';
            if ((game.board.getPieceFromBoard(this.getCoords(draggingElement)).isFen('P')) && (Math.abs(this.getCoords(draggingElement)[0] - this.getCoords(element)[0])  == 2)) {
                let elementCoords = game.board.coordsToSquare(this.getCoords(element));
                if (game.board.getPieceFromBoard(this.getCoords(draggingElement)).player == 'w') {
                    y = parseInt(elementCoords.split('')[1]) - 1
                } else {
                    y = parseInt(elementCoords.split('')[1]) + 1
                }
                // Set target
                game.enPassantTarget = elementCoords.split('')[0] + y;
            }

            // Remove any highlighting
            for (let i = 0; i < 64; i++) {
                document.getElementById('square-' + i).style.background = '';
            }

            // Highlight last move
            if (element.className == 'square light-square') {
                element.style.background = '#e5f183';
            } else {
                element.style.background = '#baca44';
            }
            if (draggingElement.className == 'square light-square') {
                draggingElement.style.background = '#e5f183';
            } else {
                draggingElement.style.background = '#baca44';
            }

            // Move piece in game class
            game.board.movePiece(draggingElementCoords, this.getCoords(element));
            // Remove pawn extra moves if pawn in game class
            game.board.checkPawn(this.getCoords(element));

            // Swap the img between the elements
            draggingElement.firstElementChild.src = '';
            draggingElement.firstElementChild.style.display = 'none';
            element.firstElementChild.src = draggingImgUrl;
            element.firstElementChild.style.display = 'block';

            // Update Player
            game.changePlayer();
            // Visually update player
            this.changePlayer();

            // Check for checkmate
            if (game.board.checkForCheckmate()) {
                console.log('CHECK MATE');
                if (game.currentPlayer == 'w') {
                    document.getElementById('square-' + this.getElementNumber(game.board.getPieceFromBoardWithFen('K').coords)).firstElementChild.style.background = '#994433';
                } else {
                    document.getElementById('square-' + this.getElementNumber(game.board.getPieceFromBoardWithFen('k').coords)).firstElementChild.style.background = '#994433';
                }
            }

            // Update Game Info
            this.updateGameInfo();

            // Reset the comparison count;
            game.board.count = 0;

            // Save game
            if (saveName != null) saveGame(saveName);
        }
        if (draggingElement != null) {
            // Reset image
            draggingImg.style.transform = '';
            draggingImg.style.filter = '';
            draggingImg.style.zIndex = '0';
            draggingImg.style.width = '';
        }

        // Hide the valid squares
        this.hideValidSquares();

        // Stop dragging piece
        draggingElement = null;

        endTime = new Date().getMilliseconds();
        console.log('Compute Time: ' + (endTime - startTime) + 'ms');
    }

    updateMoveLog = (draggingElementCoords, droppingElementCoords) => {
        let move = game.board.getMove(draggingElementCoords, droppingElementCoords);
        
        document.getElementById('square-' + this.getElementNumber(game.board.getPieceFromBoardWithFen('K').coords)).firstElementChild.style.background = '';
        document.getElementById('square-' + this.getElementNumber(game.board.getPieceFromBoardWithFen('k').coords)).firstElementChild.style.background = '';
        if (!game.board.validSquare(draggingElementCoords, droppingElementCoords, true, false)) {
            move = move + '+';
            if (game.currentPlayer == 'w') {
                document.getElementById('square-' + this.getElementNumber(game.board.getPieceFromBoardWithFen('k').coords)).firstElementChild.style.background = '#FF6961';
            } else {
                document.getElementById('square-' + this.getElementNumber(game.board.getPieceFromBoardWithFen('K').coords)).firstElementChild.style.background = '#FF6961';
            }
        }

        game.moves.push(move);
        this.updateMoveSliderPosition()
        if (game.moves.length % 2 == 0) {
            let move2 = game.moves[game.moves.length - 1];
            let gap = ' '.repeat(8 - game.moves[game.moves.length - 2].length);
            let number = (game.moves.length) / 2;
            let move1 = game.moves[game.moves.length - 2];
            
            if (number > 9){
                document.getElementById('move-container').firstElementChild.nextElementSibling.remove();
                this.addMove(number + '.', ' ' + move1 + gap + move2);
            } else {
                this.addMove(number + '.', '  ' + move1 + gap + move2);
            }
            
            // document.getElementById('move-container').lastElementChild.innerHTML = document.getElementById('move-container').lastElementChild.innerHTML + move2;
        }
    }

    addMove(bold = '', content = '') {
        let container = document.getElementById("move-container");
        let element = document.createElement('div');
        element.className = 'move';

        element.innerHTML = '<span>' + bold + '</span>' + content;

        container.appendChild(element);

        setTimeout(() => {
            element.style.transform = 'none';
            element.style.opacity = '1';
        }, 1);
    }

    showAllMoves(pass = false) {
        let number, visibleMoves, spareMove;
        let element = document.getElementById('move-container').firstElementChild;

        if (game.moves.length % 2 != 0) {
            spareMove = game.moves.pop();
        }

        number = game.moves.length / 2;

        if (number > 9) visibleMoves = 9;
        else visibleMoves = number;
            

        if (element.innerHTML == '<span>Game Moves</span>        Show All') {
            if (!pass) {
                for (let i = 0; i < Math.floor(visibleMoves); i++) {
                    element.nextElementSibling.remove();
                }
            }

            for (let i = 0; i < game.moves.length; i++) {
                if (i % 2 == 0) {
                    let gap = ' '.repeat(8 - game.moves[i].length);
                    let move1 = game.moves[i];
                    let move2 = game.moves[i + 1];
                    
                    if ((i/2) + 1 > 9){
                        this.addMove(((i/2) + 1) + '.', ' ' + move1 + gap + move2);
                    } else {
                        this.addMove(((i/2) + 1) + '.', '  ' + move1 + gap + move2);
                    }
                }
            }

            document.getElementById("move-container").scrollTop = 0;
            element.innerHTML = '<span>Game Moves</span>        Minimise';
        } else { //hide
            if (!pass) {
                for (let i = 0; i < Math.floor(number); i++) {
                    element.nextElementSibling.remove();
                }
            }

            for (let i = (visibleMoves * 2); i > 0; i--) {
                if (i % 2 == 0) {
                    let gap = ' '.repeat(8 - game.moves[game.moves.length - i].length);
                    let move1 = game.moves[game.moves.length - i];
                    let move2 = game.moves[game.moves.length - i + 1];
                    
                    if (((game.moves.length - i) / 2) + 1 > 9){
                        this.addMove((((game.moves.length - i) / 2) + 1) + '.', ' ' + move1 + gap + move2);
                    } else {
                        this.addMove((((game.moves.length - i) / 2) + 1) + '.', '  ' + move1 + gap + move2);
                    }
                }
            }

            element.innerHTML = '<span>Game Moves</span>        Show All';
        }
        if (spareMove != undefined) {
            game.moves.push(spareMove);
        }
    }

    changePlayer = () => {
        if (game.currentPlayer == 'w') {
            document.getElementById('current-player').style.left = "42px";
            document.getElementById('current-player').style.background = "white";
        } else {
            document.getElementById('current-player').style.left = "248px";
            document.getElementById('current-player').style.background = "black";
        }
    }

    updateMoveSliderPosition = () => {
        let number = moves.length + 1;
        document.getElementById('slider').max = number;
        document.getElementById('slider').value = number;
        document.getElementById('slider-label').innerHTML = number;
        document.querySelector(':root').style.setProperty('--moves', number);
        document.getElementById('slider-label').style.transform = '';
    }

    updateSliderValue = () => {
        let slider = document.getElementById('slider');

        let thumbWidth = 27 / (moves.length + 1);

        document.getElementById('slider-label').innerHTML = slider.value;
        document.getElementById('slider-label').style.transform = 'translateX(-' + (thumbWidth * (moves.length - slider.value + 1)) + 'vh)';

        if (slider.value < moves.length + 1) { // Prohibit Moves
            activeBoard = false;
        } else { // Resume
            activeBoard = true;
        }


    }

    goBackAMove = () => {
        document.getElementById('slider').value--;
        this.updateSliderValue();
    }

    resumeMoves = () => {
        document.getElementById('slider').value = moves.length + 1;
        this.updateSliderValue();
    }

    showInput = (type) => {
        document.getElementById('game-info-container').style.opacity = '0';
        document.getElementById('game-loader-container').style.width = '46vh';
        document.getElementById('game-name').placeholder = type + ' Name';
        setTimeout(() => {
            document.getElementById('game-name').style.display = 'block';
        }, 600);
        setTimeout(() => {
            document.getElementById('game-name').style.opacity = '1';
        }, 601);

        document.getElementById('save-game').innerHTML = '<span class="material-symbols-outlined">disabled_by_default</span>';
        document.getElementById('save-game').onclick = '';
        setTimeout(() => {
            document.getElementById('save-game').onclick = function() { gameInterface.hideInput() };
        }, 600);
        if (type == 'Save') {
            document.getElementById('load-game').innerHTML = '<span class="material-symbols-outlined">upload</span>';
            document.getElementById('load-game').onclick = function() { gameInterface.saveGame() };
        } else {
            document.getElementById('load-game').innerHTML = '<span class="material-symbols-outlined">download</span>';
            document.getElementById('load-game').onclick = function() { gameInterface.loadGame() };
        }
    }

    hideInput = () => {
        document.getElementById('game-name').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('game-name').value = '';
            document.getElementById('game-name').style.display = 'none';
        }, 200);

        setTimeout(() => {
            document.getElementById('game-info-container').style.opacity = '1';
        }, 600);
        document.getElementById('game-loader-container').style.width = '16vh';

        document.getElementById('save-game').innerHTML = '<span class="material-symbols-outlined">upload</span>';
        document.getElementById('load-game').innerHTML = '<span class="material-symbols-outlined">download</span>';
        
        
        document.getElementById('save-game').onclick = '';
        setTimeout(() => {
            document.getElementById('save-game').onclick = function() { gameInterface.showInput('Save') };
        }, 600);
        document.getElementById('load-game').onclick = function() { gameInterface.showInput('Load') };
    }

    saveGame = () => {
        saveName = '*[' + document.getElementById('game-name').value + ']$';
        if ((localStorage.getItem(saveName) == null) && (saveName != '*[]$')) {
            saveGame(saveName);
            document.getElementById('title').innerHTML = document.getElementById('game-name').value;
            localStorage.setItem("#currentGame#", saveName);
            console.log('SAVED: ' + saveName);
            this.hideInput();
        }
    }

    loadGame = () => {
        let loadName = '*[' + document.getElementById('game-name').value + ']$';
        if (localStorage.getItem(loadName) != null) {
            let info = getGame(loadName).split('||');
            FEN = info[0];
            moves = info[1].split('/');
            makeGame(FEN, moves);
            document.getElementById('title').innerHTML = document.getElementById('game-name').value;
            saveName = loadName;
            localStorage.setItem("#currentGame#", saveName);
            console.log('LOADED: ' + loadName);
            this.hideInput();
        }
    }
}

let draggingElementCoords = [];
let draggingElement = null;
let draggingImg = null;
let draggingImgUrl = "";

document.addEventListener('mousemove', function(ev){
    if (draggingElement != null) {
        draggingImg.style.transform = 'translateY(' + (ev.clientY-100) + 'px)';
        draggingImg.style.transform += 'translateX(' + (ev.clientX-100) + 'px)';
        draggingImg.style.transform += 'translateX(-50vh)';
        draggingImg.style.transform += 'translateX(' + (draggingElementCoords[1] * - 11) + 'vh)';
        draggingImg.style.transform += 'translateY(' + (draggingElementCoords[0] * - 11) + 'vh)';
    }
},false);