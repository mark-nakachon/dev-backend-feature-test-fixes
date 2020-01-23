import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  SearchTransactionsReq,
  PostTransactionReq,
  ModifyPointsReq,
} from './models';
import { PageDto } from '../utils/utils.dto';
import { User, UserTransaction } from '../entities';
import { AdminGuard } from '../guard/admin.guard';
import { ParseIntPipe } from '../pipe/parse-int.pipe';
import { LoyaltyPointsService } from './loyalty-points.service';
import { AuthUser } from '../decorator';

/**
 * Endpoints for loyalty points
 */
@Controller('loyalty/points')
export class LoyaltyPointsController {
  constructor(private readonly loyaltyPointsService: LoyaltyPointsService) {}

  /**
   * Gets a list of loyalty points transactions. Only admin allowed.
   *
   * @param searchTransactionsReq search transactions request
   *
   * @returns loyalty points transactions data with pagination info
   */
  @Get()
  @UseGuards(AdminGuard)
  searchTransactions(
    @Query() searchTransactionsReq: SearchTransactionsReq,
  ): Promise<PageDto<UserTransaction[]>> {
    return this.loyaltyPointsService.searchTransactions(searchTransactionsReq);
  }

  /**
   * Create a loyalty points transaction. Only admin allowed.
   *
   * @param postTransactionReq create loyalty points transaction info
   *
   * @returns the loyalty points transaction to be created
   */
  @Post()
  @UseGuards(AdminGuard)
  create(
    @Body() postTransactionReq: PostTransactionReq,
  ): Promise<UserTransaction> {
    return this.loyaltyPointsService.createTransaction(postTransactionReq);
  }

  /**
   * Get loyalty points transaction by id. Only admin allowed.
   *
   * @param transactionId the transaction id
   *
   * @returns the loyalty ponits transaction with given id
   */
  @Get(':transactionId')
  @UseGuards(AdminGuard)
  get(
    @Param('transactionId', new ParseIntPipe()) transactionId: number,
  ): Promise<UserTransaction> {
    return this.loyaltyPointsService.get(transactionId);
  }

  /**
   * Redeem Loyalty Points by an authenticated user.
   *
   * @param user the authenticated user
   * @param modifyPointsReq the points info
   *
   * @returns the loyalty ponits transaction
   */
  @Put('redeem')
  redeem(
    @AuthUser() user: User,
    @Body() modifyPointsReq: ModifyPointsReq,
  ): Promise<UserTransaction> {
    return this.loyaltyPointsService.modifyPoints(
      user,
      -modifyPointsReq.points,
    );
  }

  /**
   * Buy Loyalty Points by an authenticated user.
   *
   * @param user the authenticated user
   * @param modifyPointsReq the points info
   *
   * @returns the loyalty ponits transaction
   */
  @Put('buy')
  buy(
    @AuthUser() user: User,
    @Body() modifyPointsReq: ModifyPointsReq,
  ): Promise<UserTransaction> {
    return this.loyaltyPointsService.modifyPoints(user, modifyPointsReq.points);
  }
}
