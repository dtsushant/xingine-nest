import {Module, NestModule,
    OnModuleInit,MiddlewareConsumer} from "@nestjs/common";

import {AppController} from "@controllers/app.controller";
import {AppService} from "@services/app.service";
import {XingineModule} from "../../../src";

@Module({
    imports:[
        XingineModule
    ],
    controllers: [AppController],
    providers: [AppService],
    exports: [AppService],
})
export class XingineAppModule implements NestModule, OnModuleInit{
    constructor(
        private readonly appService: AppService
    ) {}

    async onModuleInit(): Promise<void> {
        await this.appService.registerLayout();
    }

    configure(consumer: MiddlewareConsumer) {

    }
}