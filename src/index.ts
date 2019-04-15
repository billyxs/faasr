import { Lambda } from 'aws-sdk'

// interfaces
interface ServiceConfig {
  type: string
}

interface FaasrEnvironmentParams {
  service: ServiceConfig,
  defaultParams: any
}

interface RequestPayload {
  type: object
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
      request(RequestPayload = {}, callService = serviceRequest) {
        const requestParams = transformRequest({ 
          ...defaultParams, 
          ...params,

          // priority
          FunctionName: serviceName,
          Payload: RequestPayload,
        })
        return callService(requestParams)
          .then(res => {
            try {
              const finalResponse = transformResponse(res)
              onResponse(finalResponse)
              return finalResponse         
            } catch (e) {
              throw new Error(`Error transforming response. ${e.message}`)
            }
          })
          .catch(error => {
            let finalError = error 
            try {
              finalError = transformError(finalError)
            } catch(e) {
              throw new Error(`faasr: Could not transform error. Original error - ${e}}`)
            }
            onError(finalError)
            throw finalError
          })
      }
    }
  }
}
