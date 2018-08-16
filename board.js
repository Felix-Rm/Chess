class Game {
  constructor(spec, plan, acc) {
    this.plan_std = plan

    this.acc = acc

    //width and height of the pieces
    this.pcs_wdh = spec.wdh
    this.pcs_hgt = spec.hgt

    //div to place all pieces
    this.pcs_div = spec.pdiv

    //div for the chess board
    this.tle_div = spec.tdiv

    //div for the 2 side containers
    this.cnt_div = spec.cdiv

    //start x and y (top left corner) of the board
    this.brd_stx = spec.bsx
    this.brd_sty = spec.bsy

    //start x and y for left container
    this.lft_stx = spec.lsx
    this.lft_sty = spec.lsy

    //start x and y for right container
    this.rgt_stx = spec.rsx
    this.rgt_sty = spec.rsy

    this.ignore_load = false


    //create right container
    this.rgt_div = document.createElement('div')
    this.rgt_div.style.position = 'absolute'
    this.rgt_div.style.right = '0px'
    this.rgt_div.style.width = this.pcs_wdh * 2.1 + 'px'
    this.rgt_div.style.height = '100%'
    this.rgt_div.className = 'board cnt cnt_r'
    this.cnt_div.appendChild(this.rgt_div)

    //create left container
    this.lft_div = document.createElement('div')
    this.lft_div.style.position = 'absolute'
    this.lft_div.style.left = '0px'
    this.lft_div.style.width = this.pcs_wdh * 2.1 + 'px'
    this.lft_div.style.height = '100%'
    this.lft_div.className = 'board cnt cnt_l'
    this.cnt_div.appendChild(this.lft_div)

    //indecate that gold is first
    this.lft_div.lang = 'nx'

    //create controll container
    this.btm_cnt = document.createElement('center')
    this.btm_tbl = document.createElement('table')
    this.btm_cnt.className = 'board cnt cnt_b'
    this.btm_trw = document.createElement('tr')

    this.btm_td1 = document.createElement('td')
    this.btm_td1.innerHTML = "NEW"
    this.btm_td1.onclick = () => this.reset(false, true)
    this.btm_td2 = document.createElement('td')
    this.btm_td2.innerHTML = "BACK"
    this.btm_td2.onclick = () => this.back(this)
    this.btm_td3 = document.createElement('td')
    this.btm_td3.innerHTML = "FORWARD"
    this.btm_td3.onclick = () => this.forward(this)
    this.btm_trw.appendChild(this.btm_td1)
    this.btm_trw.appendChild(this.btm_td2)
    this.btm_trw.appendChild(this.btm_td3)
    this.btm_tbl.appendChild(this.btm_trw)
    this.btm_cnt.appendChild(this.btm_tbl)
    this.cnt_div.appendChild(this.btm_cnt)

    //create board
    this.tiles = new Array(8)
    for (var i = 0; i < 8; i++) {
      this.tiles[i] = new Array(8)
      for (var j = 0; j < 8; j++) {
        var tile = document.createElement('div')
        tile.className = 'board tile tile_' + (i + j) % 2
        tile.style.width = tile.style.height = this.pcs_wdh + 'px'
        tile.style.position = 'absolute'
        tile.style.top = (this.brd_sty + i * this.pcs_wdh) + 'px'
        tile.style.left = (this.brd_stx + j * this.pcs_wdh) + 'px'
        this.tiles[i][j] = tile
        this.tle_div.appendChild(tile)
      }
    }

    //create all pieces from the plan
    this.reset(true, false)

    document.body.addEventListener('click', (event) => {
      var img = event.target
      var imgx = parseFloat(img.style.left)
      var imgy = parseFloat(img.style.top)
      if (imgy <= this.brd_sty + this.pcs_wdh * 8 && imgy >= this.brd_sty && imgx <= this.brd_stx + this.pcs_wdh * 8 && imgx >= this.brd_stx) {
        var x = Math.round((imgx - this.brd_stx) / this.pcs_wdh)
        var y = Math.round((imgy - this.brd_sty) / this.pcs_wdh)
        this.handleBoardInput(x, y)
      }
    })

    firebase.database().ref('/users/' + this.acc + '/meta').on('value', (x) => this.load())

    this.piece_marked = false
    this.marked_x = -1
    this.marked_y = -1

    this.moves = 0
    this.player = true

    //log all for debugging
    console.log(this);
  }

  reset(force, del) {
    if (force || confirm("Are you sure you want to start a new game and overwrite the old one?")) {
      this.construct(this.plan_std.left, this.plan_std.right, this.plan_std.board)
      if (del) {
        firebase.database().ref('/users/' + this.acc).set(null)
        this.player = true
        this.moves = 0
        this.save()
      }
    }
  }

  back() {
    var new_m = this.moves > 0 ? this.moves - 1 : 0;
    firebase.database().ref('/users/' + this.acc + '/meta/current').set(new_m)
  }

  forward() {
    var new_m = this.moves + 1
    firebase.database().ref('/users/' + this.acc + '/meta/current').set(new_m)
  }

  change_player() {
    this.player = !this.player
    this.player ? this.btm_cnt.lang = 'w' : this.btm_cnt.lang = 'b';
  }

  construct(left, right, board) {
    for (var i = this.pcs_div.children.length - 1; i >= 0; i--) {
      this.pcs_div.removeChild(this.pcs_div.children[i])
    }

    for (var i = this.tle_div.children.length - 1; i >= 0; i--) {
      this.tle_div.children[i].lang = ''
    }

    this.left = this.fromList(left, this.lft_stx, this.lft_sty)
    this.right = this.fromList(right, this.rgt_stx, this.rgt_sty)
    this.board = this.fromList(board, this.brd_stx, this.brd_sty)
  }

  save() {
    this.ignore_load = true
    var save_data = {}

    save_data.board = new Array(8)
    for (var i = 0; i < 8; i++) {
      save_data.board[i] = new Array(8)
      for (var j = 0; j < 8; j++) {
        if (this.board[i][j])
          save_data.board[i][j] = (this.board[i][j].color ? '0' : '1') + this.board[i][j].type
        else
          save_data.board[i][j] = '  '
      }
    }

    save_data.left = new Array(8)
    for (var i = 0; i < 8; i++) {
      save_data.left[i] = new Array(2)
      for (var j = 0; j < 2; j++) {
        if (this.left[i][j])
          save_data.left[i][j] = (this.left[i][j].color ? '0' : '1') + this.left[i][j].type
        else
          save_data.left[i][j] = '  '
      }
    }

    save_data.right = new Array(8)
    for (var i = 0; i < 8; i++) {
      save_data.right[i] = new Array(2)
      for (var j = 0; j < 8; j++) {
        if (this.right[i][j])
          save_data.right[i][j] = (this.right[i][j].color ? '0' : '1') + this.right[i][j].type
        else
          save_data.right[i][j] = '  '
      }
    }

    save_data.player = this.player
    save_data.moves = this.moves

    console.log(save_data);

    firebase.database().ref('/users/' + this.acc + '/move_' + this.moves + '/').set(save_data)
    firebase.database().ref('/users/' + this.acc + '/meta').set({
      current: this.moves
    })
  }

  load() {
    if (!this.ignore_load) {
      console.log("loading");
      firebase.database().ref('/users/' + this.acc + '/meta').once('value').then((move) => {
        firebase.database().ref('/users/' + this.acc + '/move_' + move.val().current + '/').once('value').then((data) => {
          data = data.val()
          try {
            this.player = !data.player
            this.change_player()
            this.moves = data.moves
            this.construct(data.left, data.right, data.board)
            this.check_checkmate(true)
            this.check_checkmate(false)
          } catch(err) {
            console.log("loding not possible");
            this.moves++;
            this.back()
          }
        })
      })
    } else {
      this.ignore_load = false
    }
  }


  //creates and places all pieces from plan
  fromList(list, x, y) {
    var out = new Array(list.length)
    for (var i = 0; i < list.length; i++) {
      out[i] = new Array(list[i].length)
      for (var j = 0; j < list[i].length; j++) {
        out[i][j] = this.createPiece(list[i][j], x + j * this.pcs_wdh, y + i * this.pcs_wdh + (this.pcs_wdh - this.pcs_hgt) / 2, this.pcs_div)
      }
    }
    return out
  }

  //creates the right piece from:
  // color+type | x-position | y-position | div for pieces
  createPiece(t, x, y, d) {
    switch (t[1]) {
    case '1':
      return new queen(t, x, y, d, this);
      break;
    case '2':
      return new bishop(t, x, y, d, this);
      break;
    case '3':
      return new knight(t, x, y, d, this);
      break;
    case '4':
      return new rook(t, x, y, d, this);
      break;
    case '5':
      return new king(t, x, y, d, this);
      break;
    case '6':
      return new pawn(t, x, y, d, this);
      break;
    default:
      return null;
    }
  }

  handleBoardInput(x, y) {
    if (!this.piece_marked && this.board[y][x] != null && this.board[y][x].color == this.player) {
      this.tiles[y][x].lang = 'en'
      this.marked_x = x
      this.marked_y = y
      this.piece_marked = true

    } else if (this.piece_marked && this.marked_x == x && this.marked_y == y) {
      this.tiles[y][x].lang = ''
      this.piece_marked = false

    } else if (this.piece_marked) {
      debug_on ? console.log("move") : 0

      if (this.board[this.marked_y][this.marked_x].moveTo(x, y, this.marked_x, this.marked_y)) {
        this.tiles[this.marked_y][this.marked_x].lang = ''
        this.piece_marked = false

        debug_on ? console.table(game.board) : 0

        this.check_checkmate(true)
        this.check_checkmate(false)

        this.change_player()
        this.moves++;
        this.save()
      }
    }
  }

  check_checkmate(c) {
    var king_x = -1
    var king_y = -1

    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] != null && this.board[i][j].type == '5' && this.board[i][j].color == c) {
          king_x = j
          king_y = i
        }
      }
    }

    for (var i = 0; i < this.board.length; i++) {
      for (var j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] != null && this.board[i][j].valid(king_x, king_y, j, i)) {
          this.tiles[king_y][king_x].lang = 'at'
          return true
        }
      }
    }

    this.tiles[king_y][king_x].lang = ''
    return false
  }
}
