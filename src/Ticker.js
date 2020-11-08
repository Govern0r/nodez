export default class Ticker {
    constructor({ maxUpdatesPerSec, context }){
        this.maxUpdatesPerSec = maxUpdatesPerSec || 10
        this.context = context
        this.interval = null
    }
    start(func){
        this.interval = setInterval(() => {
            func(this.context)
        }, 1000 / this.maxUpdatesPerSec)
    }
    stop(){
        this.clearInterval()
    }
    clearInterval(){
        if(this.interval){
            clearInterval(this.interval)
            this.interval = null
        }
    }
}