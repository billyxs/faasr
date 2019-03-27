import { lambdaService } from './FaasrRequest'

function faasrEnvironment({ 
  service = { type: 'lambda', region: null },

  transformRequest = (req) => req, 
  transformResponse = (response) => response, 
  transformError = (error) => error, 

  defaultParams = {},
} = {}) {
  if (!service.region) {
    throw new Error('faasr: service region not specified.')
  }

  if (service.type === 'lambda' && service.region) {
    return lambdaService(service, defaultParams = {})
  }
}

export default faasrEnvironment()
