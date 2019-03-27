import { Lambda } from 'aws-sdk'
import FaasrRequest from './FaasrRequest'

export default function lambdaService({ region, ...options }, {
  defaultParams,
  transformRequest,
  transformResponse,
  transformError,
}) {
  const lambda = new Lambda({ region, ...options })
  return class LambdaRequest extends FaasrRequest {
    static callService (params) {
      return lambda.invoke(transformRequest(params)).promise()
        .then(transformResponse)
        .catch(transformError)
    }
  }
}
