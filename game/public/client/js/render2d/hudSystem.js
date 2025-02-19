import { imageSRC } from "../resources.js"
import TileRenderer from "./tileRenderer.js"

const HUDConsts = {
    tileSize: 32
}
class HUDSystem extends TileRenderer {
    constructor(canvas) {
        // Do parent constructor
        super(canvas)

        // Sprite vars
        this.blockSheet = null

        // Layout vars
        this.screenBox = {
            bottom: Math.floor(this.cHeight),
            right: Math.floor(this.cWidth),
            center: {
                x: Math.floor(this.cWidth/2),
                y: Math.floor(this.cHeight/2)
            }
        }

        // Vars for game HUD objects
        this.hudElements = {
            statsBar: {bake: null, position: {x: 0, y: 0}},
            screenHurt: {bake: null, position: {x: 0, y: 0}},
        }
        
        this.showDamageMarker = false
        this.showHealingMarker = false
        this.hpReadout = 100

        this.invSlotIndexes = [1, 0, 0]

        // Cursor
        // HP meter
        // Ammo meter
        // Inventory hotbar
        //...
    }

    resizeCanvas() {
        super.resizeCanvas()

        // Update screen vars
        this.screenBox = {
            bottom: Math.floor(this.cHeight),
            right: Math.floor(this.cWidth),
            center: {
                x: Math.floor(this.cWidth/2),
                y: Math.floor(this.cHeight/2)
            }
        }

        // Re-bake UI
        // for (const [key, value] of Object.entries(this.hudElements)) {
        //     this.hudElements[key] = {
        //         ...this.hudElements[key],
        //         bake: null // ToDo: replace this with the bake
        //     }
        // }

        // Render
        this.render()
    }

    enableDamageMarker(newValue = 100, heal = false) {
        this.hpReadout = newValue
        if (heal) this.showHealingMarker = true
        else this.showDamageMarker = true
        this.render()

        // Set a delay to turn off the marker
        setTimeout(()=>{
            this.showDamageMarker = false
            this.showHealingMarker = false
            this.render()
        }, 150)
    }

    setupGraphics(props = { blockSheetPath: imageSRC.Tiles }) {
        // Do default
        super.setupGraphics(props)

        // Load block tilesheet
        this.loadImage(props.blockSheetPath, (img) => {
            this.blockSheet = img
        })
    }

