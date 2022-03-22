const corsHeader = require("./corsHeader");

const combineHeader = (contentType) => {
  const contentTypeHeader =
    contentType === "json"
      ? "application/json"
      : contentType === "html"
      ? "text/html"
      : "text/plain";
  return Object.assign({}, corsHeader, {
    "Content-Type": contentTypeHeader,
  });
};

const errorHandle = (res, statusCode, errMsg, contentType) => {
  const header = combineHeader(contentType);
  res.writeHead(statusCode, header);
  const resData =
    contentType === "json"
      ? JSON.stringify({ status: "false", message: errMsg })
      : errMsg;
  res.write(resData);
  res.end();
};

const successHandle = (res, data, contentType) => {
  const header = combineHeader(contentType);
  res.writeHead(200, header);
  const resData =
    contentType === "json" ? JSON.stringify({ status: "success", data }) : data;
  res.write(resData);
  res.end();
};

module.exports = {
  errorHandle,
  successHandle,
};
