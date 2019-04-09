import { Lambda } from 'aws-sdk'

// interfaces
interface ServiceConfig {
  type: string
}

interface FaasrEnvironmentParams {
  service: ServiceConfig,
  defaultParams: any
}

/*
 * GET Faasr Service
 */
function getService({ region, ...options }) {
  const lambda = new Lambda({ region, ...options })

  return function callService(params) {
    return lambda.invoke(params).promise()
  }
}

/*
 * faasr environment 
 */
export default function faasrEnvironment({
  service,
  defaultParams,

  // transforms
  transformRequest = (res) => res,
  transformResponse = (res) => res,
  transformError= (res) => res,

  // hooks 
  onRequest = (res) => res,
  onResponse = (res) => res,
  onError = (res) => res,
}) {

  const serviceRequest = getService(service)

  /*
   * faasr endpoint
   */
  return function faasrEndpoint(serviceName, params = {}) {
    return {
      request(payload, callService = serviceRequest) {
        const requestParams = transformRequest({ ...defaultParams, ...params })
        return callService(requestParams)
          .then(res => {
            onResponse(res)
            return transformResponse(res)
          })
          .catch(error => {
            onError(error)
            return transformError(error)
          })
      }
    }
  }
}
