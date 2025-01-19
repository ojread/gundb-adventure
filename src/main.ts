import * as ex from "excalibur";

import Engine from "./engine";
import resources from "./resources";

const loader = new ex.Loader(Object.values(resources));

const engine = new Engine();

engine.start(loader).then(() => {
    engine.goToScene("Game");
});
