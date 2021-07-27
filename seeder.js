const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config/config.env' });

const Product = require('./models/Product');
const User = require('./models/User');


// Connect to Db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});


const products = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/products.json`,`utf-8`)
);
const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`,`utf-8`)
);


// Import into DB
const importData = async() => {
    try{
        await Product.create(products);
        await User.create(users);        

        console.log('Data imported...');
        process.exit();
    }catch(err){
        console.log(err);
    }
}

// Delete the data
const deleteData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data destroyed...");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}