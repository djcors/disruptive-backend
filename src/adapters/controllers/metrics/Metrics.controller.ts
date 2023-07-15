import { IServiceContainer } from "dic-tsk";
import BaseController, { EntryPointHandler, HttpContentTypeEnum, HttpHeaderEnum, HttpMethodEnum, HttpStatusEnum, INextFunction, IRequest, IResponse, IRouter, ServiceContext, applicationStatus } from "../base/Base.controller";
import { PropTypeEnum, TypeDescriber } from "../base/context/apiDoc/TypeDescriber";
import { MetricUseCase } from "../../../application/modules/metrics/useCases";
import container from "./container";

export class MetricsController extends BaseController {
    constructor(serviceContainer: IServiceContainer) {
        super(MetricsController.name, serviceContainer, ServiceContext.METRIC);
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
            }
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
            schema: new TypeDescriber<string>({
              name: PropTypeEnum.STRING,
              type: PropTypeEnum.PRIMITIVE,
              props: {
                primitive: PropTypeEnum.STRING,
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