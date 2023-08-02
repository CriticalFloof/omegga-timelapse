import OmeggaPlugin, { OL, PS, PC } from "omegga";
import { Runtime } from "src/runtime/main";

export type Config = { "Trusted Role": string; "Timelapse Playback Speed": number; "Timelapse Record Speed": number; "Frame Notification": boolean };
export type Storage = {};

export default class Plugin implements OmeggaPlugin<Config, Storage> {
    omegga: OL;
    config: PC<Config>;
    store: PS<Storage>;

    constructor(omegga: OL, config: PC<Config>, store: PS<Storage>) {
        this.omegga = omegga;
        this.config = config;
        this.store = store;
    }

    async init(): Promise<{ registeredCommands: string[] }> {
        return Runtime.main(this.omegga, this.config, this.store);
    }

    async stop() {
        // Anything that needs to be cleaned up...
    }
}
