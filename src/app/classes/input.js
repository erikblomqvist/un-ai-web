export const UP = 'ArrowUp'
export const RIGHT = 'ArrowRight'
export const DOWN = 'ArrowDown'
export const LEFT = 'ArrowLeft'

export class Input {
    constructor() {
        this.heldDirections = []

        window.addEventListener('keydown', e => {
            if(e.code === 'ArrowUp' || e.code === 'KeyW') {
                this.onKeyDown(UP)
            }

            if(e.code === 'ArrowRight' || e.code === 'KeyD') {
                this.onKeyDown(RIGHT)
            }

            if(e.code === 'ArrowDown' || e.code === 'KeyS') {
                this.onKeyDown(DOWN)
            }

            if(e.code === 'ArrowLeft' || e.code === 'KeyA') {
                this.onKeyDown(LEFT)
            }
        })

        window.addEventListener('keyup', e => {
            if(e.code === 'ArrowUp' || e.code === 'KeyW') {
                this.onKeyUp(UP)
            }

            if(e.code === 'ArrowRight' || e.code === 'KeyD') {
                this.onKeyUp(RIGHT)
            }

            if(e.code === 'ArrowDown' || e.code === 'KeyS') {
                this.onKeyUp(DOWN)
            }

            if(e.code === 'ArrowLeft' || e.code === 'KeyA') {
                this.onKeyUp(LEFT)
            }
        })
    }

    get direction() {
        if(this.heldDirections.length) {
            return this.heldDirections[0]
        }

        return null
    }

    onKeyDown(direction) {
        if(this.heldDirections.indexOf(direction) === -1) {
            this.heldDirections.unshift(direction)
        }
    }

    onKeyUp(direction) {
        this.heldDirections = this.heldDirections.filter(d => d !== direction)
    }

}