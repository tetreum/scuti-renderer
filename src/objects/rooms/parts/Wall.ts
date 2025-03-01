import { Room } from "../Room";
import { IPosition3D, IPosition2D, IWallConfiguration } from "../../../interfaces/Room.interface";
import { Container, Graphics, Matrix, Texture, utils } from "pixi.js";
import { Material } from "../materials/Material";
import { WallType } from "../../../enums/WallType";
import { WallMaterial } from "../materials/WallMaterial";

/**
 * Wall class that show up on the sides of the tiles.
 *
 * @class
 * @memberof Scuti
 */
export class Wall extends Container {

    /**
     * The room instance where the wall will be drawn.
     *
     * @member {Room}
     * @private
     */
    private _room: Room;

    /**
     * The thickness of the wall part.
     *
     * @member {number}
     * @private
     */
    private _thickness: number;

    /**
     * The wall material that will be applied to this part, it contains the color and the texture of the wall.
     *
     * @member {Material}
     * @private
     */
    private _material: Material;

    /**
     * The wall height, the height is added to the base height of the room.
     *
     * @member {number}
     * @private
     */
    private _height: number;

    /**
     * The wall position.
     *
     * @member {IPosition3D}
     * @private
     */
    private _position: IPosition3D;

    /**
     * The wall type.
     *
     * @member {WallType}
     * @private
     */
    private _type: WallType;

    /**
     * @param {Room} [room] - The room instance where the wall will be drawn.
     * @param {IWallConfiguration} [configuration] - The wall configuration.
     * @param {Material} [configuration.material] - The wall material that will be applied.
     * @param {number} [configuration.thickness] - The wall thickness.
     * @param {number} [configuration.height] - The wall height.
     * @param {IPosition3D} [configuration.position] - The wall position.
     * @param {WallType} [configuration.type] - The wall type.
     * @param {boolean} [configuration.door] - Is it a door wall?
     **/
    constructor(
        room: Room,
        configuration: IWallConfiguration
    ) {
        super();

        /** Store the configuration */
        this._room = room;
        this._position = configuration.position;
        this._thickness = configuration.thickness ?? 8;
        this._material = configuration.material ?? new WallMaterial(this._room.engine, 112);
        this._height = configuration.height ?? 0;
        this._type = configuration.type;
        /** Draw the wall */
        this._draw();
    }

    /**
     * Select which wall should be drawn by it's type.
     *
     * @return {void}
     * @private
     */
    private _draw(): void {
        if(this._type === WallType.LEFT_WALL) {
            /** Draw a left wall */
            this._drawWall([
                {
                    x: - this._thickness,
                    y: - this._thickness / 2 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 115 - this._height * 64
                },
                {
                    x: - this._thickness + 32,
                    y: - this._thickness / 2 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 131 - this._height * 64
                },
                {
                    x: - this._thickness + 32 + this._thickness,
                    y: - this._thickness / 2 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 131 + this._thickness / 2 - this._height * 64
                },
                {
                    x: - this._thickness + this._thickness,
                    y: - this._thickness / 2 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 115 + this._thickness / 2 - this._height * 64
                },
            ]);
        } else if(this._type === WallType.RIGHT_WALL) {
            /** Draw a right wall */
            this._drawWall([
                {
                    x: 32,
                    y: - 16 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 115 - this._height * 64
                },
                {
                    x: 32 + this._thickness,
                    y: - 16 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 115 - this._thickness / 2 - this._height * 64
                },
                {
                    x: 64 + this._thickness,
                    y: - 16 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 99 - this._thickness / 2 - this._height * 64
                },
                {
                    x: 64,
                    y: - 16 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 99 - this._height * 64
                },
            ]);
        } else if(this._type === WallType.CORNER_WALL) {
            /** Draw a corner wall */
            this._drawWall([
                {
                    x: 32 - this._thickness,
                    y: - 16 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 115 - this._thickness / 2 - this._height * 64
                },
                {
                    x: 32,
                    y: - 16 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 115 - 2 * (this._thickness / 2) - this._height * 64
                },
                {
                    x: 32 + this._thickness,
                    y: - 16 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 115 - this._thickness / 2 - this._height * 64
                },
                {
                    x: 32,
                    y: - 16 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 115 - this._height * 64
                },
            ]);
        } else if(this._type === WallType.DOOR_WALL) {
            /** Draw a door wall */
            this._drawWall([
                {
                    x: - this._thickness + 32,
                    y: - this._thickness / 2 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 99 - this._height * 64
                },
                {
                    x: - this._thickness + 64,
                    y: - this._thickness / 2 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 115 - this._height * 64
                },
                {
                    x: - this._thickness + 64 + this._thickness,
                    y: - this._thickness / 2 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 115 + this._thickness / 2 - this._height * 64
                },
                {
                    x: - this._thickness + 32 + this._thickness,
                    y: - this._thickness / 2 + this._position.z * 32 - this._room.tileMap.maxZ * 32 - 99 + this._thickness / 2 - this._height * 64
                },
            ]);
        }
    }

