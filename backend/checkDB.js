const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://Foodie-Bar:phaphama@cluster0.acx84up.mongodb.net/testdb?retryWrites=true&w=majority';

async function checkDatabase() {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB Atlas");

        const db = mongoose.connection.db;
        
        // Get all collections
        const collections = await db.listCollections().toArray();
        console.log("\n📚 Collections in database:");
        console.log(JSON.stringify(collections, null, 2));

        if (collections.length > 0) {
            // Check each collection for documents
            for (const collection of collections) {
                const collName = collection.name;
                const col = db.collection(collName);
                const count = await col.countDocuments();
                const sample = await col.findOne();
                
                console.log(`\n📖 Collection: ${collName}`);
                console.log(`   Documents: ${count}`);
                console.log(`   Sample: ${JSON.stringify(sample, null, 2)}`);
            }
        } else {
            console.log("   No collections found!");
        }

        await mongoose.connection.close();
        console.log("\n✅ Connection closed");
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

checkDatabase();
