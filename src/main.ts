import * as ex from "excalibur";
import Gun from "gun";
import "gun/sea";

import { Player } from "./player";

// async function init() {

const namespace = "bniubiubiub";

const gun = Gun([/*"http://localhost:8766/gun", */"https://gun-manhattan.herokuapp.com/gun"]);
const user = gun.user();
// const db = gun.get(namespace);
// const username = "alan";
// const password = "12345678";

const RegisterForm = document.getElementById("register");
RegisterForm?.addEventListener("submit", handleRegisterSubmit);

function handleRegisterSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (event.target) {
        const data = new FormData(event.target as HTMLFormElement);
        const username = data.get("username")?.toString();
        // const password = data.get("password");
        const password = "12345678";

        if (username && password) {
            user.create(username, password, (ack: any) => {
                if (ack.err) {
                    window.alert(ack.err);
                } else {
                    window.alert("Registered user " + username);
                }
            });
        }
    }
}

const loginForm = document.getElementById("login");
loginForm?.addEventListener("submit", handleLoginSubmit);

function handleLoginSubmit(event: SubmitEvent) {
    event.preventDefault();
    if (event.target) {
        const data = new FormData(event.target as HTMLFormElement);
        const username = data.get("username")?.toString();
        // const password = data.get("password");
        const password = "12345678";

        if (username && password) {
            user.auth(username, password, (userReference: any) => {
                if (userReference.err) {
                    window.alert(userReference.err);
                } else {
                    window.alert("Logged in as " + username);
                }
            });
        }
    }
}

// When a user logs in, create a player random screen coords.
gun.on("auth", (a) => {
    user.get("alias").once((alias) => {
        //     db.get("players").get(alias).put({ name: alias, x: rng.integer(0, 600), y: rng.integer(0, 400) });
        const player = user.get("player");
        player.put({ name: alias, x: rng.integer(0, 600), y: rng.integer(0, 400) });
        gun.get("players").set(player);

        // user.get("test").put("this is a test");
        // user.get("test").on(console.log);
    });
});

// Listen for new players joining
// gun.on("hi", (a) => {
// });

// Listen for users leaving
// gun.on("bye", (a) => {
// });


// user.on((player, a) => {
//     console.log(player);
// });
// console.log(user);


const game = new ex.Engine({
    width: 600,
    height: 400,
    backgroundColor: ex.Color.fromHex("#54C0CA"),
    pixelArt: true,
    pixelRatio: 2,
    displayMode: ex.DisplayMode.FitScreen
});

game.start();

const rng = new ex.Random();

const players: { [key: string]: Player; } = {};

// Get players and render them.
gun.get("players").map().on((playerData, key) => {
    console.log(playerData, key);

    if (players[playerData.name]) {
        // Update the player entity position.
        players[playerData.name].actions.moveTo(playerData.x, playerData.y, 500);
    } else {
        // Create a new player entity.
        const player = new Player(playerData.name, playerData.x, playerData.y);
        game.add(player);
        players[playerData.name] = player;
    }
});

// When user clicks, move their player.
game.input.pointers.primary.on("down", (event: ex.PointerEvent) => {
    if (user.is) {
        const player = user.get("player");
        player.get("x").put(event.worldPos.x);
        player.get("y").put(event.worldPos.y);
    }
});
