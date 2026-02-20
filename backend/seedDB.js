const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://Foodie-Bar:phaphama@cluster0.acx84up.mongodb.net/testdb?retryWrites=true&w=majority';

async function seedDatabase() {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB Atlas");

        const db = mongoose.connection.db;

        const foodCategories = [
            { CategoryName: "Gourmet Burgers" },
            { CategoryName: "Artisan Pizza" },
            { CategoryName: "Vegetarian Creations" },
            { CategoryName: "Refined Salads" },
            { CategoryName: "Low Carb Plates" },
            { CategoryName: "Elegant Appetizers" },
            { CategoryName: "Chef's Signature Mains" },
            { CategoryName: "Signature Desserts" },
            { CategoryName: "Premium Beverages" }
        ];

        const foodItems = [
            // GOURMET BURGERS
            { CategoryName: "Gourmet Burgers", name: "Wagyu Beef Burger with Truffle Aioli", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop", options: { "Single": "189", "Double": "249" }, description: "Premium Wagyu beef with luxurious truffle aioli & gourmet toppings", price: 189 },
            { CategoryName: "Gourmet Burgers", name: "Angus Beef Burger with Gruyère & Caramelized Onion", img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=600&fit=crop", options: { "Regular": "169", "Large": "209" }, description: "Prime Angus beef with melted Gruyère cheese & sweet caramelized onions", price: 169 },
            { CategoryName: "Gourmet Burgers", name: "Harissa Lamb Burger with Mint Yogurt", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop", options: { "Regular": "179", "Large": "219" }, description: "Spiced lamb patty with cooling mint yogurt sauce & exotic spices", price: 179 },
            { CategoryName: "Gourmet Burgers", name: "Portobello & Halloumi Burger", img: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&h=600&fit=crop", options: { "Regular": "159", "Large": "199" }, description: "Grilled portobello mushroom with crispy halloumi cheese & fresh greens", price: 159 },

            // ARTISAN PIZZA
            { CategoryName: "Artisan Pizza", name: "Margherita with Buffalo Mozzarella", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop", options: { "Small (10\")": "99", "Large (14\")": "149" }, description: "Classic pizza with fresh buffalo mozzarella, basil & San Marzano tomatoes", price: 99 },
            { CategoryName: "Artisan Pizza", name: "Prosciutto & Rocket Pizza", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop", options: { "Small (10\")": "129", "Large (14\")": "179" }, description: "Crispy base with prosciutto, fresh rocket & shaved parmesan", price: 129 },
            { CategoryName: "Artisan Pizza", name: "Truffle Mushroom Pizza", img: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop", options: { "Small (10\")": "139", "Large (14\")": "189" }, description: "Mixed mushrooms sautéed with truffle oil, garlic & creamy ricotta", price: 139 },
            { CategoryName: "Artisan Pizza", name: "Smoked Chicken Pesto Pizza", img: "https://images.unsplash.com/photo-1627461985459-51600559fffe?w=800&h=600&fit=crop", options: { "Small (10\")": "119", "Large (14\")": "169" }, description: "Smoked chicken breast, vibrant pesto, sun-dried tomatoes & mozzarella", price: 119 },

            // VEGETARIAN CREATIONS
            { CategoryName: "Vegetarian Creations", name: "Wild Mushroom Risotto", img: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&h=600&fit=crop", options: { "Regular": "145", "Large": "175" }, description: "Creamy arborio rice with wild mushrooms, truffle oil & parmesan", price: 145 },
            { CategoryName: "Vegetarian Creations", name: "Eggplant Parmigiana", img: "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=800&h=600&fit=crop", options: { "Regular": "125", "Large": "155" }, description: "Layers of baked eggplant, tomato sauce & melted mozzarella", price: 125 },
            { CategoryName: "Vegetarian Creations", name: "Butternut & Sage Gnocchi", img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop", options: { "Regular": "135", "Large": "165" }, description: "Tender gnocchi with roasted butternut squash & crispy sage butter", price: 135 },
            { CategoryName: "Vegetarian Creations", name: "Grilled Halloumi Plate", img: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&h=600&fit=crop", options: { "Regular": "115", "Large": "145" }, description: "Grilled halloumi cheese with roasted vegetables & herb oil", price: 115 },
            { CategoryName: "Vegetarian Creations", name: "Falafel & Quinoa Bowl", img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop", options: { "Regular": "105", "Large": "135" }, description: "Crispy falafel with quinoa, hummus, tahini & fresh vegetables", price: 105 },
            { CategoryName: "Vegetarian Creations", name: "Roasted Cauliflower Steak", img: "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=800&h=600&fit=crop", options: { "Single": "125", "Double": "155" }, description: "Perfectly roasted cauliflower steak with charred edges & herb dressing", price: 125 },
            { CategoryName: "Vegetarian Creations", name: "Vegetable Stir-Fry Deluxe", img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&h=600&fit=crop", options: { "Regular": "95", "Large": "125" }, description: "Wok-tossed seasonal vegetables with ginger-garlic sauce & sesame seeds", price: 95 },

            // SIGNATURE DESSERTS
            { CategoryName: "Signature Desserts", name: "Molten Chocolate Fondant", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop", options: { "Single": "65", "With Ice Cream": "85" }, description: "Warm chocolate cake with molten center, served with vanilla ice cream", price: 65 },
            { CategoryName: "Signature Desserts", name: "New York Cheesecake", img: "https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=800&h=600&fit=crop", options: { "Slice": "55", "With Berries": "75" }, description: "Classic cheesecake with graham cracker crust & fresh berries", price: 55 },
            { CategoryName: "Signature Desserts", name: "Classic Tiramisu", img: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800&h=600&fit=crop", options: { "Single": "49", "Double": "85" }, description: "Traditional Italian dessert with mascarpone, espresso & cocoa powder", price: 49 },
            { CategoryName: "Signature Desserts", name: "Vanilla Bean Crème Brûlée", img: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&h=600&fit=crop", options: { "Single": "59", "Double": "95" }, description: "Silky vanilla custard with caramelized sugar crust & berries", price: 59 },

            // PREMIUM BEVERAGES
            { CategoryName: "Premium Beverages", name: "Mango Passion Fruit Smoothie", img: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&h=600&fit=crop", options: { "Small (350ml)": "42", "Large (500ml)": "55" }, description: "Tropical blend of fresh mango & passion fruit with Greek yogurt", price: 42 },
            { CategoryName: "Premium Beverages", name: "Artisan Cold Brew Coffee", img: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&h=600&fit=crop", options: { "Regular": "45", "Large": "59" }, description: "Smooth cold brew coffee with rich flavor & minimal acidity", price: 45 },
            { CategoryName: "Premium Beverages", name: "Salted Caramel Milkshake", img: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&h=600&fit=crop", options: { "Regular": "49", "Large": "65" }, description: "Creamy milkshake with salted caramel sauce & whipped cream", price: 49 },
            { CategoryName: "Premium Beverages", name: "Fresh Citrus Mint Cooler", img: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&h=600&fit=crop", options: { "Small": "39", "Large": "55" }, description: "Blend of citrus fruits with fresh mint & sparkling water", price: 39 },

            // REFINED SALADS
            { CategoryName: "Refined Salads", name: "Burrata & Heirloom Tomato Salad", img: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=800&h=600&fit=crop", options: { "Regular": "125", "Large": "155" }, description: "Creamy burrata cheese with colorful heirloom tomatoes & basil oil", price: 125 },
            { CategoryName: "Refined Salads", name: "Grilled Chicken Caesar", img: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop", options: { "Regular": "115", "Large": "145" }, description: "Grilled chicken breast with romaine, parmesan & creamy Caesar dressing", price: 115 },
            { CategoryName: "Refined Salads", name: "Quinoa & Pomegranate Salad", img: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&h=600&fit=crop", options: { "Regular": "105", "Large": "135" }, description: "Protein-rich quinoa with pomegranate seeds, walnuts & mint dressing", price: 105 },

            // LOW CARB PLATES
            { CategoryName: "Low Carb Plates", name: "Grilled Ribeye with Asparagus", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop", options: { "250g": "199", "350g": "259" }, description: "Prime ribeye steak, perfectly grilled with fresh asparagus & herb butter", price: 199 },
            { CategoryName: "Low Carb Plates", name: "Lemon Herb Chicken & Greens", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop", options: { "Regular": "135", "Large": "165" }, description: "Herb-marinated grilled chicken with fresh mixed greens & lemon dressing", price: 135 },
            { CategoryName: "Low Carb Plates", name: "Pan-Seared Salmon with Spinach", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop", options: { "Fillet": "175", "Double Fillet": "225" }, description: "Fresh Atlantic salmon, pan-seared with creamy spinach & lemon butter", price: 175 },

            // ELEGANT APPETIZERS
            { CategoryName: "Elegant Appetizers", name: "Tempura Prawns", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop", options: { "6 Pieces": "89", "10 Pieces": "135" }, description: "Light & crispy battered prawns served with sweet chili sauce", price: 89 },
            { CategoryName: "Elegant Appetizers", name: "Crispy Calamari", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&h=600&fit=crop", options: { "Regular": "85", "Large": "115" }, description: "Golden fried squid rings with lemon & served with tartar sauce", price: 85 },
            { CategoryName: "Elegant Appetizers", name: "Baked Camembert with Honey", img: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=800&h=600&fit=crop", options: { "Individual": "79", "Sharing": "125" }, description: "Warm baked camembert cheese with honey drizzle & crusty bread", price: 79 },
            { CategoryName: "Elegant Appetizers", name: "Beef Carpaccio", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop", options: { "Regular": "95", "Premium": "135" }, description: "Thin slices of raw beef with olive oil, lemon, capers & parmesan shavings", price: 95 },

            // CHEF'S SIGNATURE MAINS
            { CategoryName: "Chef's Signature Mains", name: "Slow-Braised Beef Short Ribs", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop", options: { "Regular": "229", "Large": "279" }, description: "Tender beef ribs braised in red wine with vegetables & rich jus", price: 229 },
            { CategoryName: "Chef's Signature Mains", name: "Seafood Linguine", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop", options: { "Regular": "185", "Large": "225" }, description: "Fresh pasta with prawns, calamari & mussels in light garlic white wine sauce", price: 185 },
            { CategoryName: "Chef's Signature Mains", name: "Peri-Peri Chicken Supreme", img: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop", options: { "Half": "155", "Whole": "225" }, description: "Spiced chicken marinated in African peri-peri with grilled vegetables", price: 155 },
            { CategoryName: "Chef's Signature Mains", name: "Butter Chicken & Basmati Rice", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&h=600&fit=crop", options: { "Regular": "145", "Large": "175" }, description: "Tender chicken in creamy tomato-butter sauce served with fragrant basmati", price: 145 },
            { CategoryName: "Chef's Signature Mains", name: "Pan-Seared Duck Breast", img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop", options: { "Single": "209", "Double": "319" }, description: "Succulent duck breast with crispy skin, cherry reduction & root vegetables", price: 209 },
            { CategoryName: "Chef's Signature Mains", name: "Lamb Shank with Mash", img: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=800&h=600&fit=crop", options: { "Single": "189", "Double": "329" }, description: "Slow-cooked lamb shank until tender with creamy mashed potatoes & gravy", price: 189 },
            { CategoryName: "Chef's Signature Mains", name: "Chicken Alfredo Tagliatelle", img: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800&h=600&fit=crop", options: { "Regular": "155", "Large": "195" }, description: "Tender chicken with fresh pasta in creamy parmesan sauce & black pepper", price: 155 },
            { CategoryName: "Chef's Signature Mains", name: "Lobster Mac & Cheese", img: "https://images.unsplash.com/photo-1634141510639-d691d86f47be?w=800&h=600&fit=crop", options: { "Regular": "195", "Large": "249" }, description: "Succulent lobster meat tossed with creamy cheese sauce & pasta", price: 195 },
            { CategoryName: "Chef's Signature Mains", name: "Fillet Mignon with Red Wine Jus", img: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&h=600&fit=crop", options: { "200g": "249", "300g": "349" }, description: "Premium tender beef fillet with rich red wine reduction & roasted vegetables", price: 249 },
            { CategoryName: "Chef's Signature Mains", name: "Gourmet Club Sandwich", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&h=600&fit=crop", options: { "Regular": "125", "Deluxe": "155" }, description: "Triple-layered with turkey, bacon, avocado, swiss cheese & fresh vegetables", price: 125 },
            { CategoryName: "Chef's Signature Mains", name: "Eggs Benedict (Brunch Special)", img: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=800&h=600&fit=crop", options: { "With Ham": "135", "With Smoked Salmon": "165" }, description: "Poached eggs, English muffin & hollandaise sauce with your choice of protein", price: 135 },
            { CategoryName: "Chef's Signature Mains", name: "Chocolate Brownie with Vanilla Ice Cream", img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop", options: { "Regular": "55", "Premium": "75" }, description: "Warm fudgy brownie served with premium vanilla ice cream & chocolate sauce", price: 55 }
        ];

        const itemDataCol = db.collection("itemData");
        const foodCategoryCol = db.collection("foodCategory");
        
        await itemDataCol.deleteMany({});
        await foodCategoryCol.deleteMany({});
        console.log("🗑️  Cleared existing data");

        const categoryResult = await foodCategoryCol.insertMany(foodCategories);
        console.log(`✅ Inserted ${categoryResult.insertedCount} food categories`);

        const itemResult = await itemDataCol.insertMany(foodItems);
        console.log(`✅ Inserted ${itemResult.insertedCount} food items`);

        console.log("\n📊 Database Summary:");
        console.log(`   Categories: ${categoryResult.insertedCount}`);
        console.log(`   Items: ${itemResult.insertedCount}`);

        console.log("\n✅ Database seeding complete!");
        await mongoose.connection.close();
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

seedDatabase();
