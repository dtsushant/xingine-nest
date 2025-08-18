import {Module} from "@nestjs/common";

import {AppController} from "@controllers/app.controller";
import {AppService} from "@services/app.service";
import {XingineModule} from "xingine-nest";

@Module({
    imports:[
        XingineModule
    ],
    controllers: [AppController],
    providers: [AppService],
    exports: [AppService],
})
export class XingineAppModule {}