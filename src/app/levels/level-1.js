export const walls = new Set()

/* Trees */
walls.add('64,48') // Top left corner
walls.add('224,32') // Top right corner
walls.add('208,64') // Middle right

/* Houses */
walls.add('224,64')

/* Squares */
walls.add('64,64')
walls.add('64,80')
walls.add('80,64')
walls.add('80,80')

walls.add('128,48')
walls.add('144,48')

/* Water */
walls.add('112,80')
walls.add('128,80')
walls.add('144,80')
walls.add('160,80')

/* Rocks */
walls.add('192,96')
walls.add('208,96')
walls.add('224,96')