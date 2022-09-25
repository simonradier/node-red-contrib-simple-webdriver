/*export const Timer = (duration : number) => {
    const startTime = Date.now()
    return () => {
        const ellapsedTime = Date.now() - startTime
        if (duration < ellapsedTime)
            return false
        return true
    }
}*/

export class Timer {

    private _duration : number
    private _startTime : number

    public constructor (duration : number) {
        this._duration = duration
        this._startTime = Date.now()
    }

    public get done() : boolean {
        const ellapsedTime = Date.now() - this._startTime
        if (this._duration > ellapsedTime)
            return false
        return true
    }

}