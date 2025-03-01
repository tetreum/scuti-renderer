import { Room } from "../Room";
import { IPosition3D, ITileConfiguration, ITileInfo } from "../../../interfaces/Room.interface";
import { Container, Graphics, Matrix, Point, Polygon, utils } from "pixi.js";
import { Material } from "../materials/Material";
import { FloorMaterial } from "../materials/FloorMaterial";
import { InteractionManager } from "../../interactions/InteractionManager";
import { IInteractionEvent } from "../../../interfaces/Interaction.interface";
import { IFloorPosition } from "../../../interfaces/Furniture.interface";

/**
 * Tile class that show up during room rendering.
 *
 * @class
 * @memberof Scuti
 */
export class Tile extends Container {

    /**
     * The room instance where the tile will be drawn.
     *
     * @member {Room}
     * @private
     */
    private _room: Room;

    /**
     * The ITileInfo instance
     *
     * @member {ITileInfo}
     * @private
     */
    private _tileInfo?: ITileInfo;

    /**
     * The thickness of the tile part.
     *
     * @member {number}
     * @private
     */
    private _thickness: number;

    /**
     * The tile material that will be applied to this part, it contains the color and the texture of the tile.
     *
     * @member {Material}
     * @private
     */
    private _material: Material;

    /**
     * The tile position.
     *
     * @member {IFloorPosition}
     * @private
     */
    private _position: IFloorPosition;

    /**
     * The tile interaction manager.
     *
     * @member {InteractionManager}
     * @private
     */
    private _interactionManager: InteractionManager = new InteractionManager();

    /**
     * @param {Room} [room] - The room instance where the tile will be drawn.
     * @param {ITileConfiguration} [configuration] - The tile configuration.
     * @param {Material} [configuration.material] - The time material that will be applied.
     * @param {number} [configuration.thickness] - The tile thickness.
     * @param {IPosition3D} [configuration.position] - The tile position.
     **/
    constructor(
        room: Room,
        configuration: ITileConfiguration,
        tileInfo?: ITileInfo,
    ) {
        super();
        /** Store the configuration */
        this._room = room;
        this._tileInfo = tileInfo;
        this._position = configuration.position;
        this._thickness = configuration.thickness ?? 8;
        this._material = configuration.material ?? new FloorMaterial(this._room.engine, 111);
        /** Register interactions */
        this.on("pointerdown", (event: PointerEvent) => this._interactionManager.handlePointerDown({ mouseEvent: event, position: this._position }));
        this.on("pointerup", (event: PointerEvent) => this._interactionManager.handlePointerUp({ mouseEvent: event, position: this._position }));
        this.on("pointermove", (event: PointerEvent) => this._interactionManager.handlePointerMove({ mouseEvent: event, position: this._position }));
        this.on("pointerout", (event: PointerEvent) => this._interactionManager.handlePointerOut({ mouseEvent: event, position: this._position }));
        this.on("pointerover", (event: PointerEvent) => this._interactionManager.handlePointerOver({ mouseEvent: event, position: this._position }));
        // TODO: Make the method public and use it when adding it to a room, not when instancing the class
        /** Draw the tile */
        this._draw();
    }

    /**
     * Draw the tile.
     *
     * @return {void}
     * @private
     */
    private _draw(): void {
        /** Top face */
        const top: Graphics = new Graphics()
            .beginTextureFill({
                texture: this._material.texture,
                color: utils.premultiplyTint(this._material.color, 1),
                //matrix: new Matrix(1, 0.5, 1, -0.5, (this._position.x % 2 === 0 || this._position.y % 2 === 0) && !(this._position.x % 2 === 0 && this._position.y % 2 === 0) ? 32 : 0, (this._position.x % 2 === 0 || this._position.y % 2 === 0) && !(this._position.x % 2 === 0 && this._position.y % 2 === 0) ? 16 : 0)
                matrix: new Matrix(1, 0.5, 1, -0.5, (this._position.y % 2 === 0) ? 32 : 64, (this._position.y % 2 === 0) ? 16 : 0)
            })
            .moveTo(0, 0)
            .lineTo(32, -16)
            .lineTo(64, 0)
            .lineTo(32, 16)
            .lineTo(0, 0)
            .endFill();

        this.addChild(top);
        
        let bottomTile;
        let rightTile;

        if (this._room.tileMap.tileMap[this._position.y + 1][this._position.x] !== undefined) {
            bottomTile = this._room.tileMap.getTileInfo({x: this._position.x, y: this._position.y + 1});
        }
        
        if (typeof this._room.tileMap.tileMap[this._position.y][this._position.x + 1] !== "undefined") {
            rightTile = this._room.tileMap.getTileInfo({x: this._position.x + 1, y: this._position.y});
        }

        if (!bottomTile || bottomTile.stairType !== null || !bottomTile.tile || (this._tileInfo && bottomTile.height != this._tileInfo.height)) {
            /** Left face */
            const left: Graphics = new Graphics()
            .beginTextureFill({
                texture: this._material.texture,
                color: utils.premultiplyTint(this._material.color, 0.8),
                matrix: new Matrix(1, 0.5, 0, 1, 0, 0)
            })
            .moveTo(0, 0)
            .lineTo(0, this._thickness)
            .lineTo(32, 16 + this._thickness)
            .lineTo(32, 16)
            .endFill();

            this.addChild(left);
        }

        if (!rightTile || rightTile.stairType !== null || !rightTile.tile || (this._tileInfo && rightTile.height != this._tileInfo.height)) {
            /** Right face */
            const right: Graphics = new Graphics()
                .beginTextureFill({
                    texture: this._material.texture,
                    color: utils.premultiplyTint(this._material.color, 0.71),
                    matrix: new Matrix(1, -0.5, 0, 1, 0, 0)
                })
                .moveTo(32, 16)
                .lineTo(32, 16 + this._thickness)
                .lineTo(64, this._thickness)
                .lineTo(64, 0)
                .lineTo(32, 16)
                .endFill();
            
            this.addChild(right);
        }

        /** Positionate the wall */
        this.x = 32 * this._position.x - 32 * this._position.y;
        this.y = 16 * this._position.x + 16 * this._position.y - 32 * this._position.z;
        /** Set the hit area */
        this.hitArea = new Polygon(
            new Point(0, 0),
            new Point(32, -16),
            new Point(64, 0),
            new Point(32, 16),
            new Point(0, 0),
        );
    }

