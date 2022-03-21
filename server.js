const http = require("http");
const { v4: uuidv4 } = require("uuid");
const errorHandle = require("./errorHandle");

const todos = [];

const requetListener = (req, res) => {
  const htmlHeaders = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "text/html",
  };
  const jsonHeaders = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, htmlHeaders);
    res.write("<h1>This is Todolist Homepage</h1>");
    res.end();
  } else if (req.url === "/todos" && req.method === "GET") {
    res.writeHead(200, jsonHeaders);
    res.write(JSON.stringify({ status: "success", data: todos }));
    res.end();
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          todos.push({
            title,
            id: uuidv4(),
          });
          res.writeHead(200, jsonHeaders);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch {
        errorHandle(res);
      }
    });
  } else if (req.url === "/todos" && req.method === "DELETE") {
    todos.length = 0;
    res.writeHead(200, jsonHeaders);
    res.write(
      JSON.stringify({
        status: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((item) => item.id === id);

    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, jsonHeaders);
      res.write(
        JSON.stringify({
          status: "success",
          data: todos,
        })
      );
      res.end();
    } else {
      errorHandle(res);
    }
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const id = req.url.split("/").pop();
        const index = todos.findIndex((item) => item.id === id);
        const title = JSON.parse(body).title;
        if (title !== undefined && index !== -1) {
          todos[index].title = title;
          res.writeHead(200, jsonHeaders);
          res.write(
            JSON.stringify({
              status: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          errorHandle(res);
        }
      } catch {
        errorHandle(res);
      }
    });
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, htmlHeaders);
    res.end();
  } else {
    res.writeHead(404, htmlHeaders);
    res.write("<h1>404 Not Found</h1>");
    res.end();
  }
};

const server = http.createServer(requetListener);
server.listen(process.env.PORT || 3456);
