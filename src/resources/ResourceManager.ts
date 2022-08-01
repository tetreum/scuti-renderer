import { Assets } from '@pixi/assets';

export class ResourceManager {

    private readonly _resourceUrl: string;

    constructor(resourcesUrl: string) {

        this._resourceUrl = resourcesUrl;

    }

    public async initialise(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.add('room', 'generic/room/room.json');
            this.add('room_data', 'generic/room/room_data.json');
            await this.load('room');
            await this.load('room_data');
            resolve();
        });
    }

    public add(name: string, url: string): void {
        Assets.add(name, this._resourceUrl + url, { cors: true });
    }

    public async load(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            Assets.load(name).then((value) => {
                resolve(value);
            });
        });
    }

    public has(name: string): boolean {
        if(Assets.get(name) !== undefined) {
            return true;
        }
        return false;
    }

    /*public async get(name: string, url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this.has(name)) {
                resolve(Assets.get(name));
            } else {
                this.add(name, url);
                this.load(name).then((value) => {
                    resolve(value);
                });
            }
        });
    }*/
    public get(name: string) {
        return Assets.get(name);
    }


}