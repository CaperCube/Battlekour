import perlinNoise3d from "../../../client/js/dist/pnoise3d.js"
import { blockTypes, getBlockByName } from "../../../common/blockSystem.js"
// import { clamp } from "../../../common/dataUtils.js"

////////////////////////////////////////////////////
// Chunk generators
////////////////////////////////////////////////////
class ChunkGenerator {
    constructor() {
        this.noiseScale = 0.09
        this.noiseTolerance = 0.5
        this.noiseAlgorithm = new perlinNoise3d()
        this.noiseAlgorithm2 = new perlinNoise3d()

        ////////////////////////////////////////////////////
        // Noise functions (all should return 0 or some valid block ID)
        ////////////////////////////////////////////////////
        this.noisePatterns = {
            // Basic world generation pattern
            basic: ( x, y, z ) => {
                // Return noise
                const getNoiseVal = ( x, y, z ) => {
                    x=x*this.noiseScale
                    y=y*this.noiseScale
                    z=z*this.noiseScale
                    let noise = this.noiseAlgorithm.get( x, y, z )
                    noise += 1 / ((y+1)*2)
                    noise -= 0.25
                    return noise
                }
                
                // Check surrounding blocks
                const baseNoise = getNoiseVal( x, y, z )
                const blockAbove = getNoiseVal( x, y+1, z )
                const blockMuchAbove = getNoiseVal( x, y+3, z )
                const blockAboveForClumpyStone = getNoiseVal( x, y+6, z )
                const blockAboveForStone = getNoiseVal( x, y+8, z )
            
                // Set blockID
                let blockID = 0
                if (baseNoise > this.noiseTolerance) {
                    // Fine Dirt
                    if (blockMuchAbove > this.noiseTolerance) {
                        blockID = blockTypes.indexOf(getBlockByName('dirt-fine'))
                        // Stone-clumpy
                        if (blockAboveForClumpyStone > this.noiseTolerance) {
                            blockID = blockTypes.indexOf(getBlockByName('stone-clumpy'))
                            // Stone
                            if (blockAboveForStone > this.noiseTolerance) blockID = blockTypes.indexOf(getBlockByName('stone'))
                        }
                    }
                    else blockID = blockTypes.indexOf(getBlockByName('dirt'))

                    if (blockAbove <= this.noiseTolerance) blockID = blockTypes.indexOf(getBlockByName('grass'))
                }

                if (y===0) blockID = blockTypes.indexOf(getBlockByName('steel-riveted'))
            
                return blockID
            },
            // Scary lava planet generation
            lavaPlanet: ( x, y, z ) => {
                // Return noise
                const getNoiseVal = ( x, y, z ) => {
                    x=x*this.noiseScale*2
                    y=y*this.noiseScale*2
                    z=z*this.noiseScale*2
                    let noise = this.noiseAlgorithm.get( x, y, z )
                    noise -= 1/(y+4)
                    noise += 0.125
                    return noise
                }
                const getAltNoiseVal = ( x, y, z ) => {
                    x=x*this.noiseScale
                    y=y*this.noiseScale
                    z=z*this.noiseScale
                    let noise = this.noiseAlgorithm2.get( x, y, z )
                    noise += 1 / ((y+1)*2)
                    // noise -= 0.25
                    return noise
                }
                
                // Check surrounding blocks
                const baseNoise = getNoiseVal( x, y, z )
                const blockMuchAbove = getNoiseVal( x, y+2, z )
                const blockAboveForClumpyStone = getNoiseVal( x, y+8, z )
            
                // Set blockID
                let blockID = 0
                if (baseNoise > this.noiseTolerance) {
                    // Stone-clumpy
                    if (blockMuchAbove > this.noiseTolerance) {
                        blockID = blockTypes.indexOf(getBlockByName('stone-clumpy'))
                        // clumpy
                        if (blockAboveForClumpyStone > this.noiseTolerance) {
                            blockID = blockTypes.indexOf(getBlockByName('stone'))
                        }
                    }
                    else {
                        const blockAbove = getNoiseVal( x, y+1, z )
                        const grassHere = getAltNoiseVal( x, y, z )
                        if (blockAbove <= this.noiseTolerance && grassHere <= this.noiseTolerance) blockID = blockTypes.indexOf(getBlockByName('grass'))
                        else blockID = blockTypes.indexOf(getBlockByName('dirt'))
                    }
                }

                if (y===1) blockID = blockTypes.indexOf(getBlockByName('lava'))
                if (y===0) blockID = blockTypes.indexOf(getBlockByName('steel-riveted'))
            
                return blockID
            },
            // Ocean with land lumps
            ocean: ( x, y, z ) => {
                // Return noise
                const getNoiseVal = ( x, y, z ) => {
                    x=x*this.noiseScale
                    y=y*this.noiseScale
                    z=z*this.noiseScale
                    let noise = this.noiseAlgorithm.get( x, y, z )
                    noise += 1 / ((y+1)*2)
                    noise -= 0.45
                    return noise
                }
                
                // Check surrounding blocks
                const baseNoise = getNoiseVal( x, y, z )
                const blockMuchAbove = getNoiseVal( x, y+2, z )
                const blockAboveForClumpyStone = getNoiseVal( x, y+8, z )
            
                // Set blockID
                let blockID = 0
                if (baseNoise > this.noiseTolerance) {
                    // Stone
                    if (blockMuchAbove > this.noiseTolerance) {
                        blockID = blockTypes.indexOf(getBlockByName('dirt'))
                        // clumpy
                        if (blockAboveForClumpyStone > this.noiseTolerance) {
                            blockID = blockTypes.indexOf(getBlockByName('stone'))
                        }
                    }
                    else blockID = blockTypes.indexOf(getBlockByName('sand'))
                }

                if (y <= 2 && blockID === 0) blockID = blockTypes.indexOf(getBlockByName('water'))
                if (y === 0) blockID = blockTypes.indexOf(getBlockByName('sand'))
            
                return blockID
            },
            // A layered rainbow world
            rainbowCake: ( x, y, z ) => {
                // Return noise
                const getNoiseVal = ( x, y, z ) => {
                    const noiseScale = this.noiseScale * 0.5
                    x=x*noiseScale
                    y=y*noiseScale
                    z=z*noiseScale
                    let noise = this.noiseAlgorithm.get( x, y, z )
                    return noise
                }

                // Block ID's to use
                const colors = [
                    blockTypes.indexOf(getBlockByName('block-white')),
                    blockTypes.indexOf(getBlockByName('block-white')),
                    blockTypes.indexOf(getBlockByName('block-yellow')),
                    blockTypes.indexOf(getBlockByName('block-orange')),
                    blockTypes.indexOf(getBlockByName('block-red')),
                    blockTypes.indexOf(getBlockByName('block-violet')),
                    blockTypes.indexOf(getBlockByName('block-indigo')),                    
                    blockTypes.indexOf(getBlockByName('block-blue')),
                    blockTypes.indexOf(getBlockByName('block-green')),
                    blockTypes.indexOf(getBlockByName('block-grey')),
                    blockTypes.indexOf(getBlockByName('block-black')),
                ]
            
                // Set blockID
                const outterThickness = 0.08
                let blockID = 0

                for (let i = 0; i < colors.length; i++) {
                    const noiseVal = getNoiseVal( x, y, z )
                    if (noiseVal > (this.noiseTolerance + ((i+1)/40)) - outterThickness) {
                        blockID = colors[i]
                    }
                }

                if (y===0) blockID = blockTypes.indexOf(getBlockByName('steel-riveted'))
            
                return blockID
            },
            // Empty with sett blocks on floor
            empty: ( x, y, z ) => {
                let blockID = 0
                if (y===0) blockID = blockTypes.indexOf(getBlockByName('steel-riveted'))
                return blockID
            },
        }
    }

