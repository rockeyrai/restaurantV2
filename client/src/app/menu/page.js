"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Menu.css";
import { getMenuFromCache, saveMenuToCache } from "@/storage/CacheAPI/menu";
import { getReservedTablesFromDB } from "@/storage/IndexedDB/table";
import { useSelector } from "react-redux";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [availability, setAvailability] = useState(null); // null = All, true = Available, false = Unavailable
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [hasOffer, setHasOffer] = useState(null); // null = All, true = With Offer, false = Without Offer
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 }); // Default price range
  const [maxPrice, setMaxPrice] = useState(100); // Dynamic max price from items
  const user_id = useSelector((state) => state.user?.userInfo?.user_id);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        // Try to get the menu from cache
        const cachedMenu = await getMenuFromCache();
        if (cachedMenu && Array.isArray(cachedMenu)) {
          console.log("Cached Menu Data:", cachedMenu);
          setMenuItems(cachedMenu);
          setFilteredMenuItems(cachedMenu);
          setMaxPrice(
            Math.ceil(
              Math.max(
                ...cachedMenu.map((item) => parseFloat(item.final_price || 0))
              )
            )
          );
          setPriceRange({
            min: 0,
            max: Math.ceil(
              Math.max(
                ...cachedMenu.map((item) => parseFloat(item.final_price || 0))
              )
            ),
          });
          setLoading(false);
        } else {
          // If not found in cache or invalid data, fetch from API
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_FRONTEND_API}/menu`
          );
          const items = response.data.menuItems || [];

          // Set the fetched data to state and cache it
          setMenuItems(items);
          setFilteredMenuItems(items);
          setMaxPrice(
            Math.ceil(
              Math.max(
                ...items.map((item) => parseFloat(item.final_price || 0))
              )
            )
          );
          setPriceRange({
            min: 0,
            max: Math.ceil(
              Math.max(
                ...items.map((item) => parseFloat(item.final_price || 0))
              )
            ),
          });

          // Save to cache
          await saveMenuToCache(items);

          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setError("Failed to fetch menu data");
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  useEffect(() => {
    // Filter menu items based on selected filters
    const filtered = menuItems.filter((item) => {
      // Availability filter
      if (
        availability !== null &&
        item.availability !== (availability ? 1 : 0)
      ) {
        return false;
      }
      // Category filter
      if (selectedCategory && item.category_name !== selectedCategory) {
        return false;
      }
      // Tag filter
      if (
        selectedTag &&
        (!item.tags || !item.tags.split(",").includes(selectedTag))
      ) {
        return false;
      }
      // Offer filter
      if (
        hasOffer !== null &&
        (hasOffer
          ? parseFloat(item.discount_percentage) === 0
          : parseFloat(item.discount_percentage) > 0)
      ) {
        return false;
      }
      // Price range filter
      const price = parseFloat(item.final_price);
      if (price < priceRange.min || price > priceRange.max) {
        return false;
      }
      return true;
    });

    setFilteredMenuItems(filtered);
  }, [
    availability,
    selectedCategory,
    selectedTag,
    hasOffer,
    priceRange,
    menuItems,
  ]);

  const addToCart = (item) => {
    const existingItem = cart.find(
      (cartItem) => cartItem.menu_item_id === item.menu_item_id
    );
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.menu_item_id === item.menu_item_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };
  const placeOrder = async () => {
    try {
      const orderDetails = cart.map(
        ({ menu_item_id, quantity, final_price }) => ({
          menu_item_id,
          quantity,
          price: parseFloat(final_price),
        })
      );
      // Get reserved table from IndexedDB
      const reservedTable = await getReservedTablesFromDB();

      // Send request with or without table_id based on reservation status
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_FRONTEND_API}/order`,
        {
          user_id,
          ...(reservedTable ? { table_id: reservedTable.table_id } : {}),
          items: orderDetails,
        }
      );

      if (response.data.success) {
        alert("Order placed successfully!");
        setCart([]); // Clear the cart after placing the order
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      alert("Error placing order. Please try again later.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Generate category and tag options dynamically
  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category_name)),
  ];
  const tags = [
    "All",
    ...new Set(menuItems.flatMap((item) => (item.tags || "").split(","))),
  ];

  return (
    <div>
      <h1>Menu</h1>

      {/* Filters */}
      <div className="filters">
        <label>
          Availability:
          <select
            value={availability === null ? "" : availability.toString()}
            onChange={(e) =>
              setAvailability(
                e.target.value === "" ? null : e.target.value === "true"
              )
            }
          >
            <option value="">All</option>
            <option value="true">Available</option>
            <option value="false">Unavailable</option>
          </select>
        </label>

        <label>
          Category:
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value || "")}
          >
            {categories.map((category) => (
              <option key={category} value={category === "All" ? "" : category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tag:
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value || "")}
          >
            {tags.map((tag) => (
              <option key={tag} value={tag === "All" ? "" : tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>

        <label>
          Has Offer:
          <select
            value={hasOffer === null ? "" : hasOffer.toString()}
            onChange={(e) =>
              setHasOffer(
                e.target.value === "" ? null : e.target.value === "true"
              )
            }
          >
            <option value="">All</option>
            <option value="true">With Offer</option>
            <option value="false">Without Offer</option>
          </select>
        </label>

        <label>
          Price Range: ${priceRange.min} - ${priceRange.max}
          <input
            type="range"
            min="0"
            max={maxPrice}
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange((prev) => ({
                ...prev,
                max: parseFloat(e.target.value),
              }))
            }
          />
        </label>
      </div>

      {/* Menu Items */}
      <div className="menu-items">
        {filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((item) => (
            <div key={item.menu_item_id} className="menu-item">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>
                <strong>Category:</strong> {item.category_name}
              </p>
              <p>
                <strong>Price:</strong> $
                {parseFloat(item.final_price).toFixed(2)}
              </p>
              {parseFloat(item.discount_percentage) > 0 && (
                <>
                  <p>
                    <strong>Discounted Price:</strong> $
                    {(
                      parseFloat(item.final_price) *
                      (1 - parseFloat(item.discount_percentage) / 100)
                    ).toFixed(2)}
                  </p>
                  <p>
                    <strong>Offer:</strong> {item.discount_percentage}% off!
                    <br />
                  </p>
                  <p>
                    <strong>Offer valid from: </strong> {item.offer_start_date}{" "}
                    to {item.offer_end_date}
                  </p>
                </>
              )}
              <p>
                <strong>Available:</strong> {item.availability ? "Yes" : "No"}
              </p>
              <div>
                {item.image_urls ? (
                  <img
                    src={item.image_urls}
                    alt={item.name}
                    width="100"
                    height="100"
                  />
                ) : (
                  <p>No image available</p>
                )}
              </div>
              <div>
                {item.tags &&
                  item.tags.split(",").map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
              </div>
              <button
                onClick={() => addToCart(item)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Order
              </button>
            </div>
          ))
        ) : (
          <p>No menu items available.</p>
        )}
      </div>
      {/* Cart */}
      {cart.length > 0 && (
        <div className="cart">
          <h2>Your Cart</h2>
          {cart.map((item) => (
            <div key={item.menu_item_id}>
              <p>
                {item.name} (x{item.quantity})
              </p>
              <p>${(item.final_price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
          <button
            onClick={placeOrder}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
