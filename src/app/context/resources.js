import { Component, createContext, useContext } from 'react'

const ResourcesContext = createContext()

export default class ResourcesProvider extends Component {
    constructor(props) {
        super(props)

        this.state = {
            images: {},
            loadImages: this.loadImages
        }
    }

    componentDidMount() {
        this.loadImages()
    }

    loadImages = () => {
        const toLoad = {
            sky: '/sprites/sky.png',
            ground: '/sprites/ground.png',
            hero: '/sprites/hero-sheet.png',
            shadow: '/sprites/shadow.png',
        }

        Object.keys(toLoad).forEach(key => {
            const img = new Image()

            img.src = toLoad[key]

            img.onload = () => {
                this.setState(prevState => ({
                    images: {
                        ...prevState.images,
                        [key]: {
                            image: img,
                            isLoaded: true
                        }
                    }
                }))
            }
        })
    }

    render() {
        return (
            <ResourcesContext.Provider value={this.state}>
                {this.props.children}
            </ResourcesContext.Provider>
        )
    }
}

export const useResources = () => useContext(ResourcesContext)