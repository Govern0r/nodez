// @ts-ignore
const game = new Game({
    maxUpdatesPerSec: 10,
    element: document.getElementById('game'),
    size: 32,
    baseColor: '#c4c5d0',
    colors: {
        'red': '#f94144',
        'darkOrange': '#f3722c',
        'orange': '#f8961e',
        'yellow': '#f9c74f',
        'green': '#90be6d',
        'aqua': '#43aa8b',
        'blue': '#577590'
    },
    create(game){
        console.log(game)
    },
    update(game){
        for(let i=0;i<10;i++){
            game.setDot(...game.randomPosition(), game.randomColor())
        }
    },
    input(game){
        // Not functional up yet
    },
    end(){

    }
})
game.start()