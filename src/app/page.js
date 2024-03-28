'use client'

import { useEffect, useRef } from 'react'
import ResourcesProvider, { useResources } from './context/resources'
import { Vector2 } from './classes/vector2'
import { Sprite } from './classes/sprite'
import { GameLoop } from './classes/game-loop'
import { Input } from './classes/input'
import { gridCells, isSpaceFree } from './helpers/grid'
import { moveTowards } from './helpers/move-towards'
import { walls } from './levels/level-1'

const Game = () => {
    const canvasRef = useRef()
    const ctx = canvasRef.current?.getContext?.('2d')

    const { images = {} } = useResources()

    const skySprite = new Sprite({
        resource: images.sky,
        frameSize: new Vector2(320, 180)
    })

    const groundSprite = new Sprite({
        resource: images.ground,
        frameSize: new Vector2(320, 180)
    })

    const hero = new Sprite({
        resource: images.hero,
        frameSize: new Vector2(32, 32),
        hFrames: 3,
        vFrames: 8,
        frame: 1,
        position: new Vector2(gridCells(6), gridCells(5))
    })

    const heroDestinationPosition = hero.position.duplicate()

    const shadow = new Sprite({
        resource: images.shadow,
        frameSize: new Vector2(32, 32)
    })

    const input = new Input()

    const update = () => {
        const distance = moveTowards(hero, heroDestinationPosition, 1)
        const hasArrived = distance <= 1

        if(hasArrived) {
            tryMove()
        }
    }

    const tryMove = () => {
        if(!input.direction) {
            return
        }

        let nextX = heroDestinationPosition.x
        let nextY = heroDestinationPosition.y
        const gridSize = 16
        
        if(input.direction) {
            switch(input.direction) {
                case 'ArrowUp':
                    nextY -= gridSize
                    hero.frame = 6

                    break
                case 'ArrowRight':
                    nextX += gridSize
                    hero.frame = 3

                    break
                case 'ArrowDown':
                    nextY += gridSize
                    hero.frame = 0

                    break
                case 'ArrowLeft':
                    nextX -= gridSize
                    hero.frame = 9

                    break
            }
        }

        if(isSpaceFree(walls, nextX, nextY)) {
            heroDestinationPosition.x = nextX
            heroDestinationPosition.y = nextY
        }
    }

    const draw = () => {
        if(!ctx) {
            return
        }

        skySprite.drawImage(ctx, 0, 0)
        groundSprite.drawImage(ctx, 0, 0)

        // Hero offset
        const heroOffset = new Vector2(-8, -21)
        const [
            heroPosX,
            heroPosY
        ] = [
            hero.position.x + heroOffset.x,
            hero.position.y + heroOffset.y
        ]

        shadow.drawImage(ctx, heroPosX, heroPosY)
        hero.drawImage(ctx, heroPosX, heroPosY)
    }

    const gameLoop = new GameLoop(update, draw)

    useEffect(() => {
        gameLoop.start()

        return () => gameLoop.stop()
    }, [ctx, images])

    if(!images) {
        return null
    }

    return (
        <canvas
            id="game-canvas"
            width={320}
            height={180}
            ref={canvasRef}
        />
    )
}

export default function GamePage(props) {
    return (
        <ResourcesProvider>
            <Game {...props} />
        </ResourcesProvider>
    )
}