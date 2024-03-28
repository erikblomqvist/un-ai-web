'use client'

import { useEffect, useRef } from 'react'

import ResourcesProvider, { useResources } from './context/resources'
import {
    InputProvider, useInput,
    UP, RIGHT, DOWN, LEFT
} from './context/input'

import { Vector2 } from './classes/vector2'
import { Sprite } from './classes/sprite'
import { GameLoop } from './classes/game-loop'
import { Animations } from './classes/animations'
import { FrameIndexPattern } from './classes/frame-index-pattern'

import { gridCells, isSpaceFree } from './helpers/grid'
import { moveTowards } from './helpers/move-towards'

import {
    WALK_DOWN,
    WALK_RIGHT,
    WALK_UP,
    WALK_LEFT,
    STAND_DOWN,
    STAND_RIGHT,
    STAND_UP,
    STAND_LEFT
} from './objects/hero/hero-animations'

import { walls } from './levels/level-1'

const Game = () => {
    const canvasRef = useRef()
    const currentDirectionRef = useRef(null)
    const heroFacingRef = useRef(DOWN)
    
    const ctx = canvasRef.current?.getContext?.('2d')

    const { images = {} } = useResources()

    const { heldDirections = [] } = useInput()

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
        position: new Vector2(gridCells(6), gridCells(5)),
        animations: new Animations({
            walkDown: new FrameIndexPattern(WALK_DOWN),
            walkRight: new FrameIndexPattern(WALK_RIGHT),
            walkUp: new FrameIndexPattern(WALK_UP),
            walkLeft: new FrameIndexPattern(WALK_LEFT),
            standDown: new FrameIndexPattern(STAND_DOWN),
            standRight: new FrameIndexPattern(STAND_RIGHT),
            standUp: new FrameIndexPattern(STAND_UP),
            standLeft: new FrameIndexPattern(STAND_LEFT)
        })
    })

    const heroDestinationPosition = hero.position.duplicate()

    const shadow = new Sprite({
        resource: images.shadow,
        frameSize: new Vector2(32, 32)
    })

    const update = (deltaTime) => {
        const distance = moveTowards(hero, heroDestinationPosition, 1)
        const hasArrived = distance <= 1

        if(hasArrived) {
            tryMove()
        }

        hero.step(deltaTime)
    }

    const tryMove = () => {
        const currentDirection = currentDirectionRef.current
        const heroFacing = heroFacingRef.current

        if(!currentDirection) {
            if(heroFacing === DOWN) { hero.animations.play('standDown') }
            if(heroFacing === UP) { hero.animations.play('standUp') }
            if(heroFacing === LEFT) { hero.animations.play('standLeft') }
            if(heroFacing === RIGHT) { hero.animations.play('standRight') }
            
            return
        }

        let nextX = heroDestinationPosition.x
        let nextY = heroDestinationPosition.y
        const gridSize = 16
        
        if(currentDirection) {
            switch(currentDirection) {
                case DOWN:
                    nextY += gridSize
                    hero.animations.play('walkDown')

                    break
                case UP:
                    nextY -= gridSize
                    hero.animations.play('walkUp')

                    break
                case LEFT:
                    nextX -= gridSize
                    hero.animations.play('walkLeft')

                    break
                case RIGHT:
                    nextX += gridSize
                    hero.animations.play('walkRight')

                    break
            }
        }

        heroFacingRef.current = currentDirection ?? heroFacing

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

    useEffect(() => {
        currentDirectionRef.current = heldDirections[0] ?? null
    }, [heldDirections])

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
            <InputProvider>
                <Game {...props} />
            </InputProvider>
        </ResourcesProvider>
    )
}