import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { wrapSoapCall } from '../utils/soap.help';
import { PageDto } from '../utils/utils.dto';
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
import { User } from '../entities';
import * as _ from 'lodash';

/**
 * A service to operate payments action.
 */
@Injectable()
export class PaymentsService {
  constructor(
    @Inject('UsersRepository') private usersRepository: typeof User,
  ) {}

  /**
   * Creates a new customer.
   *
   * @param createCustomerReq customer info
   * @param User user the user
   *
   * @returns customer id
   */
  async createCustomer(
    createCustomerReq: CreateCustomerReq,
    cognitoUser: any,
    tenantId: string,
  ): Promise<CreateCustomerRes> {
    const user = await this.usersRepository.findOne({
      where: { email: cognitoUser.email },
    });
    if (user) {
      if (user.tenantId !== tenantId) {
        throw new HttpException(
          `User's tenant id is incorrect.`,
          HttpStatus.BAD_REQUEST,
        );
      }
      if (user.soapCustomerId) {
        throw new HttpException(
          'User has already registered as a customer in NKS',
          HttpStatus.CONFLICT,
        );
      }
    }

    const res: CreateCustomerRes = await wrapSoapCall(
      client => client.createCustomer.bind(client, createCustomerReq),
      {},
    );

    if (user) {
      await user.update({ soapCustomerId: String(res.CustomerId) });
    } else {
      const newUser = new User();
      newUser.tenantId = tenantId;
      newUser.soapCustomerId = String(res.CustomerId);
      newUser.username = cognitoUser['cognito:username'];
      newUser.email = cognitoUser.email;
      newUser.isAdmin = false;
      newUser.points = 0;
      await newUser.save();
    }

    return res;
  }

  /**
   * Creates a new card.
   *
   * @param createCardReq card info
   * @param pcimask to soap header
   *
   * @returns the new card info
   */
  createCard(
    createCardReq: CreateCardReq,
    pcimask: string,
  ): Promise<CreateCardRes> {
    return wrapSoapCall(
      client => client.createCard.bind(client, createCardReq),
      { wsdl_headers: [{ pcimask }] },
    );
  }

  /**
   * Gets a list of card info.
   *
   * @param getCardsReq card parameters
   * @param pcimask to soap header
   *
   * @returns page of card info
   */
  async getCards(
    getCardsReq: GetCardsReq,
    pcimask: string,
  ): Promise<PageDto<GetCardsRes[]>> {
    const fromIndex = (getCardsReq.page - 1) * getCardsReq.per_page + 1;
    const toIndex = getCardsReq.page * getCardsReq.per_page;
    const res: any = await wrapSoapCall(
      client =>
        client.getCards.bind(
          client,
          _.assign(_.omit(getCardsReq, 'page', 'per_page'), {
            fromIndex,
            toIndex,
          }),
        ),
      {
        wsdl_headers: [{ pcimask }],
      },
    );

    return new PageDto<GetCardsRes[]>(
      res.data,
      null,
      res.pages,
      getCardsReq.page,
      getCardsReq.per_page,
    );
  }

  /**
   * Gets a list of history info.
   *
   * @param getHistoryReq history parameters
   *
   * @returns page of history info
   */
  async getHistory(
    getHistoryReq: GetHistoryReq,
  ): Promise<PageDto<GetHistoryRes[]>> {
    const fromIndex = (getHistoryReq.page - 1) * getHistoryReq.per_page + 1;
    const toIndex = getHistoryReq.page * getHistoryReq.per_page;
    const res: any = await wrapSoapCall(
      client =>
        client.getHistory.bind(
          client,
          _.assign(_.omit(getHistoryReq, ['page', 'per_page']), {
            fromIndex,
            toIndex,
          }),
        ),
      {},
    );

    return new PageDto<GetHistoryRes[]>(
      res.data,
      null,
      res.pages,
      getHistoryReq.page,
      getHistoryReq.per_page,
    );
  }
}
