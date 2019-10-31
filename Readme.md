# Chess Board 
```
Simple chess board used api from chess.js and chessboard.js include new
functionality custom handling envents and custom promotion
```

- example implementation
```js
 var config = {
       ...
        //same chessboard.js configurations
    };
    var ex1Board = new BoardChess('board',config);
```
`methods`
- get fen
```js
ex1Board.fen
```
- get game
```js
ex1Board.game
```
- get board
```js
ex1Board.board
```
- get pgn
```js
ex1Board.pgn
```
- get move
```js
ex1Board.move
```
- set position
```js
ex1Board.position('position string like fen')
```
- mixins(triggers)

`- on dragStart`
```js
ex1Board.on('dragStart',cb => {
//...
})
//es5
ex1Board.on('dragStart',function(){
//...
})
```
`- on drop`
```js
ex1Board.on('drop',cb => {
//...
})
//es5
ex1Board.on('drop',function(){
//...
})
```
`- on drop`
```js
ex1Board.on('snapEnd',cb => {
//...
})
//es5
ex1Board.on('snapEnd',function(){
//...
})
```
`- on update`
```js
ex1Board.on('update',cb => {
//...
})
//es5
ex1Board.on('update',function(){
//...
})
```

`Cancel the subscription, usage handler`

```js
ex1Board.off('update',cb => {
//...
})
//es5
ex1Board.off('update',function(){
//...
})
```
# Chess Board 
```
Simple chess board used api from chess.js and chessboard.js include new
functionality custom handling envents and custom promotion
```

- example implementation
```js
 var config = {
       ...
        //same chessboard.js configurations
    };
    var ex1Board = new BoardChess('board',config);
```
`methods`
- get fen
```js
ex1Board.fen
```
- get game
```js
ex1Board.game
```
- get board
```js
ex1Board.board
```
- get pgn
```js
ex1Board.pgn
```
- get move
```js
ex1Board.move
```
- set position
```js
ex1Board.position('position string like fen')
```
- mixins(triggers)

`- on dragStart`
```js
ex1Board.on('dragStart',cb => {
//...
})
//es5
ex1Board.on('dragStart',function(){
//...
})
```
`- on drop`
```js
ex1Board.on('drop',cb => {
//...
})
//es5
ex1Board.on('drop',function(){
//...
})
```
`- on drop`
```js
ex1Board.on('snapEnd',cb => {
//...
})
//es5
ex1Board.on('snapEnd',function(){
//...
})
```
`- on update`
```js
ex1Board.on('update',cb => {
//...
})
//es5
ex1Board.on('update',function(){
//...
})
```

`Cancel the subscription, usage handler`

```js
ex1Board.off('update',cb => {
//...
})
//es5
ex1Board.off('update',function(){
//...
})
```
