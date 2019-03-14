/**
 * Base service configuration and request handling
 */
import { Lambda } from 'aws-sdk'

export class FaasrRequest {
  transformRequest(params) { return params }
  transformResponse(response) { return response }
  transformError(error) { return error }
  callService
  response
  params
  error
  startTime
  endTime

  constructor(callService, params = {}) {
    this.callService = callService
    this.params = params
  }

  getResponse () {
    return this.response
  }

  getError () {
    return this.error
  }

  setEndTime() {
    this.endTime = new Date()
  }

  setError(error) {
    this.error = this.transformError(error)
  }

  setResponse(response) {
    this.response = this.transformResponse(response)
  }

  handleResponse(response) {
    this.setEndTime()
    this.setResponse(response)

    return this.getResponse()
  }
  
  handleError(error) {
    try {
      this.setEndTime()
      this.setError(error)
    } catch(e) {
      throw e
    }

    return this.getError()
  }

  request() {
    this.startTime = new Date()
    return this.callService()
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }
}

/*
class FaasrEndpoint {
  constructor(serviceName, { transformRequest }) {
  
  }

  request() {
    return new FaasrRequest()
  }
}

function faasrEnvironment({ 
  transformRequest = (req) => req, 
  transformResponse = (req) => req, 
  transformError = (req) => req, 
  transformServiceName = (req) => req, 
} = {
  transformRequest , 
  transformResponse, 
  transformError, 
  transformServiceName 
}) {
  return (serviceName) => new FaasrEndpoint(serviceName, { 
    transformRequest,
    transformResponse,
    transformError, 
    transformServiceName 
  })
}

export default faasrEnvironment()
 */
