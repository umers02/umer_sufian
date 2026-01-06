"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let TestModule = class TestModule {
};
TestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
        ],
    })
], TestModule);
async function bootstrap() {
    try {
        console.log('Creating minimal NestJS app...');
        const app = await core_1.NestFactory.create(TestModule);
        const port = 4000;
        console.log(`Starting server on port ${port}...`);
        await app.listen(port);
        console.log(`🚀 Test server running on: http://localhost:${port}`);
    }
    catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=test-server.js.map