import * as ex from "excalibur";

import Engine from "./engine";
import Player from "./player";

export default class Game extends ex.Scene {
    playerEntities: { [key: string]: Player; } = {};

    // override onPreLoad(loader: DefaultLoader) {
    //     this.spriteFont = new ex.ImageSource('./res/spritefont.png');
    //     this.playerSpriteSheet = new ex.ImageSource('./res/player-sheet.png');
    //     loader.addResource(this.spriteFont);
    //     loader.addResource(this.playerSpriteSheet);
    // }

    override onInitialize(engine: Engine): void {

        const rng = new ex.Random();

        // User registration.
        document.getElementById("register")?.addEventListener("submit", (event: SubmitEvent) => {
            event.preventDefault();
            if (event.target) {
                const data = new FormData(event.target as HTMLFormElement);
                const username = data.get("username")?.toString();
                // const password = data.get("password");
                const password = "12345678";

                if (username && password) {
                    engine.user.create(username, password, (ack: any) => {
                        if (ack.err) {
                            window.alert(ack.err);
                        } else {
                            window.alert("Registered user " + username);
                        }
                    });
                }
            }
        });

        // User login.
        document.getElementById("login")?.addEventListener("submit", (event: SubmitEvent) => {
            event.preventDefault();
            if (event.target) {
                const data = new FormData(event.target as HTMLFormElement);
                const username = data.get("username")?.toString();
                // const password = data.get("password");
                const password = "12345678";

                if (username && password) {
                    engine.user.auth(username, password, (userReference: any) => {
                        if (userReference.err) {
                            window.alert(userReference.err);
                        } else {
                            window.alert("Logged in as " + username);
                        }
                    });
                }
            }
        });

        // When a user logs in, create a player random screen coords.
        engine.gun.on("auth", (a) => {
            engine.user.get("alias").once((alias) => {
                //     db.get("players").get(alias).put({ name: alias, x: rng.integer(0, 600), y: rng.integer(0, 400) });
                const player = engine.user.get("player");
                player.put({ name: alias, x: rng.integer(0, 600), y: rng.integer(0, 400) });
                engine.gun.get("players").set(player);
            });
        });

        // Get players from DB and render them.
        engine.gun.get("players").map().on((playerData, key) => {
            // console.log(playerData, key);

            const player = this.playerEntities[playerData.name];

            if (player) {
                // Update the player entity position.
                player.actions.clearActions();
                player.actions.moveTo(playerData.x, playerData.y, 500);
            } else {
                // Create a new player entity.
                const newPlayer = new Player(playerData.name, playerData.x, playerData.y);
                this.add(newPlayer);
                this.playerEntities[playerData.name] = newPlayer;
            }
        });

        // When user clicks, move their player.
        this.input.pointers.primary.on("down", (event: ex.PointerEvent) => {
            if (engine.user.is) {
                const player = engine.user.get("player");
                player.get("x").put(event.worldPos.x);
                player.get("y").put(event.worldPos.y);
            }
        });

    }

} 