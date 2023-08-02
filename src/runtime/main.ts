import { OmeggaLike, PC, PS } from "omegga";
import { Config, Storage } from "omegga.plugin";
import { Command, TrustLevel } from "src/lib/commands";
import { TimelapseController } from "src/lib/timelapse";

export class Runtime {
    static omegga: OmeggaLike;
    static config: PC<Config>;
    static store: PS<Storage>;

    static async main(omegga: OmeggaLike, config: PC<Config>, store: PS<Storage>): Promise<{ registeredCommands: string[] }> {
        this.omegga = omegga;
        this.config = config;
        this.store = store;

        new Command("timelapse_play", TrustLevel.Trusted, (speaker: string, timelapse_name: string) => {
            if (timelapse_name == undefined) {
                Runtime.omegga.whisper(speaker, "Please enter a timelapse name!");
                return;
            }
            TimelapseController.play(timelapse_name)
                .then(() => {
                    Runtime.omegga.whisper(speaker, `Playing ''${timelapse_name}''...`);
                })
                .catch(() => {
                    Runtime.omegga.whisper(speaker, `Failed to play timelapse. Timelapse ''${timelapse_name}'' doesn't exist!`);
                });
        });

        new Command("timelapse_record", TrustLevel.Trusted, (speaker: string, timelapse_name: string) => {
            if (timelapse_name == undefined) {
                Runtime.omegga.whisper(speaker, "Please enter a timelapse name!");
                return;
            }

            TimelapseController.record(timelapse_name);
            Runtime.omegga.whisper(speaker, `Recording ''${timelapse_name}''...`);
        });

        new Command("timelapse_stop", TrustLevel.Trusted, (speaker: string) => {
            TimelapseController.idle();
            Runtime.omegga.whisper(speaker, `Stopped Timelapse.`);
        });

        new Command("timelapse_list", TrustLevel.Trusted, (speaker: string) => {
            const list = TimelapseController.listTimelapses();
            let coloredList = [];
            for (let i = 0; i < list.length; i++) {
                const name = list[i];
                coloredList.push(`<color="00FF00">${name}</>`);
            }
            if (coloredList.length === 0) coloredList.push("There are no timelapses!");
            Runtime.omegga.whisper(speaker, ...coloredList);
        });

        new Command("timelapse_delete", TrustLevel.Trusted, (speaker: string, timelapse_name: string) => {
            TimelapseController.remove(timelapse_name);
            Runtime.omegga.whisper(speaker, `Deleted timelapse ''${timelapse_name}''.`);
        });

        return { registeredCommands: Command.getList() };
    }
}