    ////////////////////////////////////////////////////
    // Chunk / Block generators
    ////////////////////////////////////////////////////

    // Perlin generate chunk
    // Returns new Chunk[[[]]]
    generateChunk(offset = {x: 0, y: 0, z: 0}, chunkSize, pattern = 'basic') {
        let newChunk = [[[]]]
        let chunkEmpty = true
    
        for (let y = 0; y < chunkSize; y++) { // Y
        newChunk[y] = []
        for (let x = 0; x < chunkSize; x++) { // X
        newChunk[y][x] = []
        for (let z = 0; z < chunkSize; z++) { // Z

            // Generate block ID
            let pos = { x: (x+offset.x), y: (y+offset.y), z: (z+offset.z) }
            // ToDo: at some point we can expose the world gen function here in a drop-down list or something
            let blockID = this.noisePatterns[pattern](pos.x, pos.y, pos.z)
            if (blockID > 0) chunkEmpty = false
            // if (pos.y === 0) blockID = 6
    
            // Put new ID into stored chunk
            newChunk[y][x][z] = blockID
        }}}
    
        return newChunk
    }

    // Generate world (This should be changed to return a full world chunk array, which will be stored in the currently open `World` object)
    // Returns new Mesh[]
    generateWorld({seed, chunkSize, worldSize, pattern = 'basic'}) {
        // Set the seed from the world data
        const stringToSeed = (s) => { return s.split('').map(x=>x.charCodeAt(0)).reduce((a,b)=>a+b) } // Converts the seed from a string to a useable number
        const usedSeed = (!!seed) ? seed : `${Math.random()}`
        this.noiseAlgorithm.noiseSeed(stringToSeed(usedSeed)) // Changing the seed will change the value of `this.noiseAlgorithm.get(x,y,z)`
        this.noiseAlgorithm2.noiseSeed(stringToSeed(`${usedSeed}_gen2`)) // Changing the seed will change the value of `this.noiseAlgorithm.get(x,y,z)`

        // Set the noise pattern
        const patternToUse = (this.noisePatterns.hasOwnProperty(pattern))? pattern : 'basic'

        // Generate the chunk data
        let worldChunks = [[[]]]
        for (let y = 0; y < worldSize; y++) {
            worldChunks[y] = []
        for (let x = 0; x < worldSize; x++) {
            worldChunks[y][x] = []
        for (let z = 0; z < worldSize; z++) {
            // Generate chunk with a position offset
            const chunkOffset = { x: x*chunkSize, y: y*chunkSize, z: z*chunkSize }
            const chunk = this.generateChunk(chunkOffset, chunkSize, patternToUse)
            worldChunks[y][x][z] = chunk
        }}}

        // This only returns the world chunk data, not the meshes
        return worldChunks
    }

    ////////////////////////////////////////////////////
    // Noise functions (all should return 0 or some valid block ID)
    ////////////////////////////////////////////////////
}

export default ChunkGenerator