export class Vector2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    duplicate() {
        return new Vector2(this.x, this.y)
    }
}