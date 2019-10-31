import Modal from './promotionModal.html';
const Chess = require('chess.js').Chess;
require('@chrisoakman/chessboardjs/dist/chessboard-1.0.0');


class BoardChess {
    /**
     * constructor
     * @param id
     * @param config
     */
    constructor(id, config = {}) {
        this.init();
        this.boardId = id;
        this._game = new Chess(config.position);
        this.config = Object.assign({
            draggable: true,
            position: 'start',
            onDragStart: this.onDragStart.bind(this),
            onDrop: this.onDrop.bind(this),
            onSnapEnd: this.onSnapEnd.bind(this),
            pieceTheme: 'public/img/chesspieces/wikipedia/{piece}.png',

        }, config);
        this._board = Chessboard(id, this.config);
        this.state = {
            promote: 'q',
            promoting: false,
            lastSource: '',
            lastTarget: ''
        };
        this.modal = document.createElement('div');
        this.pieces = ['q', 'r', 'n', 'b'];

    }

    /**
     * get fen(
     * @returns {*}
     */
    get fen() {
        return this._game.fen();
    }

    /**
     * game
     */
    get game() {
        return this._game;
    }

    /**
     * board
     */
    get board() {
        return this._board;
    }

    /**
     * get pgn
     * @returns {*}
     */
    get pgn() {
        return this._game.pgn();
    }

    /**
     * move
     * @returns {*|move}
     */
    get move() {
        return this.state.move;
    }

    /**
     * set position
     * @param fen
     */
    set position(fen) {
        this._board.position(fen);
    }

    /**
     * init
     */
    init() {
        if (!window.jQuery) {
            throw new Error(`Jquery dos't included`);
        }
        if (!window.jQuery.ui) {
            throw new Error(`Jquery ui dos't included`);
        }
    }

    /**
     * stop
     */
    stop() {
        $(".ui-selected").each(() => {
            const selectable = $(this.modal).find('ol').find('li');
            const index = selectable.index($(".ui-selected"));
            if (index > -1) {
                const promoteToHtml = selectable[index].innerHTML;
                const span = $('<div>' + promoteToHtml + '</div>').find('span');
                this.setState({promote: span[0].innerHTML});
            }
            this.modal.style.display = 'none';
            $(this.modal).dialog('close');
            $('.ui-selectee').removeClass('ui-selected');
            this.updateBoard(this._board);
        });

    }

