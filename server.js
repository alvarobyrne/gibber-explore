const http = require("http"),
  StaticServer = require("node-static").Server,
  production = process.env.PRODUCTION != null;
let port = process.env.SERVER_PORT || 9080;
port = 3001;

const staticServer = new StaticServer(".", {
  cache: production ? 3600 : false,
  gzip: production,
});

const server = http.createServer((request, response) => {
  request
    .addListener("end", () => {
      staticServer.serve(request, response);
    })
    .resume();
});

server.listen(port);
console.log("port: ", `http://localhost:${port}`);