    render() {
        // Do default
        super.render()

        // Set initial value of required render vars
        if (!this.invSlotIndexes) this.invSlotIndexes = [1, 0, 0]
        if (!this.screenBox) this.screenBox = {
            bottom: Math.floor(this.cHeight),
            right: Math.floor(this.cWidth),
            center: {
                x: Math.floor(this.cWidth/2),
                y: Math.floor(this.cHeight/2)
            }
        }

        const centerX = (this.screenBox.center.x - HUDConsts.tileSize*0.5)
        const centerY = (this.screenBox.center.y - HUDConsts.tileSize*0.5)
        const statY = (this.screenBox.bottom - HUDConsts.tileSize*1.5)
        const invY = (this.screenBox.bottom - HUDConsts.tileSize*2)

        // ToDo: Bake all this (except for the text, items, & inv selector)
        /////////////////////////////////////////////////////////////////
        // Crossbar
        for (let x = 96; x < (this.screenBox.right - 96); x+=32) {
            this.drawTile(18, { x: x, y: (this.screenBox.bottom - (HUDConsts.tileSize*1.5)) }, HUDConsts.tileSize, this.ctx)
        }
        /////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////
        // Inv
        this.drawTile(49, { x: centerX - (HUDConsts.tileSize*2), y: invY }, HUDConsts.tileSize)
        this.drawTile(50, { x: centerX - (HUDConsts.tileSize), y: invY }, HUDConsts.tileSize)
        this.drawTile(51, { x: centerX, y: invY }, HUDConsts.tileSize)
        this.drawTile(52, { x: centerX + (HUDConsts.tileSize), y: invY }, HUDConsts.tileSize)
        this.drawTile(53, { x: centerX + (HUDConsts.tileSize*2), y: invY }, HUDConsts.tileSize)
        
        this.drawTile(65, { x: centerX - (HUDConsts.tileSize*2), y: invY + (HUDConsts.tileSize) }, HUDConsts.tileSize)
        this.drawTile(66, { x: centerX - (HUDConsts.tileSize), y: invY + (HUDConsts.tileSize) }, HUDConsts.tileSize)
        this.drawTile(67, { x: centerX, y: invY + (HUDConsts.tileSize) }, HUDConsts.tileSize)
        this.drawTile(68, { x: centerX + (HUDConsts.tileSize), y: invY + (HUDConsts.tileSize) }, HUDConsts.tileSize)
        this.drawTile(69, { x: centerX + (HUDConsts.tileSize*2), y: invY + (HUDConsts.tileSize) }, HUDConsts.tileSize)
        /////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////
        // Inv items
        if (this.blockSheet) {
            this.drawTile(this.invSlotIndexes[0], { x: centerX - (HUDConsts.tileSize) - 4, y: invY + (HUDConsts.tileSize*0.5) }, HUDConsts.tileSize, this.ctx, this.blockSheet)
            this.drawTile(this.invSlotIndexes[1], { x: centerX, y: invY + (HUDConsts.tileSize*0.5) }, HUDConsts.tileSize, this.ctx, this.blockSheet)
            this.drawTile(this.invSlotIndexes[2], { x: centerX + (HUDConsts.tileSize) + 4, y: invY + (HUDConsts.tileSize*0.5) }, HUDConsts.tileSize, this.ctx, this.blockSheet)
        }
        /////////////////////////////////////////////////////////////////

        // Inv Selection
        this.drawTile(251, { x: centerX, y: invY + (HUDConsts.tileSize*0.5) }, HUDConsts.tileSize)

        /////////////////////////////////////////////////////////////////
        // HP
        this.drawTile(17, { x: 0, y: (this.screenBox.bottom - (HUDConsts.tileSize*0.5)) }, HUDConsts.tileSize)
        this.drawTile(20, { x: 0, y: statY }, HUDConsts.tileSize)
        this.drawTile(5, { x: (HUDConsts.tileSize), y: statY }, HUDConsts.tileSize)
        this.drawTile(6, { x: (HUDConsts.tileSize*2), y: statY }, HUDConsts.tileSize)
        this.drawTile(9, { x: (HUDConsts.tileSize*3), y: statY }, HUDConsts.tileSize)
        this.drawText(`${this.hpReadout}`, {x: (HUDConsts.tileSize)+17, y: statY + 24})
        /////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////
        // Ammo
        this.drawTile(17, { x: this.screenBox.right - (HUDConsts.tileSize), y: (this.screenBox.bottom - (HUDConsts.tileSize*0.5)) }, HUDConsts.tileSize)
        this.drawTile(21, { x: this.screenBox.right - (HUDConsts.tileSize), y: statY }, HUDConsts.tileSize)
        this.drawTile(10, { x: this.screenBox.right - (HUDConsts.tileSize*4), y: statY }, HUDConsts.tileSize)
        this.drawTile(6, { x: this.screenBox.right - (HUDConsts.tileSize*3), y: statY }, HUDConsts.tileSize)
        this.drawTile(11, { x: this.screenBox.right - (HUDConsts.tileSize*2), y: statY }, HUDConsts.tileSize)
        this.drawText(`--`, {x: this.screenBox.right - (HUDConsts.tileSize*3)-1, y: statY + 24})
        /////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////
        // Heal Marker (ToDo: Make this graphic blue)
        if (this.showHealingMarker) {
            // Top
            for (let x = 32; x < (this.screenBox.right - 32); x+=32) this.drawTile(90, { x: x, y: 0 }, HUDConsts.tileSize, this.ctx)
            // Bottom
            for (let x = 32; x < (this.screenBox.right - 32); x+=32) this.drawTile(95, { x: x, y: this.screenBox.bottom - HUDConsts.tileSize }, HUDConsts.tileSize, this.ctx)
            // Left
            for (let y = 32; y < (this.screenBox.bottom - 32); y+=32) this.drawTile(92, { x: 0, y: y }, HUDConsts.tileSize, this.ctx)
            // Right
            for (let y = 32; y < (this.screenBox.bottom - 32); y+=32) this.drawTile(93, { x: this.screenBox.right - HUDConsts.tileSize, y: y }, HUDConsts.tileSize, this.ctx)

            // Damage Marker Corners
            this.drawTile(89, { x: 0, y: 0 }, HUDConsts.tileSize)
            this.drawTile(91, { x: this.screenBox.right - HUDConsts.tileSize, y: 0 }, HUDConsts.tileSize)
            this.drawTile(94, { x: 0, y: this.screenBox.bottom - HUDConsts.tileSize }, HUDConsts.tileSize)
            this.drawTile(96, { x: this.screenBox.right - HUDConsts.tileSize, y: this.screenBox.bottom - HUDConsts.tileSize }, HUDConsts.tileSize)
        }
        /////////////////////////////////////////////////////////////////

        /////////////////////////////////////////////////////////////////
        // Damage Marker
        if (this.showDamageMarker) {
            // Top
            for (let x = 32; x < (this.screenBox.right - 32); x+=32) this.drawTile(82, { x: x, y: 0 }, HUDConsts.tileSize, this.ctx)
            // Bottom
            for (let x = 32; x < (this.screenBox.right - 32); x+=32) this.drawTile(87, { x: x, y: this.screenBox.bottom - HUDConsts.tileSize }, HUDConsts.tileSize, this.ctx)
            // Left
            for (let y = 32; y < (this.screenBox.bottom - 32); y+=32) this.drawTile(84, { x: 0, y: y }, HUDConsts.tileSize, this.ctx)
            // Right
            for (let y = 32; y < (this.screenBox.bottom - 32); y+=32) this.drawTile(85, { x: this.screenBox.right - HUDConsts.tileSize, y: y }, HUDConsts.tileSize, this.ctx)

            // Damage Marker Corners
            this.drawTile(81, { x: 0, y: 0 }, HUDConsts.tileSize)
            this.drawTile(83, { x: this.screenBox.right - HUDConsts.tileSize, y: 0 }, HUDConsts.tileSize)
            this.drawTile(86, { x: 0, y: this.screenBox.bottom - HUDConsts.tileSize }, HUDConsts.tileSize)
            this.drawTile(88, { x: this.screenBox.right - HUDConsts.tileSize, y: this.screenBox.bottom - HUDConsts.tileSize }, HUDConsts.tileSize)
        }
        /////////////////////////////////////////////////////////////////
        
        // Crosshair
        this.drawTile(250, { x: centerX, y: centerY }, HUDConsts.tileSize)
    }
}

export default HUDSystem
export { HUDConsts }