import { IServiceContainer } from "dic-tsk";
import BaseController, { EntryPointHandler, HttpContentTypeEnum, HttpHeaderEnum, HttpMethodEnum, HttpStatusEnum, INextFunction, IRequest, IResponse, IRouter, ServiceContext, applicationStatus } from "../base/Base.controller";
import { TokenDto } from "../../../application/modules/auth/dtos/TokenDto";
import { ResultTDescriber, PropTypeEnum, TypeDescriber } from "../base/context/apiDoc/TypeDescriber";
import { MetricUseCase } from "../../../application/modules/metrics/useCases";
import container from "./container";
import { Assets } from "../../providers/messari/metrics/models/Assets.enum";

export class MetricsController extends BaseController {
    constructor(serviceContainer: IServiceContainer) {
        super(MetricsController.name, serviceContainer, ServiceContext.SECURITY);
    }

    get: EntryPointHandler = async (
        req: IRequest,
        res: IResponse,
        next: INextFunction,
      ): Promise<void> => {
        
        return this.handleResultDto(
          res,
          next,
          this.servicesContainer.get<MetricUseCase>(this.CONTEXT, MetricUseCase.name).execute(
            req.locale,
            res.trace,
            {
              asset: req.params.asset
            },
          ),
          { [HttpHeaderEnum.CONTENT_TYPE]: HttpContentTypeEnum.APPLICATION_JSON },
        )
    }


    initializeRoutes(router: IRouter): void {
        this.setRouter(router());
        this.addRoute({
          method: HttpMethodEnum.GET,
          path: "/v1/metrics/:asset",
          handlers: [this.get],
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
          description: "Get asset metric",
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
              description: "Merics for assets",
              contentType: HttpContentTypeEnum.APPLICATION_JSON,
              schema: new TypeDescriber<string>({
                name: PropTypeEnum.STRING,
                type: PropTypeEnum.PRIMITIVE,
                props: {
                  primitive: PropTypeEnum.STRING,
                },
              }),
            },
          },
        });
      }
}

export default new MetricsController(container);