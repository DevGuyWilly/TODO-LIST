const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const ejs = require("ejs");
const date = require("./date");

dotenv.config({ path: "./config.env" });
const app = express();
const port = process.env.port || 3000;

//Render external files like the style.css
app.use(express.static("public"));

let items = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];
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
  res.render("list", { listTitle: day, newListItem: items });
});
app.post("/", (req, res) => {
  let item = req.body.newItem;
  console.log(req.body);
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
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
