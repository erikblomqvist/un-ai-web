export const moveTowards = (sprite, destination, speed) => {
    let distanceToTravelX = destination.x - sprite.position.x
    let distanceToTravelY = destination.y - sprite.position.y
    
    let distance = Math.sqrt(
        distanceToTravelX ** 2 + distanceToTravelY ** 2
    )

    if(distance <= speed) {
        // Done moving
        sprite.position.x = destination.x
        sprite.position.y = destination.y
    } else {
        // Move towards destination
        const normalizedX = distanceToTravelX / distance
        const normalizedY = distanceToTravelY / distance

        sprite.position.x += normalizedX * speed
        sprite.position.y += normalizedY * speed

        distanceToTravelX = destination.x - sprite.position.x
        distanceToTravelY = destination.y - sprite.position.y

        distance = Math.sqrt(
            distanceToTravelX ** 2 + distanceToTravelY ** 2
        )
    }

    return distance
}