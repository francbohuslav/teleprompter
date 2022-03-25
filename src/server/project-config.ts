import { CachedFs } from "dropbox-fs";
import { Inject } from "injector";
import { IPersistanceSettings } from "../common/isocket";

export interface IProjectConfig {
    settings: IPersistanceSettings;
}

const filename = "project-config.json";

export class ProjectConfigurer {
    constructor(@Inject.Value("cachedFs") private cachedFs: CachedFs) {}

    public async getProjectConfig(): Promise<IProjectConfig> {
        let config: IProjectConfig = null;
        if (await this.cachedFs.fileExists(filename)) {
            const content = await this.cachedFs.readFile(filename);
            config = JSON.parse(content) as IProjectConfig;
        } else {
            config = { settings: null };
        }
        config.settings = config.settings || { speed: null, size: null };
        config.settings.speed = config.settings.speed || 4;
        config.settings.size = config.settings.size || { left: 25, right: 75, top: 75, bottom: 25 };
        return config;
    }

    public async setProjectConfig(projectConfig: IProjectConfig): Promise<void> {
        await this.cachedFs.writeFile(filename, JSON.stringify(projectConfig, null, 2));
    }
}
