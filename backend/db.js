const mongoose = require('mongoose');
mongoose.set('strictQuery', true);

// Connection string to your MongoDB Atlas cluster
const mongoURI = 'mongodb+srv://Foodie-Bar:phaphama@cluster0.acx84up.mongodb.net/testdb?retryWrites=true&w=majority';


// Function to connect to MongoDB and execute callbacks
const mongoDB = async (callback) => {
    try {
        // Connect to the MongoDB database
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Successfully connected to MongoDB!");

        // Fetch data from the "itemData" collection
        const foodCollection = mongoose.connection.db.collection("itemData");
        const data = await foodCollection.find({}).toArray();

        // Fetch data from the "foodCategory" collection
        const categoryCollection = mongoose.connection.db.collection("foodCategory");
        const catdata = await categoryCollection.find({}).toArray();

        // Invoke the callback with fetched data
        callback(null, data, catdata);

    } catch (err) {
        console.error("Error connecting to MongoDB or fetching data:", err);
        callback(err);
    }
};

// Export the mongoDB function
module.exports = mongoDB;