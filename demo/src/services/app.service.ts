import {Injectable, Logger} from "@nestjs/common";
import {LayoutRegistryService, XingineInspectorService} from "../../../src";
import {LayoutRenderer} from "xingine";
import {LAYOUT_MAP} from "@/components/layouts/layout.map";

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);
    constructor(
        private readonly inspectorService: XingineInspectorService,
        private readonly registerLayoutService: LayoutRegistryService,
    ) {}



    async getAllLayoutRenderer(): Promise<LayoutRenderer[]> {
        return this.inspectorService.getAllLayoutRenderers();
    }

    async registerLayout(): Promise<void> {
        console.log('checking Registering all layouts from LAYOUT_MAP');
        this.logger.log('Registering all layouts from LAYOUT_MAP');
        Object.entries(LAYOUT_MAP).forEach(([name, renderer]) => {
            console.log(`Registering layout: ${name}`);
            this.registerLayoutService.registerLayout(name, renderer);
        });
    }

}