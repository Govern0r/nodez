// @ts-nocheck
import hotkeys from 'hotkeys-js'

export default class Inputs {
    constructor(inputsToTrack){ // element == thing to listen for inputs on
        this.inputsToTrack = inputsToTrack
        this.inputStates = {} // Cache them
        this.init()
    }
    get state(){
        const inputStates = {...this.inputStates}
        for(let id in inputStates){
            inputStates[id] = hotkeys.isPressed(id) || inputStates[id]
        }
        this.resetInputStates()
        return inputStates
    }
    init(){ // create the event listeners
        this.resetInputStates()
        hotkeys(this.inputsToTrack.join(', '), (e, handler) => {
            this.inputStates[handler.key] = true
        })
    }
    resetInputStates(){
        for(let i of this.inputsToTrack){
            this.inputStates[i] = false
        }
    }
}