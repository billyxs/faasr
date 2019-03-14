/**
 * Base service configuration and request handling
 */
import { Lambda } from 'aws-sdk'

export class FaasrRequest {
  transformRequest(response) { return response }
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

  handleResponse(response) {
    this.endTime = new Date()
    this.response = response
  }
  
  handleError(error) {
    this.endTime = new Date()
    this.error = error
  }

  request() {
    this.startTime = new Date()
    return this.callService()
      .then(this.handleResponse)
      .catch(this.handleError)
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