    /**
     * Reference to the tile thickness.
     *
     * @member {number}
     * @readonly
     * @public
     */
    public get thickness(): number {
        return this._thickness;
    }

    /**
     * Update the tile thickness and redraw the tile.
     *
     * @param {number} [thickness] - The room tile thickness that will be applied.
     * @public
     */
    public set thickness(
        thickness: number
    ) {
        this._thickness = thickness;
        /** Redraw the tile */
        this._draw();
    }

    /**
     * Reference to the tile material instance.
     *
     * @member {Material}
     * @readonly
     * @public
     */
    public get material(): Material {
        return this._material;
    }

    /**
     * Update the tile material and redraw the tile.
     *
     * @param {Material} [material] - The room tile material that will be applied.
     * @public
     */
    public set material(material: Material) {
        this._material = material;
        /** Redraw the tile */
        this._draw();
    }

    /**
     * Reference to the pointer down event.
     *
     * @member {(event: IInteractionEvent) => void}
     * @readonly
     * @public
     */
    public get onPointerDown(): (event: IInteractionEvent) => void {
        return this._interactionManager.onPointerDown;
    }

    /**
     * Update the event function that will be executed.
     *
     * @param {(event: IInteractionEvent) => void} [value] - The event function that will be executed.
     * @public
     */
    public set onPointerDown(
        value: (event: IInteractionEvent) => void
    ) {
        this._interactionManager.onPointerDown = value;
    }

    /**
     * Reference to the pointer up event.
     *
     * @member {(event: IInteractionEvent) => void}
     * @readonly
     * @public
     */
    public get onPointerUp(): (event: IInteractionEvent) => void {
        return this._interactionManager.onPointerUp;
    }

    /**
     * Update the event function that will be executed.
     *
     * @param {(event: IInteractionEvent) => void} [value] - The event function that will be executed.
     * @public
     */
    public set onPointerUp(
        value: (event: IInteractionEvent) => void
    ) {
        this._interactionManager.onPointerUp = value;
    }

    /**
     * Reference to the pointer move event.
     *
     * @member {(event: IInteractionEvent) => void}
     * @readonly
     * @public
     */
    public get onPointerMove(): (event: IInteractionEvent) => void {
        return this._interactionManager.onPointerMove;
    }

    /**
     * Update the event function that will be executed.
     *
     * @param {(event: IInteractionEvent) => void} [value] - The event function that will be executed.
     * @public
     */
    public set onPointerMove(
        value: (event: IInteractionEvent) => void
    ) {
        this._interactionManager.onPointerMove = value;
    }

    /**
     * Reference to the pointer out event.
     *
     * @member {(event: IInteractionEvent) => void}
     * @readonly
     * @public
     */
    public get onPointerOut(): (event: IInteractionEvent) => void {
        return this._interactionManager.onPointerOut;
    }

    /**
     * Update the event function that will be executed.
     *
     * @param {(event: IInteractionEvent) => void} [value] - The event function that will be executed.
     * @public
     */
    public set onPointerOut(
        value: (event: IInteractionEvent) => void
    ) {
        this._interactionManager.onPointerOut = value;
    }

    /**
     * Reference to the pointer over event.
     *
     * @member {(event: IInteractionEvent) => void}
     * @readonly
     * @public
     */
    public get onPointerOver(): (event: IInteractionEvent) => void {
        return this._interactionManager.onPointerOver;
    }

    /**
     * Update the event function that will be executed.
     *
     * @param {(event: IInteractionEvent) => void} [value] - The event function that will be executed.
     * @public
     */
    public set onPointerOver(
        value: (event: IInteractionEvent) => void
    ) {
        this._interactionManager.onPointerOver = value;
    }

    /**
     * Reference to the pointer double click event.
     *
     * @member {(event: IInteractionEvent) => void}
     * @readonly
     * @public
     */
    public get onDoubleClick(): (event: IInteractionEvent) => void {
        return this._interactionManager.onDoubleClick;
    }

    /**
     * Update the event function that will be executed.
     *
     * @param {(event: IInteractionEvent) => void} [value] - The event function that will be executed.
     * @public
     */
    public set onDoubleClick(
        value: (event: IInteractionEvent) => void
    ) {
        this._interactionManager.onDoubleClick = value;
    }

}
