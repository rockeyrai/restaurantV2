'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Menu.css';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch menu data from the API
    axios.get(`${process.env.NEXT_PUBLIC_FRONTEND_API}/menu`)
      .then((response) => {
        setMenuItems(response.data.menuItems || []); // Ensure menuItems is always an array
        setLoading(false);
      })
      .catch((error) => {
        setError('Failed to fetch menu data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Group menu items by category
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    const { category_name } = item;
    if (!acc[category_name]) {
      acc[category_name] = [];
    }
    acc[category_name].push(item);
    return acc;
  }, {});

  return (
    <div>
      <h1>Menu</h1>
      <div className="menu-items">
        {Object.keys(groupedMenuItems).length > 0 ? (
          Object.keys(groupedMenuItems).map((categoryName) => (
            <div key={categoryName} className="category-section">
              <h2>{categoryName}</h2>
              <div className="menu-items">
                {groupedMenuItems[categoryName].map((item) => (
                  <div key={item.menu_item_id} className="menu-item">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p><strong>Category:</strong> {item.category_name}</p>
                    <p><strong>Price:</strong> ${parseFloat(item.final_price).toFixed(2)}</p>
                    {parseFloat(item.discount_percentage) > 0 && (
                      <p>
                        <strong>Offer:</strong> {item.discount_percentage}% off! 
                        <br />
                        <strong>Offer valid from {item.offer_start_date} to {item.offer_end_date}</strong>
                      </p>
                    )}
                    <p><strong>Available:</strong> {item.availability ? 'Yes' : 'No'}</p>
                    <div>
                      {item.image_urls ? (
                        <img src={item.image_urls} alt={item.name} width="100" height="100" />
                      ) : (
                        <p>No image available</p>
                      )}
                    </div>
                    <div>
                      {item.tags && item.tags.split(',').map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No menu items available.</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
