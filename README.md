# faasr

Function as a Service Request 

```
npm install faasr
```

_AWS Lambda support only currently_


## Getting Started

```js
import faasr from 'faasr'

// setup your faasr instance with your lambda service params
const myFaasr = faasr({
  service: { 
    region: 'us-west-2' 
  }
})

// set the function name you want to use 
const getThings = myFaasr('get-things', { InvocationType: 'Event' })

// pass the payload and get the response
getThings.request({ id: 1 })
  .then(response => console.log(response))
  .catch(error => console.log(error))

```

## Faasr Request lifecycle

Given a full configuration, this is the lifecycle of a Faasr request.

- Merge default request params with function override params
- Transform the request params
- Invoke the request to the service
- If error successful
  - Transform the response
  - If error is thrown in the transform, the request results in an error 
    - Transform the error
- If result is an error
  - Transform the error

```js
const myService = faasr({
  service: { region: 'us-east-1' },

  defaultParams: { LogType: 'Tail }

  transformRequest(requestParams) {
    return {
      ...requestParams,
      Payload: JSON.stringify(requestParams.Payload)
    }
  },

  transformResponse(response, requestParams) {
    return {
      ...requestParams,
      Payload: JSON.stringify(requestParams.Payload)
    }
  },

  transformError(error, requestParams) {
    throw new Error(``)
  },
})

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

## Default parameters

All your service requests can begin with a standard set of default parameters by setting the `defaultParams` configuration.

*Example*

Changing the log type for all the requests in your application. 

```js
faasr({
  service: {
    region: 'us-east-1'
  },
  defaultParams: {
    LogType: 'Tail'
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

You may want to normalize and adjust all the responses that flow through your application's service requests. This can be done through the `transformResponse` option when building your `faasr` environment. The parameters that were sent for the request are provided as a second argument to help tailor the result. 

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

## transformError(error, requestParams)

You may want to normalize and adjust all the errors that flow through your application's service requests. This can be done through the `transformError` option when building your `faasr` environment. The parameters that were sent for the request are provided as a second argument to help tailor the error. 

*Example*

Add additional data for certain status codes

```js
import faasr from 'faasr'

const myFaasr = faasr({
  service: { 
    type: 'lambda', 
    region: 'us-west-2' 
  },
  transformError(error, requestParams) {
    if (error.status === 418) {
      response.teapot = true
    }

    return  
  },
})

```

# Creating requests - faasrEndpoint(functionName, overrideParams)

After setting up your environment configuration as outlined, you are ready to create your service calls. Creating a service call is as easy as providing the function name of the request you are making.

```js
// faasr environment
const myFaasr =  faasr({ ... })

// your endpoint - a reusable func
const myFunction = myFaasr('your-function-name')
```

Once you have your function setup, you can make request to your function and pass in a payload to accompany the request. For lambda, this will serve as the `Payload` parameter of the request. This request returns a promise by which you can handle the success or error that results.
```js
// your request 
myFunction.request({ id: 1 })
  .then(res => { 
     // do something with response 
   })
  .catch(error => { 
    // do something with error 
  })
```

You can create as many requests as needed with your faasr function instance.

```js
const allRequests = [
  myFunction({ id: 1 }),
  myFunction({ id: 2 }),
  myFunction({ id: 3 }),
]

Promise.all(allRequests)
  .then((response) => {
     const [ 
       response1, 
       response2, 
       response3 
     ] = response
  })
