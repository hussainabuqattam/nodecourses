const { information } = require("./data");
const { Datauser } = require("./modules/Data");
const connectdb = require("./config/db");
const dotenv = require("dotenv").config();
connectdb();

// import data using seeding database

const importInformation = async () => {
  try {
    await Datauser.insertMany(information);
    console.log("information imported");
  } catch (error) {
    console.log(error);
  }
};

// delet all information in datatbase

const deletedata = async () => {
  try {
    await Datauser.deleteMany();
    console.log("information deleted");
  } catch (error) {
    console.log(error);
  }
};

// run function

// the argv is > node[0] > seeder [1] > -import[2] or -deleted[2]
if (process.argv[2] === "-import") {
  importInformation();
} else if (process.argv[2] === "-deleted") {
  deletedata();
}
