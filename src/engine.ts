import * as ex from "excalibur";
import Gun, { IGunInstance } from "gun";
import "gun/sea";

import Game from "./game";

export default class Engine extends ex.Engine {
    gun: IGunInstance = Gun(["https://gun-manhattan.herokuapp.com/gun"]);
    user = this.gun.user();

    constructor() {
        super({
            width: 600,
            height: 400,
            backgroundColor: ex.Color.fromHex("#472d3c"),
            pixelArt: true,
            pixelRatio: 2,
            displayMode: ex.DisplayMode.FitScreen,
            scenes: {
                Game: Game
            },
            suppressPlayButton: true    // This breaks audio but is less annoying for testing.
        });
    }
}