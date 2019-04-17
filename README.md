# faasr

Function as a Service Request - Lambda request management 

## Getting Started

```js
import faasr from 'faasr'

// setup your faasr instance with the service type
const myFaasr = faasr({
  service: { 
    type: 'lambda', 
    region: 'us-west-2' 
  }
})

// set the function name you want to use 
const getThings = myFaasr('get-things')

// pass the payload and get the response
getThings.request({ id: 1 })
  .then(response => console.log(response))
  .catch(error => console.log(error))

```

## Configuration

The `faasr` environment 

```js
faasr({

  // faas service to use
  service: {
    type: 'lambda',
    region: 'us-west-2'
  }, 

  // default request params for all requests
  defaultParams: {
    LogType: 'Tail',
  },

  transformRequest(requestParams) {
    return {
      ...requestParams,
      Payload: JSON.stringify(requestParams.Payload)
    }
  },

  // transformation of all successful responses
  transformResponse() {}

  // transformation of all errors resulting
  transformResponse() {}
})
```

## Faas Services 

Lambda is the only supported service at this time. When configuring your service object, include the settings you would need to create a new lambda instance.

```js
faasr({
  service: {
    region: 'us-east-1'
  }
})

```

## transformRequest(requestParams)

You may want to normalize and adjust all the request params that flow through your application's service requests. This can be done through the `transformRequst` option when building your `faasr` environment.

*Example*

Replacing a function's name based on the environment it is called in, and setting the LogType to `Tail`.

```js
import faasr from 'faasr'

const myFaasr = faasr({
  service: { 
    type: 'lambda', 
    region: 'us-west-2' 
  },
  transformRequest(requestParams) {
    return {
      ...requestParams,
      FunctionName: requestParams.FunctionName.replace('{ENV}', 'prod'),
      Payload: JSON.stringify(requestParams.Payload)
    }
  },
})

```

## transformResponse(response, requestParams)

You may want to normalize and adjust all the responses that flow through your application's service requests. This can be done through the `transformResponse` option when building your `faasr` environment. The parameters that were sent for the request are provided as a second argument if to help tailor the result. 

If you throw an error within the `transformResponse`, the faasr request will register the error and you will end up with an error result. 

*Example*

Add additional data for certain status codes

```js
import faasr from 'faasr'

const myFaasr = faasr({
  service: { 
    type: 'lambda', 
    region: 'us-west-2' 
  },
  transformResponse(response, requestParams) {
    if (response.status === 418) {
      response.teapot = true
    }

    return response 
  },
})

```

