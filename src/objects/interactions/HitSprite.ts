import { IPointData, Sprite, Texture } from "pixi.js";
import { HitTexture } from "./HitTexture";

/**
 * HitSprite class that manage the interactions with sprite transparency.
 *
 * @class
 * @memberof Scuti
 */
export class HitSprite extends Sprite {

    /**
     * The sprite interactivity.
     *
     * @member {boolean}
     * @public
     */
    public interactive: boolean;

    /**
     * The global sprite position in the canvas.
     *
     * @member {{ x: number, y: number }}
     * @public
     */
    public getGlobalPosition: () => { x: number, y: number };

    /**
     * The hit texture that contains the hit map data.
     *
     * @member {HitTexture}
     * @private
     */
    private _hitTexture: HitTexture;

    /**
     * @param {Texture} [texture] - The texture that will be converted into a hit texture.
     */
    constructor(
        texture: Texture
    ) {
        super(texture);
    }

    /**
     * Return a boolean indicating if the pointer is on the sprite.
     *
     * @return {boolean}
     * @public
     */
    public containsPoint(
        point: IPointData
    ): boolean {
        /** The sprite is not interactive, so we stop here */
        if(!this.interactive) return false;

        if(this.texture.trim === undefined) return false;

        const width: number = this.texture.orig.width;
        const height: number = this.texture.orig.height;

        const x1: number = this.getGlobalPosition().x + this.texture.trim.x;
        let y1: number = 0;
        let flag: boolean = false;
        /** Check if the pointer is out of bound of the sprite */
        if (point.x >= x1 && point.x < x1 + width) {
            y1 = this.getGlobalPosition().y + this.texture.trim.y;
            if (point.y >= y1 && point.y < y1 + height) flag = true;
        }
        /** Return false if the pointer is out of bound */
        if (!flag) return false;
        /** Create the hit texture */
        if(!this._hitTexture) this._hitTexture = new HitTexture(this);
        /** Check the hit map of the hit texture if the pointer is on a transparent pixel or not */
        return this._hitTexture.hit(point.x - x1, point.y - y1, this.scale.x === -1);
    }

}
