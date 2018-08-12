//document.body.addEventListener("touchstart", inputHandler, false);
//document.body.addEventListener("click", inputHandler, false);

var num = 0

function inputHandler(event) {
  var x = Math.floor((event.x - offx) / tilesize)
  var y = Math.floor((event.y - offy) / tilesize)
  if (x >= 0 && x <= 7 && y >= 0 & y <= 7) {
    //console.log(x, y);

    //select new fig
    if (!selected.a && event.target.className == 'fig' && (fig_e[x][y].c == '0') == player) {
      console.log('select new fig');
      select(x, y)
      return;
    }

    //deselect fig
    if (selected.a && event.target.className == 'fig' && selected.x == x && selected.y == y) {
      console.log('deselect fig');
      deselect(x, y)
      return;
    }

    //move to another fig
    if (selected.a && event.target.className == 'fig') {
      console.log('move to another fig');
      deselect(selected.x, selected.y)
      move(selected.x, selected.y, x, y)
      return;
    }

    //move to tile
    if (selected.a && event.target.className == 'tile') {
      console.log('move to tile');
      deselect(selected.x, selected.y)
      move(selected.x, selected.y, x, y)
      return;
    }
  }
}


function move(x1, y1, x2, y2) {

  if (fig_e[x1][y1].moveTo(x2, y2, x1, y1)) {
    console.log(99);
    saveBoard()
    num++
    player = !player
    for (var i = 0; i < fig_e.length; i++) {
      for (var j = 0; j < fig_e[i].length; j++) {
        if (fig_e[i][j] && fig_e[i][j].t == '5') {
          var s = checkKing(i, j)
          if (s) {
            board[i][j].style.background = colors[(i + j) % 2]
          } else {
            board[i][j].style.background = '#f66'
          }
        }
      }
    }

    for (var i = 0; i < fig_e.length; i++) {
      if (fig_e[i][0].t == '6') {
        console.log(fig_e[i][0]);
      }
    }
  }

}

function select(x, y) {
  selected.a = true
  selected.x = x
  selected.y = y
  board[x][y].style.background = '#6f6'
}

function deselect(x, y) {
  selected.a = false
  board[x][y].style.background = colors[(x + y) % 2]
}