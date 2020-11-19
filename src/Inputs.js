// @ts-nocheck
import hotkeys from 'hotkeys-js'

export default class Inputs {
    constructor(inputsToTrack){ // element == thing to listen for inputs on
        this.inputsToTrack = inputsToTrack
        this.init()
    }
    get state(){
        const inputStates = {}
        for(let input of this.inputsToTrack){
            inputStates[input] = hotkeys.isPressed(input)
        }
        return inputStates
    }
    init(){ // create the event listeners
        hotkeys(this.inputsToTrack, () => {/* null handler */})
    }
}