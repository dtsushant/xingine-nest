import {Injectable, Logger} from "@nestjs/common";
import {LayoutRegistryService, XingineInspectorService} from "../../../src";
import {LayoutRenderer} from "xingine";

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

}