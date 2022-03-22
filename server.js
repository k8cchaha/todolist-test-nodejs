const http = require("http");
const { v4: uuidv4 } = require("uuid");
const corsHeader = require("./corsHeader");
const { errorHandle, successHandle } = require("./responseHandle");

const todos = [];

const requetListener = (req, res) => {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url === "/" && req.method === "GET") {
    successHandle(res, "<h1>This is Todolist Homepage</h1>", "html");
  } else if (req.url === "/todos" && req.method === "GET") {
    successHandle(res, todos, "json");
  } else if (req.url === "/todos" && req.method === "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          todos.push({
            title,
            id: uuidv4(),
          });
          successHandle(res, todos, "json");
        } else {
          errorHandle(res, 400, "title 屬性不存在", "json");
        }
      } catch {
        errorHandle(res, 400, "欄位, 格式未填寫正確", "json");
      }
    });
  } else if (req.url === "/todos" && req.method === "DELETE") {
    todos.length = 0;
    successHandle(res, todos, "json");
  } else if (req.url.startsWith("/todos/") && req.method === "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((item) => item.id === id);
    if (index !== -1) {
      todos.splice(index, 1);
      successHandle(res, todos, "json");
    } else {
      errorHandle(res, 400, "項目不存在", "json");
    }
  } else if (req.url.startsWith("/todos/") && req.method === "PATCH") {
    req.on("end", () => {
      try {
        const id = req.url.split("/").pop();
        const index = todos.findIndex((item) => item.id === id);
        const title = JSON.parse(body).title;
        if (title === undefined) {
          errorHandle(res, 400, "title 屬性不存在", "json");
        } else if (index === -1) {
          errorHandle(res, 400, "項目不存在", "json");
        } else {
          todos[index].title = title;
          successHandle(res, todos, "json");
        }
      } catch {
        errorHandle(res, 400, "欄位, 格式未填寫正確", "json");
      }
    });
  } else if (req.method === "OPTIONS") {
    res.writeHead(200, corsHeader);
    res.end();
  } else {
    errorHandle(res, 404, "<h1>頁面不存在</h1>", "html");
  }
};

const server = http.createServer(requetListener);
server.listen(process.env.PORT || 3456);
