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
    { item: true }, 
    function callService(params) { 
      return lambdaMock(params).invoke() 
    }
  )

  describe('request instance', () => {
    it('should have a request function', () => {
      expect(aRequest.request).toBeDefined()
    })

    it('should have a request function', () => {
      expect(aRequest.request).toBeDefined()
    })
  })

})
