function storeFig(h) {
  console.log('store');
  if (h.c == '0') {
    console.log('white');
    for (var i = 0; i < c_left.length; i++) {
      for (var j = 0; j < c_left[i].length; j++) {
        if (c_left[i][j] == null) {
          c_left[i][j] = h
          h.e.style.left = tilesize * i + 'px'
          h.e.style.top = tilesize * j + 'px'
          return;
        }
      }
    }
  } else {
    console.log('black');
    for (var i = 0; i < c_right.length; i++) {
      for (var j = 0; j < c_right[i].length; j++) {
        if (c_right[i][j] == null) {
          console.log(i, j);
          c_right[i][j] = h
          h.e.style.top = tilesize * j + 'px'
          h.e.style.left = (width - tilesize) - (tilesize * i) + 'px'
          return;
        }
      }
    }
  }
}

function getFigCoords(x, y) {
  return {
    x: offx + tilesize * x,
    y: (tilesize - fig_h) * .5 + offy + tilesize * y
  }
}