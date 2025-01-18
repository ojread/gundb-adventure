import * as ex from "excalibur";

export class Player extends ex.Actor {
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
            font: new ex.Font({ size: 16 })
        });

        this.addChild(label);
    }
}