export default class Grid {
    constructor({ size = 32, baseColor = '#c4c5d0' }){
        if(size > 128) throw Error('Grid cannot be larger than 128 dots')
        this.size = size
        this.state = [...new Array(size * size)].map(() => baseColor)
        this._changes = [] // [ [index, color], ... ]
    }
    get length(){
        return this.size * this.size
    }
    get changes(){ // This clears the _changes array every time it's accessed
        const changes = [...this._changes]
        this._changes.length = 0
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
        const index = this.resolveIndex(x, y)
        this.state[index] = color
        this._changes.push([index, color])
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