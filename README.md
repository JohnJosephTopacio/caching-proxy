# Caching Proxy Server
Caching Proxy Server to be built with Typescript, Express, Redis, and Docker.

## Quick Start
<!-- Brief steps on how to install and run your project -->
```bash
npm install
npm run build
npm run start -- start --port <number> --origin <string>
or
npm run start -- start -p <number> -o <string>
```

To use it as a global command:
```bash
npm link
caching-proxy start -p <number> -o <string>
```

## Dev Journal

<details open>
<summary> Log #1: Forwarding Headers and Requests </summary> 
<br>

I remember thinking to myself that building the base proxy server was going to be a piece of cake. What could be so hard about copying the client's request and forwarding it? 

### Forwarding Headers
As it turns out, it's not that simple. While implementing the header builder function, I learned about **hop-by-hopheaders**, which are headers that describe properties that are specific to a certain connection. This means that the connection between client and proxy, as well as proxy and origin may have different properties in terms of how long a connection will be open when idle, whether the body will be chunked, etc. Additionally, some other headers like content-length must be dynamically calculated, and content-encoding should be excluded to make caching more efficient down the road. Needless to say, all these headers must be excluded in the response from proxy to client. 

Another interesting tidbit I learned while working on specifically the connection header was the fact that it's forbidden in HTTP/2 and HTTP/3, which are versions used at edge servers by cloud providers and reverse proxy services. In local developmment, I've been using HTTP/1.1 which was created roughly 29 years ago.  

Previously, I thought I had a good grasp of http requests, and that it's all fairly simple. When I opened https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers, I changed my mind very fast.

### Forwarding the body 
Forwading the body was relatively much simpler. The crucial part I learned was that the Request object is a stream. To be more specific, it extends the NodeJS http.IncomingMessage, which is a stream. Which means I can use a for await to store the incoming body chunk by chunk before forwarding it to the origin.

### Commander
 **Commander** has saved me a lot of time when creating the initial skeleton for a command with two subcommands. It has it's native way of handling subcommands, and it's as easy as chaining some methods to differentiate them. This has made my code considerably shorter, as I avoided writing the tedious parsing of the different possible combinations a user can potentially provide arguments. That's just one of the many things that Commander has made more convenient. 

Furthermore, executables and shell command have always been abstracted, more like a mystery in my head before. While using Commander to set up the initial command structure for the caching-proxy, I've taken the liberty to learn more about the terminal, shell, processes, and I have learned invaluable lessons in the process. I have learned about environment variables, and that they really are just important information stored to provide better context to the process that inherits them. The PATH variable surprised me, I didn't expect that the reason commands work without full paths is because the OS literally just searches every path listed in PATH. It's suprisingly naive, but I'm sure the way-smarter people before me has a reason for that.

</details>

<details open>
<summary> Log #2: Vitest and Supertest </summary> 
<br>

###  Vitest and Supertest
Vitest is very reminiscent of frameworks like Jasmine, which I have used before, so it was a little easier to grasp initially. What stood out to me in this part is **Supertest**, and the fact that it handles server start up, port management, and server closing automatically. It saved some time and lines of code when writing the integration testing.

Making a **factory function** for creating the application has showed its worth in this part, it made setting up the testing application as easy as passing in a test origin. I didn't have to import the actual start server code or call the start command which would have added unnecessary complexity to the testing.
</details>

<details open>
<summary> Log #3: Redis, Docker, and Graceful Shutdown </summary> 
<br>

###  Redis 
I've been hearing a lot about Redis ever since I've started learning full-stack development, it's always been flagged as an advanced concept. It is a little funny to think that as of my current understanding, Redis is a glorified **RAM** that sits between system components like a server or a database. Of course, in reality it is so much more than that, and using it as a cache would save a lot of compute for the origin server not to mention API calls. I've also learned that it uses a **single-threaded event-loop driven architecture**, which is instantly made me think it is very similar if not the same as **Javascript**. The same could be said for a lot of technology, but in retrospect, its premise is really simple, but it is executed very well.

### Docker
**Docker** has once again showed its convenience when building multi-component systems. **YAML** being a superset of JSON was a fun fact I learned this time around. I also digged a little deeper on the difference between **Docker and VMs** and learned that for one, Docker only borrows the host's kernel, while VMs as we know, creates an entire separate OS. 

### Handling shutdowns gracefully
I encountered a **problem** when trying to gracefully exit with Ctrl + C in the terminal when I was testing the shutdown handler, for some reason the event listener was not calling the callback I defined even on a **signal interrupt**. It turns out, since I was using a tsx **watcher**, it was consuming the signal the handler was relying on. Upon re-building and running the program redirectly, the handler logged and functioned as expected.
</details>