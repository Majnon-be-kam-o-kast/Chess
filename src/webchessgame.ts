
import { ChessGame } from "./chessgame.js";
import { ChessMove } from "./chessmove.js";
import { MoveTracker } from "./movetracker.js";
import { Piece } from "./piece.js";

export class WebChessGame {

    public boardContainer: HTMLElement;
    public turncount: number = 0;
    public active: boolean = false;

    public grid: HTMLElement[][] = [];
    public moveTracker = new MoveTracker();
    public game: ChessGame;

    constructor(boardContainer: HTMLElement) {

        this.boardContainer = boardContainer;
        this.game = new ChessGame(this);
        this.paintTiles()
        this.game.initializeBoardstate()
        this.fullboardPiecePaint()
    }

    public checkClickEvent(): void {

        const move: ChessMove | null = this.findClickedCell();

        if (!move) {
            return;
        }

        if (!this.active) {
            this.game.processStartMove(move);
        } else if (this.active) {
            this.game.processEndCell(move)
            if (this.active) {
                this.clearHighlights();
                this.active = false;
                this.game.processStartMove(move);
            }
        }
    }

    setValidMove(i: number, j: number): void {

        const tile = this.grid[i][j];
        if (!tile.classList.contains("validmove")) {
            this.grid[i][j].classList.add("validmove")
        }
    }

    findClickedCell(): ChessMove | null {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const tile = this.grid[i][j]
                if (tile instanceof HTMLElement) {
                    if (tile.classList.contains("clicked")) {
                        tile.classList.remove("clicked")
                        return new ChessMove(i, j);
                    }
                }
            }
        }

        return null;
    }

    

    submitMove() {

        const startMove: number[] | undefined = this.moveTracker.getStartMove();
        const endMove: number[] | undefined = this.moveTracker.getEndMove();

        if (!startMove || !endMove) {
            return;
        }

        let a = startMove[0];
        let b = startMove[1];
        let x = endMove[0];
        let y = endMove[1];

        this.game.boardstate[x][y] = this.game.boardstate[a][b]
        this.game.boardstate[a][b] = "."
        this.paintPosition(x, y)
        this.paintPosition(a, b)
        this.clearHighlights()
        this.turncount += 1
    }

    clearHighlights() {

        document.querySelectorAll(".highlighted").forEach(el => el.classList.remove("highlighted"))
        document.querySelectorAll(".validmove").forEach(el => el.classList.remove("validmove"))
        document.querySelectorAll(".markerdot").forEach(el => el.remove())
        document.querySelectorAll(".markercircle").forEach(el => el.remove())
    }

    fullboardPiecePaint() {

        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this.paintPosition(i, j)
            }
        }
    }

    addDot(i: number, j: number) {

        const dot = document.createElement("div")
        dot.classList.add("markerdot")
        this.setValidMove(i, j)
        this.grid[i][j].appendChild(dot)
    }

    addCircle(i: number, j: number) {

        const circle = document.createElement("div")
        circle.classList.add("markercircle")
        this.setValidMove(i, j)
        this.grid[i][j].appendChild(circle)
    }

    paintPosition(i: number, j: number) {

        const tile = this.grid[i][j]
        tile.innerHTML = ""

        if (this.game.boardstate[i][j] == ".") {
            return;
        }

        const piece = this.game.boardstate[i][j][0];
        const pieceName = this.game.lookupPiece(piece);
        const colour = this.game.boardstate[i][j][1];
        const imgpath = `assets\\${pieceName}_${colour}.png`;

        const img = document.createElement("img")
        img.src = imgpath
        img.style.margin = "5px 5px"

        tile.appendChild(img)
    }

    paintTiles(): void {

        const painting = ["whitebg", "blackbg"]

        var paint: number = 0;
        for (let i = 0; i < 8; i++) {
            this.grid.push([])
            for (let j = 0; j < 8; j++) {
                const tile = document.createElement("div")
                tile.classList.add("boardtile")
                tile.classList.add(painting[paint])
                tile.addEventListener("click", () => {
                    tile.classList.toggle("clicked")
                    this.checkClickEvent()
                })
                this.grid[i].push(tile)
                this.boardContainer.appendChild(tile)
                paint = (paint + 1) % 2
            }
            paint = (paint + 1) % 2
        }
    }
}