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

<details>
<summary> Log #1: Forwarding Headers and Requests </summary> 
<b>Date</b>: September 21, 2026  
<br><br>

I remember thinking to myself that building the base proxy server was going to be a piece of cake. What could be so hard about copying the client's request and forwarding it? 

### Forwarding Headers
As it turns out, it's not that simple. While implementing the header builder function, I learned about **hop-by-hopheaders**, which are headers that describe properties that are specific to a certain connection. This means that the connection between client and proxy, as well as proxy and origin may have different properties in terms of how long a connection will be open when idle, whether the body will be chunked, etc. Additionally, some other headers like content-length must be dynamically calculated, and content-encoding should be excluded to make caching more efficient down the road. Needless to say, all these headers must be excluded in the response from proxy to client. 

Another interesting tidbit I learned while working on specifically the connection header was the fact that it's forbidden in HTTP/2 and HTTP/3, which are versions used at edge servers by cloud providers and reverse proxy services. In local developmment, I've been using HTTP/1.1 which was created roughly 29 years ago.  

Previously, I thought I had a good grasp of http requests, and that it's all fairly simple. When I opened https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers, I changed my mind very fast.

### Forwarding the body 
Forwading the body was relatively much simpler. The crucial part I learned was that the Request object is a stream. To be more specific, it extends the NodeJS http.IncomingMessage, which is a stream. Which means I can use a for await to store the incoming body chunk by chunk before forwarding it to the origin.

### Commander and Vitest
These should be their own entry, but as I started the journal late I will just include it here. Commander has saved me a lot of time when creating the initial skeleton for a command with two subcommands. It has it's native way of handling subcommands, and it's as easy as chaining some methods to differentiate them. This has made my code considerably shorter, as I avoided writing the tedious parsing of the different possible combinations a user can potentially provide arguments. That's just one of the many things that Commander has made more convenient. 

Furthermore, executables and shell command have always been abstracted, more like a mystery in my head before. While using Commander to set up the initial command structure for the caching-proxy, I've taken the liberty to learn more about the terminal, shell, processes, and I have learned invaluable lessons in the process. I have learned about environment variables, and that they really are just important information stored to provide better context to the process that inherits them. The PATH variable surprised me, I didn't expect that the reason commands work without full paths is because the OS literally just searches every path listed in PATH. It's suprisingly naive, but I'm sure the way-smarter people before me has a reason for that.
