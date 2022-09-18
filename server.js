//**DEPENDENCIES**
const express = require("express");
const app = express();
const port = 3000
const budget = require("./models/budget.js");
//**DEPENDENCIES**

//**ROUTES**
app.use((req, res, next) => {
  console.log("I run for all routes")
  next()
});

app.use(express.urlencoded({ extended: false }))

app.get("/budgets", (req, res) => {
  res.render("index.ejs", {
    allBudgets: budget
  });
});

app.get("/budgets/new", (req,res) =>{
  res.render("new.ejs")
});

app.post("/budgets", (req, res)=>{
budget.push(req.body)
res.redirect("/budgets")
});

app.get("/budgets/:index", (req, res)=>{
  res.render("show.ejs", {
    budgets: budgets[req.params.index]
  });
});

app.get("/", (req, res) =>{
  res.send("Welcome to the Budgtr App!");
});

app.listen(port, () =>{
  console.log("express is listening")
})