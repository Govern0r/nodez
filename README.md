![Nodez Game Engine](/misc/nodez-gif.gif)

# Nodez

Nodez is a low-fidelity HTML5 / javascript game engine. Still under construction.

## Installation

Copy the dist/Game.js file into your project, and link to it using a script tag in your HTML.

Here is an example:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Nodez Game</title>
  <meta name="description" content="My fabulous nodez game.">
  <style>
    #game { /* Basic styling for our #game element (600x600 and centered) */
        width: 600px;
        height: 600px;
        margin: 50px auto;
    }
  </style>
</head>
<body>
  <div id="game"></div> <!-- This is the element which will contain the game's renderer -->
  <script src="./Game.js"></script> <!-- This is the dist/Game.js file found in this repository -->
  <script src="./game.js"></script> <!-- This is where your game code could go -->
</body>
</html>
```

## Usage

```javascript
const game = new Game({
    maxUpdatesPerSec: 10,                       // Max amount of times to call update() each second
    element: document.getElementById('game'),   // The HTML element that contains the game
    size: 32,                                   // Grid size. Maximum is 128x128
    baseColor: '#c4c5d0',                       // Default node color
    colors: {                                   // Colors you can access later via game.colors[colorName]
        'red': '#f94144',
        'darkOrange': '#f3722c',
        'orange': '#f8961e',
        'yellow': '#f9c74f',
        'green': '#90be6d',
        'aqua': '#43aa8b',
        'blue': '#577590'
    },
    create(game){  },                           // Called once at the start of the game.
    update(game){                               // Called every tick.
        for(let i=0;i<10;i++){
            game.setDot(
                ...game.randomPosition(),
                game.randomColor()
            )
        }
    },
    input(game){  },                            // TODO - Not functional yet
    end(game){  }                               // TODO - Not functional yet
})

game.start()                                    // Call game.start() to launch it!
```

## License
[MIT](https://choosealicense.com/licenses/mit/)