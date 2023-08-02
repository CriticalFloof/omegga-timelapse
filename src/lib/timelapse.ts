import { readdirSync, rmSync, unlinkSync } from "fs";
import { Runtime } from "src/runtime/main";

export class TimelapseController {
    private static intervalId: NodeJS.Timer = null;

    public static idle(): void {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    public static record(timelapse_name: string): void {
        this.idle();

        this.intervalId = setInterval(() => {
            const length = this.getFrames(timelapse_name);

            Runtime.omegga.saveBricks(`Timelapse/${timelapse_name}/Frame_${length}`);
            if (Runtime.config["Frame Notification"]) Runtime.omegga.broadcast(`Frame ${length} Saved!`);
        }, Runtime.config["Timelapse Record Speed"] * 1000);
    }

    public static play(timelapse_name: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            TimelapseController.idle();
            const length = TimelapseController.getFrames(timelapse_name);
            if (length === 0) reject();
            let iteration = 0;
            TimelapseController.intervalId = setInterval(() => {
                if (iteration >= length) {
                    TimelapseController.idle();
                    Runtime.omegga.broadcast(`Timelapse ''${timelapse_name}'' Finished Playback.`);
                    return;
                }
                Runtime.omegga.clearAllBricks(true);
                Runtime.omegga.loadBricks(`Timelapse/${timelapse_name}/Frame_${iteration}`, { quiet: true });
                iteration += 1;
            }, Runtime.config["Timelapse Playback Speed"] * 1000);
            resolve();
        });
    }

    public static remove(timelapse_name: string) {
        rmSync(`${Runtime.omegga.savePath}/Timelapse/${timelapse_name}`, { recursive: true, force: true });
    }

    public static listTimelapses(): string[] {
        let results;
        try {
            results = readdirSync(`${Runtime.omegga.savePath}/Timelapse`);
        } catch (error) {
            results = [];
        }
        return results;
    }

    private static getFrames(timelapse_name: string): number {
        let dirLength: number;
        try {
            dirLength = readdirSync(`${Runtime.omegga.savePath}/Timelapse/${timelapse_name}`).length;
        } catch (error) {
            dirLength = 0;
        }
        return dirLength;
    }
}
