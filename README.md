Micro (u)Services
==

Overview
--

Provides a portable way of defining service interfaces that supports actions (a la the actor model), asynchronous functions (via promises), and asynchronous sequences (via observables).

Supports creation of a service interface (or spec) from a TypeScript interface, although the actual spec is just a JSON format.

Once a spec has been defined, remote proxies of the services can be deployed using one of the various libraries listed below

Usage
--

Install:
```
npm install uservice
```

Basic Usage:

```TypeScript
import * as uservice from 'uservice'
import * as tss from 'typescript-schema'

let schema = tss.generateSchema({
  'myServiceModule.ts': fs.readFileSync('myServiceModule.ts')
})
let moduleSchema = schema['myServiceModule.ts']

let spec = uservice.generateSpec(moduleSchema, moduleSchema.interfaces['MyServiceInterface'])

let methods = uservice.splitService(spec, myService)

// Methods with a void return type
console.log(methods.actions)

// Methods with a Promise<T> return type
console.log(methods.functions)

// Methods with an uservice.Observable<T> return type
console.log(methods.events)

```

Note, that the ```uservice.Observable<T>``` interface is compatable with the [rx IObservable](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/observable.md) interface

Remote Proxy libraries
--

Various libraries exist for making the services deployable as remote proxies. Some of them are listed below:

 - [Socket.io on the server](www.github.com/christyharagan/uservice-socket.io-server)
 - [Socket.io on the client](www.github.com/christyharagan/uservice-socket.io-server)
 - [Marklogic database](www.github.com/christyharagan/uservice-marklogic)
