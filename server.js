const express = require("express");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const ejs = require("ejs");
const date = require("./date");
const mongoose = require("mongoose");
const list = require("./model/todoModel");
const _ = require("lodash");

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

//
const todoListScheme = new mongoose.Schema({
  name: {
    type: String,
  },
});
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
const defaultItem = [itemOne, itemTwo, itemThree];
const workItems = [];

const listSchema = {
  name: String,
  items: [todoListScheme],
};

const ColList = mongoose.model("ColList", listSchema);
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
  list.find({}).then((foundItems) => {
    res.render("list", { listTitle: "Today", newListItem: foundItems });
  });
});
app.post("/", (req, res) => {
  let item = req.body.newItem;
  let listName = req.body.list;
  if (listName === "Today") {
    //
    list.insertMany(new list({ name: item }));
    res.redirect("/");
  } else {
    // NEWLY CREATED ROUTE OR EXITING ROUTE
    ColList.findOne({ name: listName }).then((foundItem) => {
      foundItem.items.push(new list({ name: item }));
      foundItem.save();
      res.redirect("/" + listName);
    });
  }
});
//
app.post("/delete", (req, res) => {
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    //
    list.findById(checkedItemID).then((item) => list.deleteOne(item));
    res.redirect("/");
  } else {
    // NEWLY CREATED ROUTE OR EXITING ROUTE
    ColList.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemID } } }
    ).then((foundItem) => {
      console.log(foundItem);
      res.redirect("/" + listName);
    });
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
//
app.get("/:customListName", (req, res) => {
  const customListTitle = _.capitalize(req.params.customListName);
  ColList.findOne({ name: customListTitle }).then((foundList) => {
    if (!foundList) {
      //create new List
      const list = new ColList({
        name: customListTitle,
        items: defaultItem,
      });
      list.save();
      res.redirect("/" + customListTitle);
    } else {
      // show existing list
      res.render("list", {
        listTitle: foundList.name,
        newListItem: foundList.items,
      });
    }
  });
});
