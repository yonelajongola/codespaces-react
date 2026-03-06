import { useMemo, useState, useEffect } from "react";

const zarFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR"
});

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ name: "", category: "Main", price: "" });

  useEffect(() => {
    // Fetch menu items from backend
    fetch("http://localhost:3000/api/foodData", {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then(([itemData, categoryData]) => {
        // Transform backend data to frontend format
        const transformedItems = itemData.map((item, index) => ({
          id: item._id || `item-${index}`,
          name: item.name,
          category: item.CategoryName,
          price: item.price,
          available: true,
          description: item.description,
          img: item.img,
          options: item.options
        }));
        setItems(transformedItems);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch menu items:", error);
        // Fallback data if API fails
        setItems([
          { id: 1, name: "Truffle Pasta", category: "Main", price: 18, available: true },
          { id: 2, name: "Citrus Salmon", category: "Main", price: 22, available: true },
          { id: 3, name: "Garden Bowl", category: "Vegan", price: 14, available: false },
          { id: 4, name: "Chocolate Tart", category: "Dessert", price: 9, available: true }
        ]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return items;
    }
    return items.filter((item) => item.name.toLowerCase().includes(term));
  }, [items, query]);

  const addItem = (event) => {
    event.preventDefault();
    if (!form.name || !form.price) {
      return;
    }
    setItems((prev) => [
      {
        id: Date.now(),
        name: form.name,
        category: form.category,
        price: Number(form.price),
        available: true
      },
      ...prev
    ]);
    setForm({ name: "", category: "Main", price: "" });
  };

  const toggleAvailability = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, available: !item.available } : item))
    );
  };

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Owner</p>
          <h1>Menu Management</h1>
        </div>
        <div className="chip">
          {loading ? "Loading..." : `${items.length} Items`}
        </div>
      </header>

      <section className="grid two">
        <div className="card">
          <h3>Menu Catalog</h3>
          <div className="form" style={{ marginTop: "0.75rem" }}>
            <label>
              Search dishes
              <input
                type="text"
                value={query}
                placeholder="Search by dish name"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
          <ul className="list">
            {filtered.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <p className="muted">
                    {item.category} · {zarFormatter.format(item.price)}
                    {item.description && ` · ${item.description.substring(0, 50)}...`}
                  </p>
                </div>
                <button className="ghost" onClick={() => toggleAvailability(item.id)}>
                  {item.available ? "Available" : "Hidden"}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <form className="card form" onSubmit={addItem}>
          <h3>Add New Dish</h3>
          <label>
            Dish name
            <input
              type="text"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="e.g. Smoky BBQ Wings"
            />
          </label>
          <label>
            Category
            <select
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            >
              <option>Main</option>
              <option>Appetizer</option>
              <option>Dessert</option>
              <option>Vegan</option>
              <option>Beverage</option>
            </select>
          </label>
          <label>
            Price
            <input
              type="number"
              min="1"
              step="0.01"
              value={form.price}
              onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="12.00"
            />
          </label>
          <button type="submit" className="primary">Add Item</button>
        </form>
      </section>
    </>
  );
}
