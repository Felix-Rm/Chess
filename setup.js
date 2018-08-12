var config = {
  apiKey: "AIzaSyAssmz5BYiaDPZYNgDAJGstHbo3JKNZ9kI",
  authDomain: "chess-database-24048.firebaseapp.com",
  databaseURL: "https://chess-database-24048.firebaseio.com",
  projectId: "chess-database-24048",
  storageBucket: "",
  messagingSenderId: "698926746596"
};
firebase.initializeApp(config);


debug_on = false

function debug(x) {
  if (debug_on) console.log(x);
}

var width = window.innerWidth
var height = window.innerHeight

var tilesize = Math.min(height * .85 / 8, (width - 20) / 12.2)

var offx = (width - tilesize * 8) / 2
var offy = height * 0.05

var spec = {
  pdiv: document.getElementById('pces'),
  tdiv: document.getElementById('tile'),
  cdiv: document.getElementById('cnts'),
  wdh: tilesize,
  hgt: tilesize / 1.0909090909,

  bsx: offx,
  bsy: offy,

  lsx: 0,
  lsy: offy,

  rsx: width - tilesize * 2,
  rsy: offy
}

var plan = {
  left: [
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  ']
  ],
  right: [
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  '],
    ['  ', '  ']
  ],
  board: [
    ['04', '03', '02', '01', '05', '02', '03', '04'],
    ['06', '06', '06', '06', '06', '06', '06', '06'],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['16', '16', '16', '16', '16', '16', '16', '16'],
    ['14', '13', '12', '11', '15', '12', '13', '14']
  ]
}

function start(acc) {
  document.getElementById('authentication').style.display = 'none'
  game = new Game(spec, plan, acc)
}


var ui = new firebaseui.auth.AuthUI(firebase.auth());
var specs = {
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccess: function () {
      start(arguments[0].uid)
    }
  }
}

//start('123456')
ui.start('#firebaseui-auth-container', specs);