import { useState } from "react";
import "./App.css";

function Chatbot({
  currentUser,
  products = [],
  cart = [],
  orders = []
}) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const [messages, setMessages] = useState([
    {
      type: "bot",
      text:
        "Hi! 👋 Welcome to ShopNest!\n\n" +
        "I can help you with products, prices, cart, wishlist, orders, delivery, checkout, returns and more.\n\n" +
        "You can ask me in English or Telugu."
    }
  ]);

  // =====================================================
  // PRODUCT DATA
  // =====================================================

  const shopProducts =
    products.length > 0
      ? products
      : [
          {
            name: "Fashion T-Shirt",
            price: 499,
            category: "Fashion"
          },
          {
            name: "Wireless Headphones",
            price: 999,
            category: "Electronics"
          },
          {
            name: "Smart Watch",
            price: 1499,
            category: "Electronics"
          },
          {
            name: "Running Shoes",
            price: 1299,
            category: "Shoes"
          },
          {
            name: "Backpack",
            price: 799,
            category: "Accessories"
          },
          {
            name: "Sunglasses",
            price: 599,
            category: "Accessories"
          }
        ];

  // =====================================================
  // GET PRODUCT
  // =====================================================

  const findProduct = (text) => {
    return shopProducts.find((product) => {
      const name = (product.name || "").toLowerCase();

      const words = name.split(" ");

      return (
        text.includes(name) ||
        words.some(
          (word) =>
            word.length > 3 &&
            text.includes(word)
        )
      );
    });
  };

  // =====================================================
  // BOT REPLY
  // =====================================================

  const getReply = (message) => {
    const text = message.toLowerCase().trim();

    // ===================================================
    // GREETING
    // ===================================================

    if (
      text === "hi" ||
      text === "hello" ||
      text === "hey" ||
      text === "hlo" ||
      text.includes("hello shopnest")
    ) {
      return (
        "Hello! 😊\n\n" +
        "Welcome to ShopNest!\n" +
        "How can I help you today?"
      );
    }

    // ===================================================
    // HELP
    // ===================================================

    if (
      text.includes("help") ||
      text.includes("what can you do") ||
      text.includes("how can you help") ||
      text.includes("emi cheyagalavu") ||
      text.includes("em cheyagalavu")
    ) {
      return (
        "🤖 I can help you with:\n\n" +
        "🛍️ Products\n" +
        "💰 Prices\n" +
        "🔎 Product search\n" +
        "🛒 Cart\n" +
        "❤️ Wishlist\n" +
        "📦 Orders\n" +
        "🚚 Delivery\n" +
        "💳 Checkout\n" +
        "❌ Cancel order\n" +
        "🔄 Exchange order\n" +
        "👤 Account\n" +
        "🏪 ShopNest information\n\n" +
        "You can ask me in English or Telugu."
      );
    }

    // ===================================================
    // SHOPNEST INFORMATION
    // ===================================================

    if (
      text.includes("what is shopnest") ||
      text.includes("about shopnest") ||
      text.includes("shopnest ante enti") ||
      text.includes("shopnest gurinchi")
    ) {
      return (
        "🛍️ ShopNest is an online shopping website.\n\n" +
        "You can:\n" +
        "• Browse products\n" +
        "• Search products\n" +
        "• Add products to cart\n" +
        "• Add products to wishlist\n" +
        "• Place orders\n" +
        "• Track your orders\n" +
        "• Cancel eligible orders\n" +
        "• Request exchanges"
      );
    }

    // ===================================================
    // SHOW ALL PRODUCTS
    // ===================================================

    if (
      text.includes("show products") ||
      text.includes("all products") ||
      text.includes("list products") ||
      text.includes("available products") ||
      text === "products" ||
      text.includes("products chupinchu") ||
      text.includes("products em unnayi")
    ) {
      return (
        "🛍️ ShopNest Products:\n\n" +
        shopProducts
          .map(
            (product, index) =>
              `${index + 1}. ${product.name} - ₹${product.price}`
          )
          .join("\n")
      );
    }

    // ===================================================
    // PRODUCT COUNT
    // ===================================================

    if (
      text.includes("how many products") ||
      text.includes("enni products") ||
      text.includes("how many items")
    ) {
      return `🛍️ ShopNest currently has ${shopProducts.length} products available.`;
    }

    // ===================================================
    // SPECIFIC PRODUCT
    // ===================================================

    const foundProduct = findProduct(text);

    if (foundProduct) {
      const name = foundProduct.name;
      const price = foundProduct.price;
      const category = foundProduct.category;

      if (
        text.includes("price") ||
        text.includes("cost") ||
        text.includes("how much") ||
        text.includes("entha") ||
        text.includes("rate") ||
        text.includes("ధర")
      ) {
        return (
          `💰 ${name}\n\n` +
          `Price: ₹${price}\n` +
          `Category: ${category || "Not available"}`
        );
      }

      if (
        text.includes("category") ||
        text.includes("which category") ||
        text.includes("category enti")
      ) {
        return (
          `🛍️ ${name} belongs to the ${category} category.`
        );
      }

      return (
        `🛍️ ${name}\n\n` +
        `Price: ₹${price}\n` +
        `Category: ${category || "Not available"}`
      );
    }

    // ===================================================
    // CHEAPEST PRODUCT
    // ===================================================

    if (
      text.includes("cheapest") ||
      text.includes("lowest price") ||
      text.includes("least price") ||
      text.includes("takkuva price") ||
      text.includes("cheap product")
    ) {
      const cheapest = [...shopProducts].sort(
        (a, b) =>
          Number(a.price) - Number(b.price)
      )[0];

      if (cheapest) {
        return (
          `💰 Lowest-priced product:\n\n` +
          `${cheapest.name} - ₹${cheapest.price}`
        );
      }
    }

    // ===================================================
    // EXPENSIVE PRODUCT
    // ===================================================

    if (
      text.includes("most expensive") ||
      text.includes("highest price") ||
      text.includes("costliest") ||
      text.includes("highest cost")
    ) {
      const expensive = [...shopProducts].sort(
        (a, b) =>
          Number(b.price) - Number(a.price)
      )[0];

      if (expensive) {
        return (
          `💰 Highest-priced product:\n\n` +
          `${expensive.name} - ₹${expensive.price}`
        );
      }
    }

    // ===================================================
    // FASHION
    // ===================================================

    if (
      text.includes("fashion") ||
      text.includes("fashion products")
    ) {
      const items = shopProducts.filter(
        (product) =>
          (product.category || "").toLowerCase() ===
          "fashion"
      );

      return (
        "👕 Fashion Products:\n\n" +
        (items.length
          ? items
              .map(
                (item) =>
                  `${item.name} - ₹${item.price}`
              )
              .join("\n")
          : "No Fashion products available.")
      );
    }

    // ===================================================
    // ELECTRONICS
    // ===================================================

    if (
      text.includes("electronics") ||
      text.includes("electronic products") ||
      text.includes("electronics em unnayi")
    ) {
      const items = shopProducts.filter(
        (product) =>
          (product.category || "").toLowerCase() ===
          "electronics"
      );

      return (
        "🎧 Electronics Products:\n\n" +
        (items.length
          ? items
              .map(
                (item) =>
                  `${item.name} - ₹${item.price}`
              )
              .join("\n")
          : "No Electronics products available.")
      );
    }

    // ===================================================
    // SHOES CATEGORY
    // ===================================================

    if (
      text === "shoes" ||
      text.includes("shoe category") ||
      text.includes("shoes category")
    ) {
      const items = shopProducts.filter(
        (product) =>
          (product.category || "").toLowerCase() ===
          "shoes"
      );

      return (
        "👟 Shoes:\n\n" +
        (items.length
          ? items
              .map(
                (item) =>
                  `${item.name} - ₹${item.price}`
              )
              .join("\n")
          : "No Shoes available.")
      );
    }

    // ===================================================
    // ACCESSORIES
    // ===================================================

    if (
      text.includes("accessories") ||
      text.includes("accessory")
    ) {
      const items = shopProducts.filter(
        (product) =>
          (product.category || "").toLowerCase() ===
          "accessories"
      );

      return (
        "🎒 Accessories:\n\n" +
        (items.length
          ? items
              .map(
                (item) =>
                  `${item.name} - ₹${item.price}`
              )
              .join("\n")
          : "No Accessories available.")
      );
    }

    // ===================================================
    // PRICE RANGE
    // ===================================================

    if (
      text.includes("price range") ||
      text.includes("prices range") ||
      text.includes("minimum price") ||
      text.includes("maximum price")
    ) {
      const prices = shopProducts.map(
        (product) => Number(product.price)
      );

      const minimum = Math.min(...prices);
      const maximum = Math.max(...prices);

      return (
        `💰 ShopNest price range:\n\n` +
        `Minimum: ₹${minimum}\n` +
        `Maximum: ₹${maximum}`
      );
    }

    // ===================================================
    // CART
    // ===================================================

    if (
      text.includes("my cart") ||
      text.includes("cart lo") ||
      text.includes("cart") ||
      text.includes("cart items")
    ) {
      if (!cart.length) {
        return "🛒 Your cart is currently empty.";
      }

      const total = cart.reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) *
            Number(item.quantity || 1),
        0
      );

      return (
        "🛒 Your Cart:\n\n" +
        cart
          .map(
            (item) =>
              `${item.name} × ${
                item.quantity || 1
              } - ₹${
                Number(item.price || 0) *
                Number(item.quantity || 1)
              }`
          )
          .join("\n") +
        `\n\nTotal: ₹${total}`
      );
    }

    // ===================================================
    // ADD TO CART
    // ===================================================

    if (
      text.includes("how to add") &&
      text.includes("cart")
    ) {
      return (
        "🛒 To add a product to your cart:\n\n" +
        "1. Open the product.\n" +
        "2. Click Add to Cart.\n" +
        "3. Open Cart from the navigation bar."
      );
    }

    // ===================================================
    // WISHLIST
    // ===================================================

    if (
      text.includes("wishlist") ||
      text.includes("wish list") ||
      text.includes("wishlist enti") ||
      text.includes("wishlist lo")
    ) {
      return (
        "❤️ Wishlist lets you save products you want " +
        "to check or buy later.\n\n" +
        "Open a product and click Add to Wishlist."
      );
    }

    // ===================================================
    // LOGIN
    // ===================================================

    if (
      text.includes("login") ||
      text.includes("log in") ||
      text.includes("login ela")
    ) {
      return (
        "🔐 To login:\n\n" +
        "1. Open Login.\n" +
        "2. Enter your email.\n" +
        "3. Enter your password.\n" +
        "4. Click Login."
      );
    }

    // ===================================================
    // SIGNUP
    // ===================================================

    if (
      text.includes("signup") ||
      text.includes("sign up") ||
      text.includes("create account") ||
      text.includes("account ela create")
    ) {
      return (
        "👤 To create a ShopNest account:\n\n" +
        "1. Open Signup.\n" +
        "2. Enter your name.\n" +
        "3. Enter your email.\n" +
        "4. Create a password.\n" +
        "5. Submit the form."
      );
    }

    // ===================================================
    // USER DETAILS
    // ===================================================

    if (
      text.includes("my details") ||
      text.includes("my profile") ||
      text.includes("my account") ||
      text.includes("my name") ||
      text.includes("who am i") ||
      text.includes("na details") ||
      text.includes("naa details")
    ) {
      if (!currentUser) {
        return (
          "👤 You are not logged in.\n\n" +
          "Please login to ShopNest to view your account details."
        );
      }

      return (
        "👤 Your ShopNest Account:\n\n" +
        `Name: ${currentUser.name || "Not available"}\n` +
        `Email: ${currentUser.email || "Not available"}`
      );
    }

    // ===================================================
    // ORDERS
    // ===================================================

    if (
      text.includes("my orders") ||
      text.includes("my order") ||
      text.includes("orders enti") ||
      text.includes("orders em unnayi")
    ) {
      if (!currentUser) {
        return "📦 Please login first to view your orders.";
      }

      if (!orders.length) {
        return "📦 You don't have any orders yet.";
      }

      return (
        "📦 Your Orders:\n\n" +
        orders
          .map(
            (order, index) =>
              `${index + 1}. Order #${order.id}\n` +
              `Status: ${
                order.status || "Placed"
              }\n` +
              `Total: ₹${order.total}`
          )
          .join("\n\n")
      );
    }

    // ===================================================
    // ORDER STATUS
    // ===================================================

    if (
      text.includes("order status") ||
      text.includes("status of my order") ||
      text.includes("order status enti") ||
      text.includes("order ekkada")
    ) {
      if (!currentUser) {
        return "📦 Please login first to check your order status.";
      }

      if (!orders.length) {
        return "📦 You don't have any orders yet.";
      }

      return (
        "📦 Your latest order status is:\n\n" +
        `${orders[0].status || "Placed"}`
      );
    }

    // ===================================================
    // PLACE ORDER
    // ===================================================

    if (
      text.includes("place order") ||
      text.includes("how to order") ||
      text.includes("order ela") ||
      text.includes("buy product")
    ) {
      return (
        "📦 To place an order:\n\n" +
        "1. Select a product.\n" +
        "2. Add it to Cart.\n" +
        "3. Open Cart.\n" +
        "4. Click Proceed to Checkout.\n" +
        "5. Enter delivery details.\n" +
        "6. Place your order."
      );
    }

    // ===================================================
    // CHECKOUT
    // ===================================================

    if (
      text.includes("checkout") ||
      text.includes("checkout ela")
    ) {
      return (
        "💳 Checkout is the final step before placing your order.\n\n" +
        "Go to Cart → Proceed to Checkout → Enter your delivery details → Place Order."
      );
    }

    // ===================================================
    // DELIVERY
    // ===================================================

    if (
      text.includes("delivery") ||
      text.includes("deliver") ||
      text.includes("delivery time") ||
      text.includes("delivery eppudu")
    ) {
      return (
        "🚚 Delivery information is handled during checkout.\n\n" +
        "Please enter your correct address and phone number while placing the order."
      );
    }

    // ===================================================
    // ADDRESS
    // ===================================================

    if (
      text.includes("address") ||
      text.includes("address ekkada")
    ) {
      return (
        "📍 Your delivery address can be entered during checkout."
      );
    }

    // ===================================================
    // PHONE NUMBER
    // ===================================================

    if (
      text.includes("phone number") ||
      text.includes("mobile number")
    ) {
      return (
        "📱 Your delivery phone number can be entered during checkout."
      );
    }

    // ===================================================
    // CANCEL ORDER
    // ===================================================

    if (
      text.includes("cancel order") ||
      text.includes("order cancel") ||
      text.includes("cancel my order")
    ) {
      return (
        "❌ To cancel an order, open My Orders and use the Cancel Order option if the order is eligible for cancellation."
      );
    }

    // ===================================================
    // EXCHANGE
    // ===================================================

    if (
      text.includes("exchange") ||
      text.includes("exchange order")
    ) {
      return (
        "🔄 To request an exchange, open My Orders, select the eligible order, choose Exchange, select a reason, and submit the request."
      );
    }

    // ===================================================
    // RETURN
    // ===================================================

    if (
      text.includes("return") ||
      text.includes("return product")
    ) {
      return (
        "↩️ For return-related help, please check the order options available in My Orders."
      );
    }

    // ===================================================
    // PAYMENT
    // ===================================================

    if (
      text.includes("payment") ||
      text.includes("pay") ||
      text.includes("payment options")
    ) {
      return (
        "💳 Payment options depend on the checkout setup of your ShopNest website."
      );
    }

    // ===================================================
    // PRODUCT SEARCH
    // ===================================================

    if (
      text.includes("find product") ||
      text.includes("search product") ||
      text.includes("product search")
    ) {
      return (
        "🔎 You can use the Products section to search for a product by name or category."
      );
    }

    // ===================================================
    // PRODUCT AVAILABILITY
    // ===================================================

    if (
      text.includes("available") ||
      text.includes("in stock") ||
      text.includes("stock")
    ) {
      return (
        "🛍️ Product availability is based on the products currently shown in ShopNest."
      );
    }

    // ===================================================
    // THANK YOU
    // ===================================================

    if (
      text.includes("thank you") ||
      text.includes("thanks") ||
      text.includes("thank")
    ) {
      return "You're welcome! 😊 Happy shopping with ShopNest!";
    }

    // ===================================================
    // BYE
    // ===================================================

    if (
      text === "bye" ||
      text.includes("goodbye")
    ) {
      return "Goodbye! 👋 Visit ShopNest again!";
    }

    // ===================================================
    // DEFAULT
    // ===================================================

    return (
      "Sorry, I didn't understand that completely. 😊\n\n" +
      "Try asking me:\n\n" +
      "• Show products\n" +
      "• Smart Watch price\n" +
      "• What's in my cart?\n" +
      "• My orders\n" +
      "• My order status\n" +
      "• How to place an order?\n" +
      "• How to cancel an order?\n" +
      "• How to exchange an order?\n" +
      "• My details\n" +
      "• Delivery information\n\n" +
      "You can ask in English or Telugu."
    );
  };

  // =====================================================
  // VOICE REPLY
  // =====================================================

  const speakReply = (reply) => {
    if (!("speechSynthesis" in window)) {
      return;
    }

    const cleanReply = reply.replace(
      /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu,
      ""
    );

    const speech =
      new SpeechSynthesisUtterance(cleanReply);

    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = (messageText = input) => {
    if (!messageText.trim()) {
      return;
    }

    const userMessage = messageText.trim();

    const reply = getReply(userMessage);

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        type: "user",
        text: userMessage
      },
      {
        type: "bot",
        text: reply
      }
    ]);

    speakReply(reply);

    setInput("");
  };

  // =====================================================
  // VOICE INPUT
  // =====================================================

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please use Google Chrome."
      );
      return;
    }

    const recognition =
      new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    setListening(true);

    recognition.start();

    recognition.onresult = (event) => {
      const voiceText =
        event.results[0][0].transcript;

      setInput(voiceText);

      sendMessage(voiceText);
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  // =====================================================
  // ENTER KEY
  // =====================================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="chatbot-container">

      {open && (
        <div className="chatbot-window">

          {/* HEADER */}

          <div className="chatbot-header">

            <div className="chatbot-title">
              🤖
              <span>
                ShopNest Assistant
              </span>
            </div>

            <button
              className="chatbot-close"
              onClick={() => {
                setOpen(false);

                if (
                  "speechSynthesis" in window
                ) {
                  window.speechSynthesis.cancel();
                }
              }}
            >
              ×
            </button>

          </div>

          {/* MESSAGES */}

          <div className="chatbot-messages">

            {messages.map(
              (message, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    message.type === "user"
                      ? "user-message"
                      : "bot-message"
                  }`}
                >
                  {message.text}
                </div>
              )
            )}

          </div>

          {/* INPUT */}

          <div className="chatbot-input-area">

            <input
              type="text"
              placeholder="Type or speak..."
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={handleKeyDown}
            />

            <button
              onClick={startListening}
              title="Speak"
              disabled={listening}
            >
              {listening ? "🔴" : "🎤"}
            </button>

            <button
              onClick={() => sendMessage()}
            >
              Send
            </button>

          </div>

        </div>
      )}

      {/* FLOATING BUTTON */}

      <button
        className="chatbot-button"
        onClick={() => setOpen(!open)}
      >
        🤖
      </button>

    </div>
  );
}

export default Chatbot;