import { Lambda } from 'aws-sdk'

// interfaces
interface ServiceConfig {
  type: string,
  [propName: string]: any, 
}

interface FaasrEnvironmentParams {
  service: ServiceConfig,
  defaultParams: object
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

function responseHandler({ params, transform, listener, responseType = 'normal' }) {
  return (res:any) => {
    let finalResponse 

    // handle transform
    try {
      finalResponse = transform(res, params)
    } catch (e) {
      throw new Error(`Error with transform ${transform}. ${e.message}. ${JSON.stringify(e)}`)
    }

    // handle listener
    try {
      listener(finalResponse, params)
    } catch(e) {
      // do nothing
    }

    // throw error response type
    if (responseType === 'error') {
      throw finalResponse
    }

    return finalResponse         
  }
}

/*
 * faasr environment 
 */
export default function faasrEnvironment({
  service,
  defaultParams,

  // transforms
  transformRequest = (params) => params,
  transformResponse = (res, params) => res,
  transformError= (error) => error,

  // hooks 
  onRequest = (params) => params,
  onResponse = (res, params) => res,
  onError = (error) => error,
}) {

  const serviceRequest = getService(service)

  /*
   * faasr endpoint
   */
  return function faasrEndpoint(serviceName:string, params:object = {}) {
    return {
      request(RequestPayload = {}, callService = serviceRequest) {

        // event params
        const requestParams = transformRequest({ 
          ...defaultParams, 
          ...params,

          // priority
          FunctionName: serviceName,
          Payload: RequestPayload,
        })

        // service request chain 
        return callService(requestParams)
          .then(responseHandler({ 
            params: requestParams, 
            transform: transformResponse, 
            listener: onResponse,
          }))
          .catch(responseHandler({ 
            params: requestParams, 
            transform: transformError, 
            listener: onError,
            responseType: 'error'
          }))
      }
    }
  }
}
