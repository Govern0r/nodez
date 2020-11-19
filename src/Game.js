import Utils from './Utils'
import Grid from './Grid'
import Ticker from './Ticker'
import HTMLRenderer from './HTMLRenderer'
import Inputs from './Inputs'

// Can be swapped easily in future
const Renderer = HTMLRenderer

export default class Game {
    constructor({ create, update, end, input, maxUpdatesPerSec, element, size, baseColor, colors, inputs }){
        // Logic
        this.create = create
        this._update = update
        this._end = end
        this.onInput = input

        // State
        this._inputs = new Inputs(inputs)
        this.grid = new Grid({ size, baseColor })
        this.renderer = new Renderer({ element, grid: this.grid })
        this.ticker = new Ticker({ maxUpdatesPerSec, context: this })
        this.state = {}
        this.colors = colors || {
            'green': 'green',
            'blue': 'blue',
            'red': 'red'
        }
    }
    get inputs(){
        return this._inputs.state
    }
    randomPosition(){
        return [
            Utils.randBetween(1, this.grid.size),
            Utils.randBetween(1, this.grid.size)
        ]
    }
    randomColor(){
        return this.colors[Utils.randFrom(Object.keys(this.colors))]
    }
    setDot(x, y, color){
        // Validate color is valid
        if(!Utils.isValidCSSColor(color))
            throw Error(`${color} is not a valid CSS color. See: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value`)

        // Validate x, y pos is valid
        if(x > this.grid.size || x < 1)
            throw Error(`Invalid x value: ${x} - it must be between 1 and ${this.grid.size} (inclusive)`)
        if(y > this.grid.size || y < 1)
            throw Error(`Invalid y value: ${y} - it must be between 1 and ${this.grid.size} (inclusive)`)

        // Set color
        this.grid.set(x, y, color)
    }
    getDot(x, y){
        return this.grid.get(x, y)
    }
    update(){
        this._update(this)
        const changes = this.grid.changes
        for(let change of changes){ // change format = [index, color]
            this.renderer.setNodeColor(...change)
        }
    }
    get(key){
        return this.state[key]
    }
    set(key, val){
        this.state[key] = val
    }
    start(){
        this.create(this)
        this.ticker.start(
            this.update.bind(this)
        )
    }
    pause(){
        this.ticker.stop()
    }
    resume(){
        this.ticker.start(
            this.update.bind(this)
        )
    }
    end(){
        this.ticker.stop()
        this._end(this)
    }
}