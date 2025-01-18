import * as ex from "excalibur";
import Gun from "gun";
import "gun/sea";
import "gun/lib/unset";

import { Player } from "./player";

// async function init() {

const namespace = "bniubiubiub";

const gun = Gun([/*"http://localhost:8766/gun", */"https://gun-manhattan.herokuapp.com/gun"]);
const user = gun.user();
const db = gun.get(namespace);

const username = "alan";
const password = "12345678";

// user.create(username, password, (ack) => { console.log(ack); });

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

gun.get("users").map().once((user, id) => {
    console.log(user, id);
});

gun.on("auth", (a) => {
    console.log(a);
    user.get("alias").once((alias) => {
        db.get("players").get(alias).put({ name: alias, x: rng.integer(0, 600), y: rng.integer(0, 400) });
    });
});


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


db.get("players").map().on((playerData, key) => {
    if (players[key]) {
        players[key].actions.moveTo(playerData.x, playerData.y, 500);
    } else {
        const player = new Player(playerData.name, playerData.x, playerData.y);
        game.add(player);
        players[key] = player;
    }
});


game.input.pointers.primary.on("down", (event: ex.PointerEvent) => {
    if (user.is) {
        user.get("alias").once((alias) => {
            db.get("players").get(alias).put({ x: event.worldPos.x, y: event.worldPos.y });
        });
    }
});