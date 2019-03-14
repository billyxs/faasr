import FaasrRequest from './FaasrRequest'
import lambdaMock from '../mocks/lambda'

const goodRequest = new FaasrRequest(
  function callService(params) { 
    return lambdaMock(params).invoke().promise()
  },
  { item: true }, 
)
const badRequest = new FaasrRequest(
  function callService(params) { 
    return lambdaMock(params).invoke().error()
  },
  { item: true }, 
)

describe('FaasrRequest', () => {
  it('should be defined', () => {
    expect(FaasrRequest).toBeDefined()
  })
  it('should have a getTime() method', () => {
    expect(FaasrRequest.getTime).toBeDefined()
    expect(FaasrRequest.getTime()).toBeGreaterThan(0)
  })
})

describe('FaasrRequest - instances', () => {
  describe('request instance', () => {
    it('should have a request function', () => {
      expect(goodRequest.request).toBeDefined()
    })
    it('should initialize with default values', () => {
      expect(goodRequest.params).toEqual({ item: true })
      expect(goodRequest.startTime).toBeUndefined()
      expect(goodRequest.endTime).toBeUndefined()
    })
  })

  describe('request instance - good scenario', () => {
    const serviceRequest = goodRequest
    it('should handle good request', async () => {
      expect.assertions(5)
      await serviceRequest.request()

      expect(serviceRequest.response).toBe(true)
      expect(serviceRequest.error).toBeUndefined()

      expect(serviceRequest.startTime).toBeDefined()
      expect(serviceRequest.endTime).toBeDefined()
      expect(serviceRequest.endTime).toBeGreaterThan(serviceRequest.startTime)
    })
  })

  describe('request instance - error scenario', () => {
    const serviceRequest = badRequest 
    it('should handle bad request', async () => {
      expect.assertions(5)
      await serviceRequest.request()

      expect(serviceRequest.response).toBeUndefined()
      expect(serviceRequest.error).toBe(true)

      expect(serviceRequest.startTime).toBeDefined()
      expect(serviceRequest.endTime).toBeDefined()
      expect(serviceRequest.endTime).toBeGreaterThan(serviceRequest.startTime)
    })
  })
})
