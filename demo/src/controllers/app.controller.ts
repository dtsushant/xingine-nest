import {ApiTags} from "@nestjs/swagger";
import {Controller, Get, Inject} from "@nestjs/common";
import {LayoutRenderer} from "xingine";
import {AppService} from "@services/app.service";

@ApiTags('App')
@Controller('/')
export class AppController{

    constructor(
        @Inject()
        private readonly appService: AppService,
    ) {}

    @Get('commissars')
    async dispatchAllCommissars(): Promise<LayoutRenderer[]> {
        console.log("accessing the commissars decide")
        return await this.appService.getAllLayoutRenderer();
    }
}