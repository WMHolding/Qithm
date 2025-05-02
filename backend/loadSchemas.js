const mongoose = require("mongoose");

const User = require("./models/User");
const Challenge = require("./models/Challenge");
const Championship = require("./models/Championship");
const PrivateChat = require("./models/PrivateChat");

mongoose.connect("mongodb://localhost:27017/database");
