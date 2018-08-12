class piece {
  constructor(args) {
    this.game = args[4] //board reference
    this.d = args[3] //div to place piece in
    this.color = args[0][0] == '0' //color (true|false)
    this.type = args[0][1] //type

    this.e = document.createElement('img')
    this.e.src = `img/${args[0]}.png`
    this.e.style.width = this.game.pcs_wdh + 'px'
    this.e.style.height = this.game.pcs_hgt + 'px'
    this.e.style.position = 'absolute'
    this.e.style.top = args[2] + 'px'
    this.e.style.left = args[1] + 'px'
    this.e.className = 'board piece'
    this.d.appendChild(this.e)
  }

  checkDest(x, y) {
    if (this.game.board[y][x] == null || (this.game.board && this.game.board[y][x].color != this.color)) return true;
    return false;
  }

  checkStraight(x, y, my_x, my_y) {
    if (x == my_x) { //vertical
      var start = Math.min(y, my_y) + 1
      var end = Math.max(y, my_y) - 1
      for (var i = start; i <= end; i++) {
        //this.game.tiles[i][x].style.background = '#f00'
        if (this.game.board[i][x] != null) return false
      }
    }

    if (y == my_y) { //horizontal
      var start = Math.min(x, my_x) + 1
      var end = Math.max(x, my_x) - 1
      for (var i = start; i <= end; i++) {
        //this.game.tiles[y][i].style.background = '#f00'
        if (this.game.board[y][i] != null) return false
      }
    }
    return true;
  }

  checkDiagonal(x, y, my_x, my_y) {
    if (my_x < x && my_y < y) { //top left to bottom right
      for (var i = 1; i < x - my_x; i++) {
        //this.game.tiles[my_y + i][my_x + i].style.background = '#f00'
        if (this.game.board[my_y + i][my_x + i] != null) return false
      }
    }

    if (x < my_x && my_y < y) { //top right to bottom left
      for (var i = 1; i < my_x - x; i++) {
        //this.game.tiles[y - i][x + i].style.background = '#f00'
        if (this.game.board[y - i][x + i] != null) return false
      }
    }

    if (my_x < x && y < my_y) { //bottom left to top right
      for (var i = 1; i < x - my_x; i++) {
        //this.game.tiles[my_y - i][my_x + i].style.background = '#f00'
        if (this.game.board[my_y - i][my_x + i] != null) return false
      }
    }

    if (x < my_x && y < my_y) { //bottom right to top left
      for (var i = 1; i < my_x - x; i++) {
        //this.game.tiles[y + i][x + i].style.background = '#f00'
        if (this.game.board[y + i][x + i] != null) return false
      }
    }

    return true
  }

  move(x, y, my_x, my_y) {
    this.e.style.top = (this.game.brd_sty + y * this.game.pcs_wdh + (this.game.pcs_wdh - this.game.pcs_hgt) / 2) + 'px'
    this.e.style.left = (this.game.brd_stx + x * this.game.pcs_wdh) + 'px'

    if (this.game.board[y][x] != null) {
      this.game.board[y][x].store(x, y)
    }

    this.game.board[my_y][my_x] = null
    this.game.board[y][x] = this
  }

  moveTo(new_x, new_y, my_x, my_y) {
    if (this.valid(new_x, new_y, my_x, my_y)) {
      this.move(new_x, new_y, my_x, my_y);
      return true
    }
    return false
  }

  store(x, y) {
    if (this.color) {
      for (var i = 0; i < this.game.left[0].length; i++) {
        for (var j = 0; j < this.game.left.length; j++) {
          if (this.game.left[j][i] == null) {
            this.game.board[x][y] = null
            this.game.left[j][i] = this
            this.e.style.top = this.game.lft_sty + j * this.game.pcs_wdh + 'px'
            this.e.style.left = this.game.lft_stx + i * this.game.pcs_wdh + 'px'
            return;
          }
        }
      }
    } else {
      for (var i = 0; i < this.game.right[0].length; i++) {
        for (var j = 0; j < this.game.right.length; j++) {
          if (this.game.right[j][i] == null) {
            this.game.board[y][x] = null
            this.game.right[j][i] = this
            this.e.style.top = this.game.rgt_sty + j * this.game.pcs_wdh + 'px'
            this.e.style.left = this.game.rgt_stx + i * this.game.pcs_wdh + 'px'
            return;
          }
        }
      }
    }
  }
}


class rook extends piece {
  constructor() {
    super(arguments)
  }

  valid(x, y, my_x, my_y) {
    if (!(x == my_x || y == my_y) || !this.checkStraight(x, y, my_x, my_y)) return false;
    debug('its a clear straight');
    if (!this.checkDest(x, y)) return false;
    debug('empty tile or enemy pcs');
    return true;
  }
}

class knight extends piece {
  constructor() {
    super(arguments)
  }

  valid(x, y, my_x, my_y) {
    if (!((Math.abs(x - my_x) == 1 && Math.abs(y - my_y) == 2) || (Math.abs(x - my_x) == 2 && Math.abs(y - my_y) == 1))) return false;
    debug('valid spot');
    if (!this.checkDest(x, y)) return false;
    debug('empty tile or enemy pcs');
    return true;
  }
}

class bishop extends piece {
  constructor() {
    super(arguments)
  }

  valid(x, y, my_x, my_y) {
    if (!(Math.abs(x - my_x) == Math.abs(y - my_y) && this.checkDiagonal(x, y, my_x, my_y))) return false;
    debug('its a clear diagonal');
    if (!this.checkDest(x, y)) return false;
    debug('empty tile or enemy pcs');
    return true;
  }
}

class queen extends piece {
  constructor() {
    super(arguments)
  }

  valid(x, y, my_x, my_y) {
    if (!((Math.abs(x - my_x) == Math.abs(y - my_y) && this.checkDiagonal(x, y, my_x, my_y)) || (((x == my_x) || (y == my_y)) && this.checkStraight(x, y, my_x, my_y)))) return false;
    debug('its a clear path');
    if (!this.checkDest(x, y)) return false;
    debug('empty tile or enemy pcs');
    return true;
  }
}

class king extends piece {
  constructor() {
    super(arguments)
  }

  valid(x, y, my_x, my_y) {
    if (!(Math.abs(x - my_x) <= 1 && Math.abs(y - my_y) <= 1)) return false;
    debug('its a clear path');
    if (!this.checkDest(x, y)) return false;
    debug('empty tile or enemy pcs');
    return true;
  }
}

class pawn extends piece {
  constructor() {
    super(arguments)
  }

  valid(x, y, my_x, my_y) {
    if (this.color) {
      var pos1 = (x == my_x && my_y == 1 && y - my_y <= 2 && y - my_y > 0 && this.game.board[y][x] == null)
      var pos2 = (x == my_x && y - my_y == 1 && this.game.board[y][x] == null)
      var pos3 = (Math.abs(my_x - x) == 1 && y - my_y == 1 && this.game.board[y][x] != null)
      if (!pos1 && !pos2 && !pos3) return false
    } else {
      var pos1 = (x == my_x && my_y == 6 && my_y - y <= 2 && my_y - y > 0) //2 foreward if on home position
      var pos2 = (x == my_x && my_y - y == 1 && this.game.board[y][x] == null) //1 forward if not
      var pos3 = (Math.abs(my_x - x) == 1 && my_y - y == 1 && this.game.board[y][x] != null) //take pieces diagonaly
      if (!pos1 && !pos2 && !pos3) return false
    }

    debug('its a clear path');
    if (!this.checkDest(x, y)) return false;
    debug('empty tile or enemy pcs');
    return true;
  }
}