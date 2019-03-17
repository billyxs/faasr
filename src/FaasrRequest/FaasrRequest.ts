import { Lambda } from 'aws-sdk'
/**
 * Base service configuration and request handling
 */
export default class FaasrRequest {
  static getTime() { 
    return (new Date()).getTime()
  }

  transformRequest(params) { return params }
  transformResponse(response) { return response }
  transformError(error) { return error }

  response
  params = {}
  error
  startTime
  endTime

  constructor(params = {}, { 
    transformRequest = (req) => req, 
    transformResponse = (response) => response, 
    transformError = (error) => error, 
  } = {}) {
    this.params = params
  }

  callService(params) {
    return Promise.resolve(params)
  }

  getResponse () {
    return this.response
  }

  getError () {
    return this.error
  }

  setStartTime() {
    this.startTime = FaasrRequest.getTime() 
  }

  setEndTime() {
    this.endTime = FaasrRequest.getTime() 
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
    if (this.startTime) {
      throw new Error('FaasrRequest: Request has already run.')
    }
    
    this.setStartTime()
    return this.callService({})
      .then(this.handleResponse.bind(this))
      .catch(this.handleError.bind(this))
  }
}