    /**
     * function onDragStart
     * @param source
     * @param piece
     * @param position
     * @param orientation
     * @returns {boolean}
     */
    onDragStart(source, piece, position, orientation) {

        // do not pick up pieces if the game is over
        if (this._game.game_over()) return false;

        // only pick up pieces for the side to move
        if ((this._game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (this._game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
        this.trigger('dragStart');
    }

    /**
     * onDrop
     * @param source
     * @param target
     * @returns {string}
     */

    onDrop(source, target) {
        this.setState({
            moveCfg: {
                from: source,
                to: target,
                promotion: 'q'
            }
        });
        const move = this._game.move(this.state.moveCfg);
        this.setState({move})
        // illegal move
        if (move === null) {
            return 'snapback';
        } else {
            this._game.undo(); //move is ok, now we can go ahead and check for promotion
        }

        // is it a promotion?
        const sourceRank = source.substring(2, 1);
        const targetRank = target.substring(2, 1);
        const piece = this._game.get(source).type;

        if (piece === 'p' &&
            ((sourceRank === '7' && targetRank === '8') || (sourceRank === '2' && targetRank === '1'))) {
            this.setState({promoting: true});
            $(this.modal).remove();
            this.modal.innerHTML = Modal;
            this.modal.style.display = 'none';
            document.body.appendChild(this.modal);

            // get piece images
            this.pieces.forEach(item => {
                $(`.promotion-piece-${item}`).attr('src', this.getImgSrc(item));
            });

            //show the select piece to promote to dialog
            $(this.modal).dialog({
                modal: true,
                height: 46,
                width: 184,
                resizable: true,
                draggable: false,
                close: this.onDialogClose.bind(this),
                closeOnEscape: false,
                dialogClass: 'noTitleStuff'
            }).dialog('widget').position({
                of: $(`#${this.boardId}`),
                my: 'middle middle',
                at: 'middle middle',
            });

            $(this.modal).find('ol').selectable({
                stop: this.stop.bind(this)
            });
            //the actual move is made after the piece to promote to
            //has been selected, in the stop event of the promotion piece selectable
            return;

        }
        // no promotion, go ahead and move
        this.makeMove(this._game, this.state.moveCfg);
        this.trigger('drop');
        this.updateStatus();
    }

    /**
     * onDialogClose
     */
    onDialogClose() {
        this.trigger('drop');
        this.makeMove(this._game, Object.assign(this.state.moveCfg, {promotion: this.state.promote}));
    }

    /**
     * function makeMove
     * @param game
     * @param cfg
     * @returns {string}
     */
    makeMove(game, cfg) {
        // see if the move is legal
        const move = game.move(cfg);
        // illegal move
        if (move === null) return 'snapback';
    }

    /**
     * onSnapEnd
     */
    onSnapEnd() {
        if (this.state.promoting) return; //if promoting we need to select the piece first
        this.updateBoard(this._board);

    }

    /**
     * updateBoard
     * @param board
     */
    updateBoard(board) {
        board.position(this._game.fen());
        this.trigger('snapEnd');
        this.setState({promoting: false});
    }

    /**
     * updateStatus
     */
    updateStatus() {
        let status = '';

        let moveColor = 'White';
        if (this._game.turn() === 'b') {
            moveColor = 'Black';
        }

        // checkmate?
        if (this._game.in_checkmate()) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        }

        // draw?
        else if (this._game.in_draw()) {
            status = 'Game over, drawn position';
        }

        // game still on
        else {
            status = moveColor + ' to move';

            // check?
            if (this._game.in_check()) {
                status += ', ' + moveColor + ' is in check';
            }
        }

        this.trigger("update", {
            fen: this.fen,
            pgn: this.pgn
        });
    }

    reset() {
        this._game.load(this.config.position);
        this._board.position(this.config.position);

    }
    /**
     *
     * @param piece
     * @returns {string}
     */
    getImgSrc(piece) {
        let turn = 'w';

        if (this._game.turn() === 'b') {
            turn = 'b';
        }

        return this.config.pieceTheme.replace('{piece}', turn + piece.toLocaleUpperCase());
    }


    setState(state, cb) {
        this.state = Object.assign(this.state, state);
        if (cb) {
            cb();
        }
    }

    /**
     * Subscribe to event, usage:
     *  menu.on('select', function(item) { ... }
     */
    on(eventName, handler) {
        if (!this._eventHandlers) this._eventHandlers = {};
        if (!this._eventHandlers[eventName]) {
            this._eventHandlers[eventName] = [];
        }
        this._eventHandlers[eventName].push(handler);
    }

    /**
     * Cancel the subscription, usage:
     *  menu.off('select', handler)
     */
    off(eventName, handler) {
        let handlers = this._eventHandlers && this._eventHandlers[eventName];
        if (!handlers) return;
        for (let i = 0; i < handlers.length; i++) {
            if (handlers[i] === handler) {
                handlers.splice(i--, 1);
            }
        }
    }

    /**
     * Generate an event with the given name and data
     *  this.trigger('select', data1, data2);
     */
    trigger(eventName, ...args) {
        if (!this._eventHandlers || !this._eventHandlers[eventName]) {
            return; // no handlers for that event name
        }
        // call the handlers
        this._eventHandlers[eventName].forEach(handler => handler.apply(this, args));
    }
}

window.BoardChess =  window.boardChess = window.boardchess = BoardChess;
export default Board
