import { FaasrRequest } from './index'
import lambdaMock from './mocks/lambda'

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

describe('init', () => {
  it('should test', () => {
    expect(true).toBe(true)
  })
})

describe('FaasrRequest', () => {
  it('should be defined', () => {
    expect(FaasrRequest).toBeDefined()
  })

  describe('request instance - good scenario', () => {
    it('should have a request function', () => {
      expect(goodRequest.request).toBeDefined()
    })
  })

  describe('request instance - good scenario', () => {
    const serviceRequest = goodRequest
    it('should make a request', async () => {
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
    it('should make a request', async () => {
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
