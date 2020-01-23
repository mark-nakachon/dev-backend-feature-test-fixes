import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Headers,
  HttpCode,
} from '@nestjs/common';
import {
  CreateCustomerReq,
  CreateCustomerRes,
  CreateCardReq,
  CreateCardRes,
  GetCardsReq,
  GetCardsRes,
  GetHistoryReq,
  GetHistoryRes,
} from './models';
import { PageDto } from 'src/utils/utils.dto';
import { PaymentsService } from './payments.service';
import { CognitoUser } from '../decorator';

/**
 * Endpoints for payment
 */
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Gets history by given parameters.
   *
   * @param params get history parameters
   *
   * @returns page of history response
   */
  @Get('history')
  findHistory(
    @Query() params: GetHistoryReq,
  ): Promise<PageDto<GetHistoryRes[]>> {
    return this.paymentsService.getHistory(params);
  }

  /**
   * Gets cards by given parameters.
   *
   * @param params get cards parameters
   * @param pciMask from header
   *
   * @returns page of cards response
   */
  @Get('cards')
  findCards(
    @Query() params: GetCardsReq,
    @Headers('pcimask') pciMask?: string,
  ): Promise<PageDto<GetCardsRes[]>> {
    return this.paymentsService.getCards(params, pciMask || 'false');
  }

  /**
   * Creates a card.
   *
   * @param body create card info
   * @param pciMask from header
   *
   * @returns the card be created
   */
  @Post('cards')
  @HttpCode(200)
  createCard(
    @Body() body: CreateCardReq,
    @Headers('pcimask') pciMask?: string,
  ): Promise<CreateCardRes> {
    return this.paymentsService.createCard(body, pciMask || 'false');
  }

  /**
   * Creates a customer.
   *
   * @param body create customer info
   * @param req express request
   *
   * @returns customer id
   */
  @Post('customers')
  createCustomer(
    @Body() body: CreateCustomerReq,
    @CognitoUser() user: any,
    @Headers('x-tenant-id') tenantId: string,
  ): Promise<CreateCustomerRes> {
    return this.paymentsService.createCustomer(body, user, tenantId);
  }
}
