import { Assets, Container, Sprite, Texture } from "pixi.js";
import { Room } from "../Room";
import { ICursorConfiguration, IPosition3D } from "../../../interfaces/Room.interface";

/**
 * Cursor class that show up when we move the cursor on a room tile.
 *
 * @class
 * @memberof Scuti
 */
export class Cursor extends Container {

    /**
     * The room instance where the cursor will be drawn.
     *
     * @member {Room}
     * @private
     */
    private _room: Room;

    /**
     * The cursor position.
     *
     * @member {IPosition3D}
     * @private
     */
    private _position: IPosition3D;

    /**
     * @param {Room} [room] - The room instance where the cursor will be drawn.
     * @param {ICursorConfiguration} [configuration] - The tile configuration.
     * @param {IPosition3D} [configuration.position] - The cursor position.
     **/
    constructor(
        room: Room,
        configuration: ICursorConfiguration
    ) {
        super();
        /** Store the configuration */
        this._room = room;
        this._position = configuration.position;
        /** Draw the cursor */
        this._draw();
    }

    /**
     * Draw the cursor.
     *
     * @return {void}
     * @private
     */
    private _draw(): void {
        /** Creating the sprite */
        const texture: Texture = Assets.get('room/cursors').textures['tile_cursor_64_a_0_0.png'];
        const sprite: Sprite = new Sprite(texture);
        sprite.y = -20;
        this.addChild(sprite);
        /** Positionate the cursor */
        this.moveTo(this._position);
    }

    public moveTo (position: IPosition3D): void {
        this._position = position;
        this.x = 32 * this._position.x - 32 * this._position.y;
        this.y = 16 * this._position.x + 16 * this._position.y - 32 * this._position.z;
    }

}