    /**
     * Draw the wall using the given points.
     *
     * @param {IPosition2D[]} [points] - The point list that will be used to draw the wall.
     * @return {void}
     * @private
     */
    private _drawWall(points: IPosition2D[]): void {
        /** Top face */
        const top: Graphics = new Graphics()
            .beginTextureFill({
                texture: Texture.WHITE,
                color: utils.premultiplyTint(this._material.color, 0.61)
            })
            .moveTo(points[0].x, points[0].y)
            .lineTo(points[1].x, points[1].y)
            .lineTo(points[2].x, points[2].y)
            .lineTo(points[3].x, points[3].y)
            .lineTo(points[0].x, points[0].y)
            .endFill();
        /** Left face */
        const left: Graphics = new Graphics()
            .beginTextureFill({
                texture: this._type === WallType.RIGHT_WALL ? this._material.texture : Texture.WHITE,
                color: utils.premultiplyTint(this._material.color, 1),
                matrix: new Matrix(1, 0.5, 0, 1, points[0].x, points[0].y)
            })
            .moveTo(points[0].x, points[0].y)
            .lineTo(points[0].x, points[0].y + 115 + this._room.floorThickness + this._room.tileMap.maxZ * 32 - this._position.z * 32 + this._height * 64)
            .lineTo(points[3].x, points[3].y + 115 + this._room.floorThickness + this._room.tileMap.maxZ * 32 - this._position.z * 32 + this._height * 64)
            .lineTo(points[3].x, points[3].y)
            .endFill();
        /** Right face */
        const right: Graphics = new Graphics()
            .beginTextureFill({
                texture: (this._type === WallType.LEFT_WALL || this._type === WallType.DOOR_WALL) ? this._material.texture : Texture.WHITE,
                color: utils.premultiplyTint(this._material.color, 0.8),
                matrix: new Matrix(1, -0.5, 0, 1, points[0].x + this._thickness, points[0].y + 4)
            })
            .moveTo(points[3].x, points[3].y);

        if(this._type === WallType.DOOR_WALL) {
            right
                .lineTo(points[3].x, points[3].y + 22 + this._room.floorThickness + this._room.tileMap.maxZ * 32 - this._position.z * 32 + this._height * 64)
                .lineTo(points[2].x, points[2].y + 22 + this._room.floorThickness + this._room.tileMap.maxZ * 32 - this._position.z * 32 + this._height * 64);
        } else {
            right
                .lineTo(points[3].x, points[3].y + 115 + this._room.floorThickness + this._room.tileMap.maxZ * 32 - this._position.z * 32 + this._height * 64)
                .lineTo(points[2].x, points[2].y + 115 + this._room.floorThickness + this._room.tileMap.maxZ * 32 - this._position.z * 32 + this._height * 64);
        }
        right
            .lineTo(points[2].x, points[2].y)
            .lineTo(points[3].x, points[3].y)
            .endFill();
        /** And we combine everything */
        this.addChild(top);
        this.addChild(left);
        this.addChild(right);
        /** Positionate the wall */
        this.x = 32 * this._position.x - 32 * this._position.y;
        this.y = 16 * this._position.x + 16 * this._position.y - 32 * this._position.z;
    }

}
