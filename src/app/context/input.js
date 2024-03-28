import {
    createContext, useContext,
    useState, useEffect
} from 'react'

// Constants
const UP = 'ArrowUp'
const RIGHT = 'ArrowRight'
const DOWN = 'ArrowDown'
const LEFT = 'ArrowLeft'

const InputContext = createContext()

export const InputProvider = ({ children }) => {
    const [heldDirections, setHeldDirections] = useState([])

    const onKeyDown = direction => {
        setHeldDirections(prevDirections => {
            if(prevDirections.indexOf(direction) === -1) {
                return [direction, ...prevDirections]
            }

            return prevDirections
        })
    }

    const onKeyUp = direction => {
        setHeldDirections(prevDirections => prevDirections.filter(d => d !== direction))
    }

    useEffect(() => {
        const handleKeyDown = e => {
            switch(e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    onKeyDown(UP)
                    break
                case 'ArrowRight':
                case 'KeyD':
                    onKeyDown(RIGHT)
                    break
                case 'ArrowDown':
                case 'KeyS':
                    onKeyDown(DOWN)
                    break
                case 'ArrowLeft':
                case 'KeyA':
                    onKeyDown(LEFT)
                    break
            }
        }

        const handleKeyUp = e => {
            switch(e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    onKeyUp(UP)
                    break
                case 'ArrowRight':
                case 'KeyD':
                    onKeyUp(RIGHT)
                    break
                case 'ArrowDown':
                case 'KeyS':
                    onKeyUp(DOWN)
                    break
                case 'ArrowLeft':
                case 'KeyA':
                    onKeyUp(LEFT)
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    return (
        <InputContext.Provider value={{ heldDirections }}>
            {children}
        </InputContext.Provider>
    )
}

export const useInput = () => useContext(InputContext)