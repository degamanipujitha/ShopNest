function AdminDashboard({ onLogout }) {
  return (
    <div className="admin-dashboard">

      <div className="admin-header">
        <div>
          <h1>🛍️ ShopNest</h1>
          <p>Admin Dashboard</p>
        </div>

        <button onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="admin-welcome">
        <h2>Welcome, Admin 👋</h2>
        <p>Manage your ShopNest website from here.</p>
      </div>

      <div className="admin-cards">

        <div className="admin-card">
          <div className="admin-icon">🛍️</div>
          <h3>Total Products</h3>
          <h2>6</h2>
        </div>

        <div className="admin-card">
          <div className="admin-icon">👥</div>
          <h3>Total Users</h3>
          <h2>0</h2>
        </div>

        <div className="admin-card">
          <div className="admin-icon">🛒</div>
          <h3>Total Orders</h3>
          <h2>0</h2>
        </div>

        <div className="admin-card">
          <div className="admin-icon">❤️</div>
          <h3>Wishlist</h3>
          <h2>0</h2>
        </div>

      </div>

      <div className="admin-products">

        <h2>📦 Product Management</h2>

        <div className="admin-actions">

          <button
            onClick={() =>
              alert("Add Product feature coming next! ➕")
            }
          >
            ➕ Add Product
          </button>

          <button
            onClick={() =>
              alert("Edit Product feature coming next! ✏️")
            }
          >
            ✏️ Edit Product
          </button>

          <button
            onClick={() =>
              alert("Delete Product feature coming next! 🗑️")
            }
          >
            🗑️ Delete Product
          </button>

        </div>

      </div>

      <div className="admin-product-list">

        <h2>🛍️ Current Products</h2>

        <div className="admin-product">
          <span>👕 Fashion T-Shirt</span>
          <span>₹499</span>
        </div>

        <div className="admin-product">
          <span>🎧 Wireless Headphones</span>
          <span>₹999</span>
        </div>

        <div className="admin-product">
          <span>⌚ Smart Watch</span>
          <span>₹1499</span>
        </div>

        <div className="admin-product">
          <span>👟 Running Shoes</span>
          <span>₹1299</span>
        </div>

        <div className="admin-product">
          <span>🎒 Backpack</span>
          <span>₹799</span>
        </div>

        <div className="admin-product">
          <span>🕶️ Sunglasses</span>
          <span>₹599</span>
        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;