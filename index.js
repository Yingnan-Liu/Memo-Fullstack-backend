//nodejs使用commonjs 但是迟早会支持ES6de

const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json()); //json-parser中间件
app.use(cors()); //cors中间件

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

// 处理/发出的get请求
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});
app.get("/api/notes", (req, res) => {
  res.json(notes);
});
app.get("/api/notes/:id", (request, response) => {
  // 此处request.params.id的值是string 但是notes中id的数据类型为number 如果不转换后面find会出错
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

// 删除资源
app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

//post请求
app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      err: "content missing",
    });
  }
  const note = {
    content: body.content,
    important: body.important || false,
    data: new Date(),
    id: generateId(),
  };
  notes = notes.concat(note);
  response.json(note);
});
//现在我们使用定义在环境变量的端口，如果环境变量 PORT 是未定义的，则使用端口3002。Heroku 会在环境变量的基础上配置应用端口
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
