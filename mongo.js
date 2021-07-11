const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://Memo-fullstack:${password}@cluster0.6znta.mongodb.net/note-app?retryWrites=true&w=majority`;
// const url = `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});
//schema  模式
const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
});
const Note = mongoose.model("Note", noteSchema);

//使用note module创建一个新的note对象 模型是所谓的构造函数constructor function
const note = new Note({
  content: "HTML is Easy",
  date: new Date(),
  important: true,
});

//从数据库中获取代码
Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

//将对象保存到数据库
// note.save().then((result) => {
//   console.log("note saved!");
//   //关闭数据库  如果连接没有关闭，程序将永远不能完成它的执行。
//   mongoose.connection.close();
// });
