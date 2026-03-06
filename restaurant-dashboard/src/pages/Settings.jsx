export default function Settings() {
  const saveSettings = (event) => {
    event.preventDefault();
    window.alert("Settings saved successfully.");
  };

  return (
    <>
      <header className="page-header">
        <div>
          <p className="eyebrow">Owner</p>
          <h1>Operational Settings</h1>
        </div>
      </header>

      <form className="card form" onSubmit={saveSettings}>
        <label>
          Restaurant Name
          <input type="text" defaultValue="RestoFlow Downtown" />
        </label>
        <label>
          Time Zone
          <select defaultValue="America/New_York">
            <option value="America/New_York">America/New_York</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Africa/Johannesburg">Africa/Johannesburg</option>
          </select>
        </label>
        <label>
          Auto-close orders after (minutes)
          <input type="number" min="5" max="180" defaultValue="30" />
        </label>
        <label>
          Alert Email
          <input type="email" defaultValue="owner@restaurant.com" />
        </label>
        <button type="submit" className="primary">Save Changes</button>
      </form>
    </>
  );
}
