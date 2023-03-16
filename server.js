const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const ejs = require("ejs");
const date = require("./date");
const mongoose = require("mongoose");
const list = require("./model/todoModel");

dotenv.config({ path: "./config.env" });

const app = express();
const port = process.env.port || 3000;

//Render external files like the style.css
app.use(express.static("public"));

// LOCAL
mongoose
  .connect("mongodb://localhost:27017/todoListDB", {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Succesful"));

// creating a new document
const itemOne = new list({
  name: "Buy Food",
});
const itemTwo = new list({
  name: "Code",
});
const itemThree = new list({
  name: "Sleep",
});
const defaultItem = [];
const workItems = [];
console.log(list.find());
// defaultItem.push(new list({ name: item }));
//
app.set("view engine", "ejs");
//
app.use(bodyparser.urlencoded({ extended: true }));
//
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
app.get("/", (req, res) => {
  let day = date();

  res.render("list", { listTitle: day, newListItem: defaultItem });
});
app.post("/", (req, res) => {
  let item = req.body.newItem;
  if (req.body.list === "Work") {
    // insert data in the DB
    // workItems.push(item);
    list.insertMany(new list({ name: item }));
    defaultItem.push(new list({ name: item }));
    res.redirect("/work");
  } else {
    // insert data in the DB
    // defaultItem.push(item);
    list.insertMany(new list({ name: item }));
    console.log(defaultItem);
    res.redirect("/");
  }
});
//
app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItem: workItems });
});
app.post("/work", (req, res) => {
  res.redirect("/work");
});
//
app.get("/about", (req, res) => {
  res.render("about");
});
