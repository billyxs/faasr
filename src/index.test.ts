import faasr from './index'

describe('faasr', () => {
  it('should be defined', () => {
    expect(faasr).toBeDefined()
  })
})

describe('faasr environment', () => {
  const faasrInstance = faasr({
    service: {},
    defaultParams: {}
  })

  it('should return an instance', () => {
    expect(faasrInstance).toBeDefined()
  })

  const faasrEndpoint = faasrInstance('service-name')
  
  describe('faasr endpoint', () => {
    it('should return an object', () => {
      expect(faasrEndpoint).toBeDefined()
    })

    it('should have a request function', () => {
      expect(faasrEndpoint.request).toBeDefined()
    })
  })
})
