import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { PaymentsController } from './payments/payments.controller';
import { LoyaltyRulesController } from './loyalty-rules/loyalty-rules.controller';
import { LoyaltyPointsController } from './loyalty-points/loyalty-points.controller';
import { PaymentsService } from './payments/payments.service';
import { LoyaltyRulesService } from './loyalty-rules/loyalty-rules.service';
import { LoyaltyPointsService } from './loyalty-points/loyalty-points.service';
import { VerifyTokenMiddleware, AuthMiddleware } from './middleware';
import {
  DatabaseProvider,
  UsersProvider,
  RulesProvider,
  OperationsProvider,
  UserTransactionsProvider,
} from './provider';

@Module({
  controllers: [
    PaymentsController,
    LoyaltyRulesController,
    LoyaltyPointsController,
  ],
  providers: [
    DatabaseProvider,
    UsersProvider,
    RulesProvider,
    OperationsProvider,
    UserTransactionsProvider,
    PaymentsService,
    LoyaltyRulesService,
    LoyaltyPointsService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // apply the middlewares
    consumer.apply(VerifyTokenMiddleware).forRoutes('*');
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: '/payments/customers', method: RequestMethod.POST })
      .forRoutes(PaymentsController);
    consumer.apply(AuthMiddleware).forRoutes(LoyaltyRulesController);
    consumer.apply(AuthMiddleware).forRoutes(LoyaltyPointsController);
  }
}
