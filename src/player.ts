import * as ex from "excalibur";

import resources from "./resources";

export default class Player extends ex.Actor {
    constructor(name: string, x: number, y: number) {
        super({
            pos: ex.vec(x, y),
            width: 16, // for now we'll use a box so we can see the rotation
            height: 16, // later we'll use a circle collider
            color: ex.Color.Yellow,
        });

        const label = new ex.Label({
            text: name,
            pos: ex.vec(0, 10),
            font: new ex.Font({ size: 16 }),
            color: ex.Color.White
        });
        this.addChild(label);

        const spriteSheet = ex.SpriteSheet.fromImageSource({
            image: resources.tilesheetImage,
            grid: {
                rows: 22,
                columns: 49,
                spriteWidth: 16,
                spriteHeight: 16,
            },
            spacing: {
                margin: {
                    x: 1,
                    y: 1
                }
            }
        });

        const rng = new ex.Random();
        const spriteX = rng.integer(24, 31);
        const spriteY = rng.integer(0, 9);
        const sprite = spriteSheet.getSprite(spriteX, spriteY);

        const colours = [ex.Color.fromHex("e6482e"), ex.Color.fromHex("38d973"), ex.Color.fromHex("3cacd7"), ex.Color.fromHex("f4b41b")];
        sprite.tint = rng.pickOne(colours);

        this.graphics.add(sprite);
    }
}