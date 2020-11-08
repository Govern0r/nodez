var Game = (function () {
    'use strict';

    class Utils {

        static isValidCSSColor(strColor){
            const s = new Option().style;
            s.color = strColor;
            return s.color !== '';
        }

        static randBetween(min, max){
            return Math.floor(Math.random() * (max - min + 1) + min)
        }

        static randFrom(items){
            return items[Math.floor(Math.random() * items.length)]
        }

    }

    class Grid {
        constructor({ size = 32, baseColor = '#c4c5d0' }){
            if(size > 128) throw Error('Grid cannot be larger than 128 dots')
            this.size = size;
            this.state = [...new Array(size * size)].map(() => baseColor);
            this._changes = []; // [ [index, color], ... ]
        }
        get length(){
            return this.size * this.size
        }
        get changes(){ // This clears the _changes array every time it's accessed
            const changes = [...this._changes];
            this._changes.length = 0;
            return changes
        }
        get(x, y){
            return this.state[
                this.resolveIndex(x, y)
            ]
        }
        getFromIndex(i){
            return this.state[i]
        }
        set(x, y, color){
            const index = this.resolveIndex(x, y);
            this.state[index] = color;
            this._changes.push([index, color]);
        }
        resolveIndex(x, y){
            return ((y-1) * this.size) + (x-1)
        }
        resolveCoords(index){ // returns array in format: [x, y]
            return [
                index % this.size,
                Math.floor(index / this.size)
            ]
        }
    }

    class Ticker {
        constructor({ maxUpdatesPerSec, context }){
            this.maxUpdatesPerSec = maxUpdatesPerSec || 10;
            this.context = context;
            this.interval = null;
        }
        start(func){
            this.interval = setInterval(() => {
                func(this.context);
            }, 1000 / this.maxUpdatesPerSec);
        }
        stop(){
            this.clearInterval();
        }
        clearInterval(){
            if(this.interval){
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    }

    class HTMLRenderer {
        constructor({ element, grid }){
            this.element = element;
            this.grid = grid;
            this.nodes = [];
            this._init();
        }
        setNodeColor(index, color){
            this.nodes[index].style.backgroundColor = color;
        }
        get elementSize(){ // returns array in format: [width, height] (pixels)
            const rect = this.element.getBoundingClientRect();
            return [rect.width, rect.height]
        }
        get nodeSize(){ // returns array in format: [width, height] (pixels)
            const elSize = this.elementSize;
            return [
                elSize[0] / this.grid.size,
                elSize[1] / this.grid.size
            ]
        }
        _init(){
            const nodeSize = this.nodeSize; // cache nodeSize
            const gridLength = this.grid.length; // cache gridLength
            this.element.style.position = 'relative'; // Ensure is relative
            for(let i=0;i<gridLength;i++){
                const node = this.createNode(...this.grid.resolveCoords(i), ...nodeSize, this.grid.getFromIndex(i));
                this.element.appendChild(node);
                this.nodes.push(node);
            }
        }
        createNode(x, y, width, height, color){
            const node = document.createElement('div');
            node.style.position = 'absolute';
            node.style.top = (y/this.grid.size*100) + '%';
            node.style.left = (x/this.grid.size*100) + '%';
            node.style.backgroundColor = color;
            node.style.width = width+'px';
            node.style.height = height+'px';
            node.style.borderRadius = '100px';
            return node
        }
    }

    // Can be swapped easily in future
    const Renderer = HTMLRenderer;

    class Game {
        constructor({ create, update, end, input, maxUpdatesPerSec, element, size, baseColor, colors }){
            // Logic
            this.create = create;
            this._update = update;
            this._end = end;
            this.onInput = input;

            // State
            this.grid = new Grid({ size, baseColor });
            this.renderer = new Renderer({ element, grid: this.grid });
            this.ticker = new Ticker({ maxUpdatesPerSec, context: this });
            this.state = {};
            this.colors = colors || {
                'green': 'green',
                'blue': 'blue',
                'red': 'red'
            };
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
            this.grid.set(x, y, color);
        }
        getDot(x, y){
            return this.grid.get(x, y)
        }
        update(){
            this._update(this);
            const changes = this.grid.changes;
            for(let change of changes){ // change format = [index, color]
                this.renderer.setNodeColor(...change);
            }
        }
        get(key){
            return this.state[key]
        }
        set(key, val){
            this.state[key] = val;
        }
        start(){
            this.create(this);
            this.ticker.start(
                this.update.bind(this)
            );
        }
        pause(){
            this.ticker.stop();
        }
        resume(){
            this.ticker.start(
                this.update.bind(this)
            );
        }
        end(){
            this.ticker.stop();
            this._end(this);
        }
    }

    return Game;

}());
