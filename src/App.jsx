import { useState, useEffect } from "react";
import "./App.css";
import Chatbot from "./Chatbot";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";

function App() {
  const [page, setPage] = useState("login");

  // Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Products
  const [products, setProducts] = useState([]);

useEffect(() => {
  fetch("http://127.0.0.1:5000/api/products")
    .then((response) => response.json())
    .then((data) => {
      setProducts(data);
    })
    .catch((error) => {
      console.error("Failed to load products:", error);
    });
}, []);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Logged-in user & Orders
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Exchange
  const [exchangeOrderId, setExchangeOrderId] = useState(null);
  const [exchangeReason, setExchangeReason] = useState("");

  // Wishlist
  const [wishlist, setWishlist] = useState([]);

  // Ratings & Reviews
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  // Checkout
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Load My Orders
  const loadOrders = async (userId) => {
    try {
      setOrdersLoading(true);

      const response = await fetch(
        `http://127.0.0.1:5000/api/orders/${userId}`
      );

      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Orders error:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Login
  const loginUser = async () => {
    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login successful! 🎉");

        setCurrentUser(data.user);
        await loadOrders(data.user.id);

        setLoginEmail("");
        setLoginPassword("");

        setPage("home");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert(
        "Server connection failed. Please start backend."
      );
    }
  };

  // Signup
  const signupUser = async () => {
    if (
      !signupName ||
      !signupEmail ||
      !signupPassword
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: signupName,
            email: signupEmail,
            password: signupPassword
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          "Account created successfully! 🎉"
        );

        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");

        setPage("login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert(
        "Server connection failed. Please start backend."
      );
    }
  };

  // Add to cart
  const addToCart = (product) => {
    setCart([...cart, product]);

    alert(
      `${product.name} added to cart 🛒`
    );
  };

  // Add to Wishlist
  const addToWishlist = (product) => {
    const alreadyAdded = wishlist.some(
      (item) => item.id === product.id
    );

    if (alreadyAdded) {
      alert("Already in Wishlist ❤️");
      return;
    }

    setWishlist((previousWishlist) => [
      ...previousWishlist,
      product
    ]);

    alert(`${product.name} added to Wishlist ❤️`);
  };

  // Remove from Wishlist
  const removeFromWishlist = (id) => {
    setWishlist((previousWishlist) =>
      previousWishlist.filter((item) => item.id !== id)
    );
  };

  // Remove from cart
  const removeFromCart = (index) => {
    const newCart = [...cart];

    newCart.splice(index, 1);

    setCart(newCart);
  };

  // Total
  const total = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  // Place order
  const placeOrder = async () => {
    if (!currentUser) {
      alert("Please login first");
      setPage("login");
      return;
    }

    if (!customerName || !customerAddress || !customerPhone) {
      alert("Please fill all delivery details");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: currentUser.id,
            customerName,
            customerAddress,
            customerPhone,
            total,
            items: cart
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Order placement failed");
        return;
      }

      setCart([]);
      setCustomerName("");
      setCustomerAddress("");
      setCustomerPhone("");

      await loadOrders(currentUser.id);

      alert(`Order placed successfully! Order ID: ${data.orderId}`);
      setPage("success");
    } catch (error) {
      console.error("Order error:", error);
      alert("Server connection failed. Please start backend.");
    }
  };

  // Filter products
  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        product.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  // Go to Products
  const goToProducts = () => {
    setPage("home");

    setTimeout(() => {
      document
        .getElementById("products")
        ?.scrollIntoView({
          behavior: "smooth"
        });
    }, 100);
  };

  // =========================
  // CANCEL ORDER
  // =========================

  const cancelOrder = async (orderId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/orders/${orderId}/cancel`,
        {
          method: "PUT"
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Order cancelled successfully! ❌");
        await loadOrders(currentUser.id);
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      alert("Server connection failed");
    }
  };

  // =========================
  // EXCHANGE ORDER
  // =========================

  const exchangeOrder = async (orderId) => {
    if (!exchangeReason) {
      alert("Please select a reason for exchange");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/orders/${orderId}/exchange`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            reason: exchangeReason
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Exchange request submitted successfully! 🔄");

        setExchangeOrderId(null);
        setExchangeReason("");

        await loadOrders(currentUser.id);
      } else {
        alert(data.message || "Failed to request exchange");
      }
    } catch (error) {
      console.error("Exchange order error:", error);
      alert("Server connection failed");
    }
  };

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      {page !== "login" &&
        page !== "signup" &&
        page !== "success" &&
        page !== "adminLogin" &&
        page !== "admin" && (

          <nav className="navbar">

            <div
              className="logo"
              onClick={() =>
                setPage("home")
              }
            >
              🛍️ ShopNest
            </div>

            <div className="nav-links">

              <button
                onClick={() =>
                  setPage("home")
                }
              >
                Home
              </button>

              <button
                onClick={goToProducts}
              >
                Products
              </button>

              <button
                onClick={() =>
                  setPage("cart")
                }
              >
                Cart 🛒 ({cart.length})
              </button>

              <button
                onClick={() =>
                  setPage("wishlist")
                }
              >
                Wishlist ❤️ ({wishlist.length})
              </button>

              <button
                onClick={() => {
                  if (!currentUser) {
                    alert("Please login first");
                    setPage("login");
                    return;
                  }
                  loadOrders(currentUser.id);
                  setPage("orders");
                }}
              >
                My Orders 📦 ({orders.length})
              </button>

              <button onClick={() => setPage("adminLogin")}>
                Admin 🔐
              </button>

              <button
                onClick={() => {
                  setCurrentUser(null);
                  setOrders([]);
                  setCart([]);
                  setPage("login");
                }}
              >
                Logout
              </button>

            </div>

          </nav>
        )}

      {/* ================= LOGIN ================= */}

      {page === "login" && (

        <section className="login-section">

          <div className="login-box">

            <h1>🛍️ ShopNest</h1>

            <h2>🔐 Login</h2>

            <p>
              Welcome back to ShopNest!
            </p>

            <input
              type="email"
              placeholder="Enter your email"
              value={loginEmail}
              onChange={(e) =>
                setLoginEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) =>
                setLoginPassword(e.target.value)
              }
            />

            <button
              className="main-button"
              onClick={loginUser}
            >
              Login
            </button>

            <p className="signup-text">
              Don't have an account?
            </p>

            <button
              className="signup-link"
              onClick={() =>
                setPage("signup")
              }
            >
              Sign Up
            </button>

          </div>

        </section>
      )}

      {/* ================= SIGNUP ================= */}

      {page === "signup" && (

        <section className="login-section">

          <div className="login-box">

            <h1>🛍️ ShopNest</h1>

            <h2>
              📝 Create Account
            </h2>

            <p>
              Join ShopNest today!
            </p>

            <input
              type="text"
              placeholder="Enter your name"
              value={signupName}
              onChange={(e) =>
                setSignupName(e.target.value)
              }
            />

            <input
              type="email"
              placeholder="Enter your email"
              value={signupEmail}
              onChange={(e) =>
                setSignupEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Create password"
              value={signupPassword}
              onChange={(e) =>
                setSignupPassword(e.target.value)
              }
            />

            <button
              className="main-button"
              onClick={signupUser}
            >
              Create Account
            </button>

            <p className="signup-text">
              Already have an account?
            </p>

            <button
              className="signup-link"
              onClick={() =>
                setPage("login")
              }
            >
              Login
            </button>

          </div>

        </section>
      )}

      {/* ================= HOME ================= */}

      {/* ================= HOME ================= */}

{page === "home" && (
  <>
    {/* HERO */}
    <section className="home-hero">

      <div className="hero-left">

        <div className="welcome-pill">
          💗 Welcome to ShopNest
        </div>

        <h1>
          Find It. Love It.
          <br />
          <span>Shop It. ♡</span>
        </h1>

        <p>
          Your one-stop destination for the best
          <br />
          products, latest trends and amazing deals!
        </p>

        <div className="hero-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="What are you looking for?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={goToProducts}>
            →
          </button>
        </div>

      </div>


      {/* HERO RIGHT SIDE */}

      <div className="hero-right">

        <div className="floating-item headphone">
          🎧
        </div>

        <div className="floating-item watch">
          ⌚
        </div>

        <div className="floating-item shoe">
          👟
        </div>

        <div className="floating-item glasses">
          🕶️
        </div>

        <div className="shop-bag">
          <div className="bag-handle"></div>
          <div className="bag-text">
            ShopNest
            <br />
            ♡
          </div>
        </div>

        <div className="gift gift-one">
          🎁
        </div>

        <div className="gift gift-two">
          🎁
        </div>

        <div className="small-bag">
          👜
        </div>

        <div className="hero-good">
          Good Things
          <br />
          Shop Here
          <br />
          ♡
        </div>

      </div>

    </section>


    {/* ================= CATEGORY ================= */}

    <section className="home-category">

      <div className="section-heading">

        <div>
          <h2>Shop by Category</h2>
          <p>Explore your favourite categories</p>
        </div>

        <button onClick={goToProducts}>
          View All →
        </button>

      </div>


      <div className="category-grid">

        <div
          className="category-card fashion-card"
          onClick={() => {
            setCategory("Fashion");
            goToProducts();
          }}
        >
          <div className="category-image">
            👚
          </div>

          <div className="category-name">
            Fashion
            <span>→</span>
          </div>
        </div>


        <div
          className="category-card electronics-card"
          onClick={() => {
            setCategory("Electronics");
            goToProducts();
          }}
        >
          <div className="category-image">
            🎧
          </div>

          <div className="category-name">
            Electronics
            <span>→</span>
          </div>
        </div>


        <div
          className="category-card shoes-card"
          onClick={() => {
            setCategory("Shoes");
            goToProducts();
          }}
        >
          <div className="category-image">
            👟
          </div>

          <div className="category-name">
            Shoes
            <span>→</span>
          </div>
        </div>


        <div
          className="category-card accessories-card"
          onClick={() => {
            setCategory("Accessories");
            goToProducts();
          }}
        >
          <div className="category-image">
            🎒
          </div>

          <div className="category-name">
            Accessories
            <span>→</span>
          </div>
        </div>

      </div>

    </section>


    {/* ================= TRENDING PRODUCTS ================= */}

    <section
      className="trending-section"
      id="products"
    >

      <div className="section-heading">

        <div>
          <h2>🔥 Trending Products</h2>
          <p>Loved by many, chosen for you!</p>
        </div>

        <button onClick={goToProducts}>
          View All →
        </button>

      </div>


      <div className="trending-grid">

        {filteredProducts.slice(0, 6).map((product, index) => (

          <div
          
  
  className="trend-card"
  key={product.id}
  onClick={() => {
    setSelectedProduct(product);
    setPage("details");
  }}
>

          

            <div className="trend-image">

              <button
                className="heart-btn"
                onClick={() => addToWishlist(product)}
              >
                ♡
              </button>

              <img
  src={product.image}
  alt={product.name}
  className="product-image"
/>

            </div>


            <div className="rating">
              ⭐ {(4.3 + index * 0.1).toFixed(1)}
            </div>

            <h3>
              {product.name}
            </h3>

            <p className="trend-category">
              {product.category}
            </p>

            <div className="trend-price">
              ₹{product.price}
            </div>

            <div className="trend-actions">

              <button
                onClick={() => addToCart(product)}
              >
                🛒 Add to Cart
              </button>
<button
  onClick={(e) => {
    e.stopPropagation();
    addToCart(product);
    setPage("cart");
  }}
>
  ⚡ Buy Now
</button>
              <button
                onClick={() => addToWishlist(product)}
                className="wishlist-small"
              >
                ♡
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>


    {/* ================= HAPPY DEALS ================= */}

    <section className="happy-deals">

      <div className="deal-gift">
        🎁
      </div>

      <div className="deal-text">
        <h2>Today's Happy Deals!</h2>
        <p>
          Shop your favourites at amazing prices →
        </p>
      </div>

      <div className="discount">
        Up to
        <br />
        <strong>50% OFF</strong>
      </div>

    </section>


    {/* ================= WHY SHOPNEST ================= */}

    <section className="why-shopnest">

      <div className="why-heading">
        <h2>💗 Why You'll Love ShopNest</h2>

        <p>
          More than just shopping — it's a better way to shop!
        </p>
      </div>


      <div className="why-grid">

        <div className="why-item">
          <div className="why-icon">🚚</div>

          <div>
            <h3>Fast Delivery</h3>
            <p>Get your orders quickly</p>
          </div>
        </div>


        <div className="why-item">
          <div className="why-icon pink">
            🛡️
          </div>

          <div>
            <h3>Safe Shopping</h3>
            <p>Your data is safe with us</p>
          </div>
        </div>


        <div className="why-item">
          <div className="why-icon green">
            📦
          </div>

          <div>
            <h3>Easy Returns</h3>
            <p>Hassle-free returns</p>
          </div>
        </div>


        <div className="why-item">
          <div className="why-icon orange">
            🎧
          </div>

          <div>
            <h3>Friendly Support</h3>
            <p>We're here to help</p>
          </div>
        </div>

      </div>

    </section>

  </>
)}
      {/* ================= PRODUCT DETAILS ================= */}

      {page === "details" &&
        selectedProduct && (

          <section className="details-section">

            <div className="details-card">

             <div className="big-emoji">
  {selectedProduct.emoji}
</div>

              <h1>
                {selectedProduct.name}
              </h1>

              <h2>
                ₹{selectedProduct.price}
              </h2>

              <p>
                {selectedProduct.description}
              </p>

              <p>
                Category:{" "}
                {selectedProduct.category}
              </p>

              {/* ================= RATINGS & REVIEWS ================= */}
              <div className="reviews-section">

                <h2>⭐ Product Rating & Reviews</h2>

                <div className="rating-box">
                  <label>Rating: </label>

                  <select
                    value={rating}
                    onChange={(e) =>
                      setRating(Number(e.target.value))
                    }
                  >
                    <option value="5">⭐⭐⭐⭐⭐</option>
                    <option value="4">⭐⭐⭐⭐</option>
                    <option value="3">⭐⭐⭐</option>
                    <option value="2">⭐⭐</option>
                    <option value="1">⭐</option>
                  </select>
                </div>

                <textarea
                  placeholder="Write your review..."
                  value={reviewText}
                  onChange={(e) =>
                    setReviewText(e.target.value)
                  }
                />

                <button
                  onClick={() => {
                    if (!reviewText.trim()) {
                      alert("Please write a review");
                      return;
                    }

                    setReviews((previousReviews) => [
                      ...previousReviews,
                      {
                        productId: selectedProduct.id,
                        rating: rating,
                        text: reviewText.trim()
                      }
                    ]);

                    setReviewText("");
                    setRating(5);

                    alert("Review added successfully! ⭐");
                  }}
                >
                  Submit Review
                </button>

                <div className="review-list">
                  {reviews
                    .filter(
                      (review) =>
                        review.productId === selectedProduct.id
                    )
                    .map((review, index) => (
                      <div
                        className="review-item"
                        key={index}
                      >
                        <p>
                          {"⭐".repeat(review.rating)}
                        </p>

                        <p>{review.text}</p>
                      </div>
                    ))}
                </div>

              </div>

              <button
                onClick={() =>
                  addToWishlist(selectedProduct)
                }
              >
                Add to Wishlist ❤️
              </button>

              <button
                onClick={() =>
                  addToCart(
                    selectedProduct
                  )
                }
              >
                <button
  onClick={() => {
    addToCart(selectedProduct);
    setPage("cart");
  }}
>
  Buy Now ⚡
</button>
                Add to Cart 🛒
              </button>

              <button
                onClick={() =>
                  setPage("home")
                }
              >
                Back to Products
              </button>

            </div>

          </section>
        )}

      {/* ================= WISHLIST ================= */}

      {page === "wishlist" && (
        <section className="cart-section">

          <h1>❤️ Your Wishlist</h1>

          {wishlist.length === 0 ? (
            <div className="empty-cart">

              <h2>
                Your Wishlist is empty 😔
              </h2>

              <button onClick={goToProducts}>
                Continue Shopping
              </button>

            </div>
          ) : (
            <>
              <div className="cart-items">

                {wishlist.map((item) => (
                  <div
                    className="cart-item"
                    key={item.id}
                  >

                    <span>
                      {item.emoji} {item.name}
                    </span>

                    <span>
                      ₹{item.price}
                    </span>

                    <button
                      onClick={() =>
                        addToCart(item)
                      }
                    >
                      Add to Cart 🛒
                    </button>

                    <button
                      onClick={() =>
                        removeFromWishlist(item.id)
                      }
                    >
                      Remove ❤️
                    </button>

                  </div>
                ))}

              </div>
            </>
          )}

        </section>
      )}

      {/* ================= MY ORDERS ================= */}

      {page === "orders" && (
  <section className="cart-section">

    <h1>📦 My Orders</h1>

    {!currentUser ? (

      <div className="empty-cart">
        <h2>Please login to view your orders</h2>

        <button onClick={() => setPage("login")}>
          Login
        </button>
      </div>

    ) : ordersLoading ? (

      <div className="empty-cart">
        <h2>Loading your orders...</h2>
      </div>

    ) : orders.length === 0 ? (

      <div className="empty-cart">
        <h2>No orders yet 😔</h2>

        <button onClick={goToProducts}>
          Start Shopping
        </button>
      </div>

    ) : (

      <div className="cart-items">

        {orders.map((order) => (

          <div className="cart-item" key={order.id}>

            {/* ORDER DETAILS */}
            <div>

              <h3>Order #{order.id}</h3>

              <p>
                Status: <strong>{order.status}</strong>
              </p>

              <p>
                Date:{" "}
                {new Date(order.created_at).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                })}
              </p>


              {/* PRODUCTS */}
              <div className="order-products">

                {order.items.map((item) => {

                  const product = products.find(
                    (p) => p.id === item.id
                  );

                  const image =
                    item.image || product?.image;

                  return (
                    <div
                      className="order-product"
                      key={item.id}
                    >

                      <img
                        src={image}
                        alt={item.name}
                        className="order-product-image"
                      />

                      <div>

                        <h4>{item.name}</h4>

                        <p>
                          ₹{item.price}
                        </p>

                        <p>
                          Quantity: {item.quantity || 1}
                        </p>

                      </div>

                    </div>
                  );

                })}

              </div>


              <p>
                Items: {order.items.length}
              </p>

              <p>
                Total: ₹{order.total}
              </p>

            </div>


            {/* =========================
                CANCEL & EXCHANGE
            ========================= */}

            <div className="order-actions">

              {order.status !== "Delivered" &&
               order.status !== "Cancelled" &&
               order.status !== "Exchange Requested" && (
                <button
                  className="cancel-order-btn"
                  onClick={() => cancelOrder(order.id)}
                >
                  ❌ Cancel Order
                </button>
              )}

              {order.status !== "Cancelled" &&
               order.status !== "Exchange Requested" && (
                <button
                  className="exchange-order-btn"
                  onClick={() => {
                    setExchangeOrderId(order.id);
                    setExchangeReason("");
                  }}
                >
                  🔄 Exchange Order
                </button>
              )}

            </div>

            {/* =========================
                EXCHANGE REASON
            ========================= */}

            {exchangeOrderId === order.id && (
              <div className="exchange-reason-box">

                <h3>🔄 Why do you want to exchange?</h3>

                <label>
                  <input
                    type="radio"
                    name={`exchangeReason-${order.id}`}
                    value="Size issue"
                    checked={exchangeReason === "Size issue"}
                    onChange={(e) =>
                      setExchangeReason(e.target.value)
                    }
                  />
                  Size issue
                </label>

                <label>
                  <input
                    type="radio"
                    name={`exchangeReason-${order.id}`}
                    value="Damaged"
                    checked={exchangeReason === "Damaged"}
                    onChange={(e) =>
                      setExchangeReason(e.target.value)
                    }
                  />
                  Damaged
                </label>

                <label>
                  <input
                    type="radio"
                    name={`exchangeReason-${order.id}`}
                    value="Wrong product"
                    checked={exchangeReason === "Wrong product"}
                    onChange={(e) =>
                      setExchangeReason(e.target.value)
                    }
                  />
                  Wrong product
                </label>

                <label>
                  <input
                    type="radio"
                    name={`exchangeReason-${order.id}`}
                    value="Other"
                    checked={exchangeReason === "Other"}
                    onChange={(e) =>
                      setExchangeReason(e.target.value)
                    }
                  />
                  Other
                </label>

                <div className="exchange-reason-actions">

                  <button
                    className="confirm-exchange-btn"
                    onClick={() => exchangeOrder(order.id)}
                  >
                    Confirm Exchange
                  </button>

                  <button
                    className="cancel-exchange-btn"
                    onClick={() => {
                      setExchangeOrderId(null);
                      setExchangeReason("");
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </div>
            )}



            {/* ORDER TRACKING */}
            <div className="order-tracking">

              <h3>🚚 Order Tracking</h3>

              {(() => {

                const trackingSteps = [
                  {
                    name: "Placed",
                    emoji: "📦"
                  },
                  {
                    name: "Confirmed",
                    emoji: "✅"
                  },
                  {
                    name: "Shipped",
                    emoji: "🚚"
                  },
                  {
                    name: "Out for Delivery",
                    emoji: "🛵"
                  },
                  {
                    name: "Delivered",
                    emoji: "🎉"
                  }
                ];


                const statusIndex =
                  trackingSteps.findIndex(
                    (step) =>
                      step.name.toLowerCase() ===
                      String(
                        order.status || "Placed"
                      ).toLowerCase()
                  );


                const currentStep =
                  statusIndex >= 0
                    ? statusIndex
                    : 0;


                return (
                  <div className="tracking-container">

                    <div className="tracking-line"></div>


                    <div className="tracking-steps">

                      {trackingSteps.map(
                        (step, index) => (

                          <div
                            className={`tracking-step ${
                              index <= currentStep
                                ? "completed"
                                : ""
                            }`}
                            key={step.name}
                          >

                            <div className="tracking-icon">

                              {index <= currentStep
                                ? step.emoji
                                : "○"}

                            </div>

                            <p>
                              {step.name}
                            </p>

                          </div>

                        )
                      )}

                    </div>


                    <p className="tracking-current">

                      Current Status:{" "}

                      <strong>
                        {order.status || "Placed"}
                      </strong>

                    </p>

                  </div>
                );

              })()}

            </div>

          </div>

        ))}

      </div>

    )}

  </section>
)}

      {/* ================= CART ================= */}

      {page === "cart" && (

        <section className="cart-section">

          <h1>🛒 Your Cart</h1>

          {cart.length === 0 ? (

            <div className="empty-cart">

              <h2>
                Your cart is empty 😔
              </h2>

              <button
                onClick={goToProducts}
              >
                Continue Shopping
              </button>

            </div>

          ) : (

            <>

              <div className="cart-items">

                {cart.map(
                  (item, index) => (

                    <div
                      className="cart-item"
                      key={index}
                    >

                      <span>
                        {item.emoji}{" "}
                        {item.name}
                      </span>

                      <span>
                        ₹{item.price}
                      </span>

                      <button
                        onClick={() =>
                          removeFromCart(
                            index
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>

                  )
                )}

              </div>

              <h2 className="cart-total">
                Total: ₹{total}
              </h2>

              <button
                className="checkout-button"
                onClick={() =>
                  setPage("checkout")
                }
              >
                Proceed to Checkout
              </button>

            </>
          )}

        </section>
      )}

      {/* ================= CHECKOUT ================= */}

      {page === "checkout" && (

        <section className="checkout-section">

          <div className="checkout-box">

            <h1>📦 Checkout</h1>

            <h3>
              Total Amount: ₹{total}
            </h3>

            <input
              type="text"
              placeholder="Full Name"
              value={customerName}
              onChange={(e) =>
                setCustomerName(
                  e.target.value
                )
              }
            />

            <textarea
              placeholder="Delivery Address"
              value={customerAddress}
              onChange={(e) =>
                setCustomerAddress(
                  e.target.value
                )
              }
            />

            <input
              type="tel"
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) =>
                setCustomerPhone(
                  e.target.value
                )
              }
            />

            <button
  onClick={() => setPage("payment")}
>
  Continue to Payment
</button>
            <button
              onClick={() =>
                setPage("cart")
              }
            >
              Back to Cart
            </button>

          </div>

        </section>
      )}
            {/* ================= PAYMENT ================= */}

      {page === "payment" && (
        <section className="payment-section">
          <div className="payment-card">

            <h1>💳 Payment</h1>

            <h2>Total: ₹{total}</h2>

            <p>Select your payment method</p>

            <button
  className={paymentMethod === "UPI" ? "payment-selected" : ""}
  onClick={() => setPaymentMethod("UPI")}
>
  📱 UPI
</button>

            <button
              onClick={() => setPaymentMethod("CARD")}
            >
              💳 Card
            </button>

            <button
              onClick={() => setPaymentMethod("COD")}
            >
              💵 Cash on Delivery
            </button>

            {paymentMethod === "UPI" && (
              <div>
                <h3>UPI Payment</h3>
                <input
                  type="text"
                  placeholder="Enter UPI ID"
                />
              </div>
            )}

            {paymentMethod === "CARD" && (
              <div>
                <h3>Card Payment</h3>

                <input
                  type="text"
                  placeholder="Card Number"
                />

                <input
                  type="text"
                  placeholder="Card Holder Name"
                />

                <input
                  type="text"
                  placeholder="MM/YY"
                />

                <input
                  type="password"
                  placeholder="CVV"
                />
              </div>
            )}

            {paymentMethod === "COD" && (
              <div>
                <h3>Cash on Delivery</h3>
                <p>Pay when your order is delivered.</p>
              </div>
            )}

            <button
              disabled={!paymentMethod}
              onClick={placeOrder}
            >
              {paymentMethod === "COD"
                ? "Place Order"
                : `Pay ₹${total}`}
            </button>

            <button
              onClick={() => setPage("checkout")}
            >
              ← Back to Checkout
            </button>

          </div>
        </section>
      )}

      {/* ================= SUCCESS ================= */}

      {page === "success" && (

        <section className="success-section">

          <div className="success-box">

            <h1>🎉</h1>

            <h2>
              Order Placed Successfully!
            </h2>

            <p>
              Thank you for shopping
              with ShopNest.
            </p>

            <button
              onClick={goToProducts}
            >
              Continue Shopping
            </button>

          </div>

        </section>
      )}

      {/* ================= ADMIN LOGIN ================= */}

      {page === "adminLogin" && (
        <AdminLogin
          onLogin={() => setPage("admin")}
        />
      )}

      {/* ================= ADMIN DASHBOARD ================= */}

      {page === "admin" && (
        <AdminDashboard
          onLogout={() => setPage("home")}
        />
      )}

      {/* ================= FOOTER ================= */}

      {page !== "login" &&
        page !== "signup" && (

          <footer>
            ©️ 2026 ShopNest.
            All rights reserved.
          </footer>

        )}

      {/* ================= CHATBOT ================= */}
<Chatbot
  currentUser={currentUser}
  products={products}
  cart={cart}
  orders={orders}
/>

    </div>
  );
}

export default App;