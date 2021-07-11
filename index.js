//nodejs使用commonjs 但是迟早会支持ES6de
require("dotenv").config();
const express = require("express");
const app = express();
const Note = require("./models/note");
const cors = require("cors");

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

// 处理/发出的get请求
app.get("/", (request, response) => {
  response.send("<h1>Hello World! !</h1>");
  console.log("here here");
  console.log(PORT);
  console.log(process.env);
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response) => {
  // 此处request.params.id的值是string 但是notes中id的数据类型为number 如果不转换后面find会出错
  // const id = Number(request.params.id);
  // const note = notes.find((note) => note.id === id);
  // if (note) {
  //   response.json(note);
  // } else {
  //   response.status(404).end();
  // }
  //mongoose的findById方法
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
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
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });
  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
