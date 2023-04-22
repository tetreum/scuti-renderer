import { Material } from "./Material";
import { Assets, Sprite, Texture } from "pixi.js";
import { Scuti } from "../../../Scuti";

export class FloorMaterial extends Material {

    /**
     * The game engine instance that the room will be using to render texture.
     *
     * @member {Scuti}
     * @private
     */
    private readonly _engine: Scuti;

    /**
     * The material id from materials.json.
     *
     * @member {number}
     * @private
     */
    private readonly _id: number;

    /**
     * @param {Scuti} [engine] - The scuti engine instance to use.
     * @param {number} [id] - The id of the material (it can be found into materials.json).
     **/
    constructor(
        engine: Scuti,
        id: number
    ) {
        super(0xFFFFFF, Texture.WHITE);

        this._engine = engine;
        this._id = id;
        /** Load the material */
        this._load();
    }

    /**
     * Load the material.
     *
     * @return {void}
     * @private
     */
    private _load(): void {
        const materials: { floorData: { textures: [] } } = Assets.get('room/materials');
        // @ts-ignore
        const material: { id: string, visualizations: [] } = materials.floorData.floors.find(material => material.id === this._id.toString());
        // @ts-ignore
        const { color, materialId } = material.visualizations[0].layers[0];
        // @ts-ignore
        const materialTexture: { id: string, bitmaps: [] } = materials.floorData.textures.find(texture => texture.id === materialId.toString());
        // @ts-ignore
        const name: string = materialTexture.bitmaps[0].assetName;
        const texture: Texture = Assets.get('room/room').textures[`room_${name}.png`];
        const sprite: Sprite = new Sprite(texture);
        this.color = color;
        this.texture = new Texture(this._engine.application.renderer.generateTexture(sprite).baseTexture);
    }

}
