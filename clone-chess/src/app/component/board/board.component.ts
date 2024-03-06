import { Component } from '@angular/core';
import * as Chess from '../../model/chess'


interface Square {
    color: 'light' | 'dark';
    occupier: (null | Chess.ChessPiece);
}

class Board {
    static readonly ranks: string[] = ['8', '7', '6', '5', '4', '3', '2', '1']
    static readonly files: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    static readonly pieces: Chess.PieceIndex = Chess.pieceIndex
    current: { [rank: string]: { [file: string]: Square } } = {}
    constructor() {
        for (let i = 0; i < 8; i++) {
            const r = Board.ranks[i];
            this.current[r] = {};
            for (let j = 0; j < 8; j++) {
                const f = Board.files[j];
                const c = (i + j) % 2 == 0 ? 'light' : 'dark';
                this.current[r][f] = { color: c, occupier: null };
            }
        }
        this.putChess()

    }

    putChess(): void {
        console.log(this.current)
        for (let chessId in Board.pieces) {
            let info = Board.pieces[chessId]
            let chess = new Chess.ChessPiece(chessId)
            this.current[info.rank][info.file].occupier = chess
        }
    }

    static readonly rankMovement = (current: string, step: number) => {
        // '8' + 1 = '7'
        const curInt = parseInt(current)
        const newInt = curInt - step
        if (1 <= newInt && newInt <= 8) {
            return newInt.toString()
        }
        return false
    }

    static readonly fileMovement = (current: string, step: number) => {
        // 'a' + 1 = 'b'
        // 'a'->97, 'h'->104
        const curInt = current.charCodeAt(0) - 97
        const newInt = curInt + step
        if (97 <= newInt && newInt <= 104) {
            return String.fromCharCode(newInt)
        }
        return false
    }
}

@Component({
    selector: 'app-board',
    // template: `
    //   <p>
    //     board works!
    //   </p>
    // `,
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css']
})

export class BoardComponent {
    user: { sex: string } = { sex: 'F' }
    board: any = {};
    ranks: string[] = Board.ranks;
    files: string[] = Board.files;

    highlx: string[] = []
    promote: string[] = []
    selected: string = ''

    winner: string = ''

    reset() {
        this.selected = '';
        this.highlx = [];
        this.promote = []
    }

    select(r: string, f: string): void {
        console.log(this.board[r][f].occupier)
        if (r + f == this.selected) {
            //deselect
            this.reset()
            return
        }
        if (this.highlx.includes(r + f)) {
            //move
            // this.move(this.selected.substring(0, 1), this.selected.substring(1, 2), r, f)
        } else {
            //select and check moves
            this.selected = r + f;
            this.possibleMove(r, f)
        }
    }

    possibleMove(r: string, f: string): Chess.Position[] {
        const chess = this.board[r][f].occupier
        if (chess == null) {
            return []
        }

        const char = chess.character
        let moveSet = chess.moveSet
        let moves = []
        if (char == 'Pawn') {
            const direction = chess.direction;
            if (r == chess.initialPosition.rank && f == chess.initialPosition.file) {
                moveSet = chess.initialMoveSet;
            }
            moveSet.map((move: Chess.Move) => {
                move.rank = move.rank * direction
            })
            console.log(moveSet)
            for (let m in moveSet) {
                const action = moveSet[m]
                for (let i = 1; i < action.step + 1; i++) {
                    const newR = Board.rankMovement(r, action.rank * i)
                    const newF = Board.fileMovement(f, action.file * i)
                    console.log(newR, newF)
                    if (newR && newF) {
                        const sq = this.board[newR][newF]
                        const occupier = sq.occupier
                        const id = newR + newF;
                        if (occupier == null) {
                            moves.push(id)
                        }
                    }
                }
            }
        } else {

        }
        console.log(moves)
        return []
    }

    move(): void { }

    ngOnInit(): void {
        this.board = new Board().current
    }
}