import { SoapService, SoapOperation } from "soap-decorators";
import { CreateCustomerResult } from "../models/CreateCustomerResult";
import { CreateCustomerInput } from "../models/CreateCustomerInput";
import { CreateCardInput } from "../models/CreateCardInput";
import { GetCardsInput } from "../models/GetCardsInput";
import { GetHistoryInput } from "../models/GetHistoryInput";
import { CreateCardResult } from "../models/CreateCardResult";
import { GetCardPageResult } from "../models/GetCardPageResult";
import { GetHistoryPageResult } from "../models/GetHistoryPageResult";
import dummyjson = require("dummy-json");
import fs = require("fs");

@SoapService({
  portName: "PaymentPort",
  serviceName: "PaymentService"
})
export class PaymentController {
  @SoapOperation(CreateCustomerResult)
  createCustomer(data: CreateCustomerInput): CreateCustomerResult {
    if (data.InstId === 'ERROR') {
      throw {
        Fault: {
          faultcode: '101',
          faultstring: 'Institution not exist in CAS'
        }
      }
    } else {
      return {
        CustomerId: Math.floor(Math.random() * Math.floor(10000000000000000))
      };
    }
  }

  @SoapOperation(CreateCardResult)
  createCard(data: CreateCardInput): CreateCardResult {
    if (data.CustomerNo === 'ERROR') {
      throw {
        Fault: {
          faultcode: '100',
          faultstring: 'Customer no existed in CAS'
        }
      }
    } else {
      const template = fs.readFileSync("create-card-res-template.hbs", {
        encoding: "utf8"
      });
      return dummyjson.parse(template);
    }
  }

  @SoapOperation(GetCardPageResult)
  getCards(data: GetCardsInput): GetCardPageResult {
    const template = fs.readFileSync("get-cards-res-template.hbs", {
      encoding: "utf8"
    });
    const res = dummyjson.parse(template);
    return res;
  }

  @SoapOperation(GetHistoryPageResult)
  getHistory(data: GetHistoryInput): GetHistoryPageResult {
    const template = fs.readFileSync("get-history-res-template.hbs", {
      encoding: "utf8"
    });
    const res = dummyjson.parse(template);
    return res;
  }
}
