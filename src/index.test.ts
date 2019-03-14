import { FaasrRequest } from './index'
import lambdaMock from './mocks/lambda'

describe('init', () => {
  it('should test', () => {
    expect(true).toBe(true)
  })
})

describe('FaasrRequest', () => {
  it('should be defined', () => {
    expect(FaasrRequest).toBeDefined()
  })

  const aRequest = new FaasrRequest(
    function callService(params) { 
      return lambdaMock(params).invoke().promise()
    },
    { item: true }, 
  )

  describe('request instance', () => {
    it('should have a request function', () => {
      expect(aRequest.request).toBeDefined()
    })

    it('should have a request function', () => {
      expect(aRequest.request).toBeDefined()
    })

    it('should make a request', async () => {
      expect.assertions(4)
      await aRequest.request()
      expect(aRequest.response).toBe(true)
      expect(aRequest.startTime).toBeDefined()
      expect(aRequest.endTime).toBeDefined()
      expect(aRequest.error).toBeUndefined()
    })
  })

})
