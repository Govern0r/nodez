export default class HTMLRenderer {
    constructor({ element, grid }){
        this.element = element
        this.grid = grid
        this.nodes = []
        this._init()
    }
    setNodeColor(index, color){
        this.nodes[index].style.backgroundColor = color
    }
    get elementSize(){ // returns array in format: [width, height] (pixels)
        const rect = this.element.getBoundingClientRect()
        return [rect.width, rect.height]
    }
    get nodeSize(){ // returns array in format: [width, height] (pixels)
        const elSize = this.elementSize
        return [
            elSize[0] / this.grid.size,
            elSize[1] / this.grid.size
        ]
    }
    _init(){
        const nodeSize = this.nodeSize // cache nodeSize
        const gridLength = this.grid.length // cache gridLength
        this.element.style.position = 'relative' // Ensure is relative
        for(let i=0;i<gridLength;i++){
            const node = this.createNode(...this.grid.resolveCoords(i), ...nodeSize, this.grid.getFromIndex(i))
            this.element.appendChild(node)
            this.nodes.push(node)
        }
    }
    createNode(x, y, width, height, color){
        const node = document.createElement('div')
        node.style.position = 'absolute'
        node.style.top = (y/this.grid.size*100) + '%'
        node.style.left = (x/this.grid.size*100) + '%'
        node.style.backgroundColor = color
        node.style.width = width+'px'
        node.style.height = height+'px'
        node.style.borderRadius = '100px'
        return node
    }
}