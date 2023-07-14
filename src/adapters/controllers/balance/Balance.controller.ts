import { IServiceContainer } from "dic-tsk";
import BaseController, { EntryPointHandler, HttpContentTypeEnum, HttpHeaderEnum, HttpMethodEnum, HttpStatusEnum, INextFunction, IRequest, IResponse, IRouter, ServiceContext, applicationStatus } from "../base/Base.controller";
import { TokenDto } from "../../../application/modules/auth/dtos/TokenDto";
import { ResultTDescriber, PropTypeEnum, TypeDescriber } from "../base/context/apiDoc/TypeDescriber";
import container from "./container";
import { IBalance } from "../../../application/modules/balance/dtos/Balance.dto";
import { BalanceInteractor } from "../../../application/iteractors/balance/Balance.iteractor";

export class BalanceController extends BaseController {
    constructor(serviceContainer: IServiceContainer) {
        super(BalanceController.name, serviceContainer, ServiceContext.BALANCE);
    }

    balance: EntryPointHandler = async (
        req: IRequest,
        res: IResponse,
        next: INextFunction,
      ): Promise<void> => {
        

        try {
          const balanceRequest: IBalance = req.body;
          const asset: string = balanceRequest.from;

          return await this.handleResult(
            res,
            next,
            this.servicesContainer.get<BalanceInteractor>(this.CONTEXT, BalanceInteractor.name).execute(
              req.locale,
              res.trace,
              {
                balanceRequest,
                asset,
              }
            ),
            { [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON },
          );
        } catch (error) {
          console.log(error)
        }

    }

    initializeRoutes(router: IRouter): void {
        this.setRouter(router());
        this.addRoute({
            method: HttpMethodEnum.POST,
            path: "/v1/balance",
            handlers: [this.balance],
            produces: [
              {
                applicationStatus: applicationStatus.SUCCESS,
                httpStatus: HttpStatusEnum.SUCCESS,
              },
              {
                applicationStatus: applicationStatus.UNAUTHORIZED,
                httpStatus: HttpStatusEnum.UNAUTHORIZED,
              },
            ],
            description: "Get new balance for a crypto",
            apiDoc: {
              contentType: HttpContentTypeEnum.APPLICATION_JSON,
              requireAuth: false,
              schema: new ResultTDescriber<TokenDto>({
                name: TokenDto.name,
                type: PropTypeEnum.OBJECT,
                props: {
                  data: new TypeDescriber<TokenDto>({
                    name: TokenDto.name,
                    type: PropTypeEnum.OBJECT,
                    props: {
                      token: {
                        type: PropTypeEnum.STRING,
                      },
                      expiresIn: {
                        type: PropTypeEnum.NUMBER,
                      },
                    },
                  }),
                  error: {
                    type: PropTypeEnum.STRING,
                  },
                  message: {
                    type: PropTypeEnum.STRING,
                  },
                  statusCode: {
                    type: PropTypeEnum.STRING,
                  },
                  success: {
                    type: PropTypeEnum.BOOLEAN,
                  },
                },
              }),
              requestBody: {
                description: "Balance for a crypto",
                contentType: HttpContentTypeEnum.APPLICATION_JSON,
                schema: new TypeDescriber<IBalance>({
                  name: PropTypeEnum.STRING,
                  type: PropTypeEnum.OBJECT,
                  props: {
                    from: {
                        type: PropTypeEnum.STRING,
                        required: true,
                      },
                    to: {
                        type: PropTypeEnum.STRING,
                        required: true,
                    },
                    fromAmmount: {
                        type: PropTypeEnum.NUMBER,
                        required: true,
                    }
                  },
                }),
              },
            },
          });
    }
}

export default new BalanceController(container);