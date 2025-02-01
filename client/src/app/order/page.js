"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = useSelector((state) => state.user?.userInfo?.user_id);

  // Fetch user orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_FRONTEND_API}/orders/user/${userId}`
      );
      setOrders(data);
      setError("");
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Delete an order
  const deleteOrder = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_FRONTEND_API}/orders/${id}`);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Update order status
  const updateOrderStatus = async (id, status) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_FRONTEND_API}/orders/${id}`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Order Management</h2>
      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>User ID</th>
              <th style={styles.tableHeader}>Table ID</th>
              <th style={styles.tableHeader}>Total Cost</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Items</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td style={styles.tableCell}>{order.user_id}</td>
                <td style={styles.tableCell}>{order.table_id || "N/A"}</td>
                <td style={styles.tableCell}>{order.total_cost}</td>
                <td style={styles.tableCell}>{order.status}</td>
                <td style={styles.tableCell}>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {order.items.map((item) => (
                      <li key={item.menu_item_id} style={{ marginBottom: "5px" }}>
                        {item.food ? (
                          <>
                            <strong>{item.food.name}</strong> - Quantity: {item.quantity} - Price:{" "}
                            {item.food.price}
                          </>
                        ) : (
                          "Food details not available"
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={styles.tableCell}>
                  <button
                    style={styles.completeButton}
                    onClick={() => updateOrderStatus(order._id, "completed")}
                  >
                    Complete
                  </button>
                  <button
                    style={styles.cancelButton}
                    onClick={() => updateOrderStatus(order._id, "cancelled")}
                  >
                    Cancel
                  </button>
                  <button
                    style={styles.deleteButton}
                    onClick={() => deleteOrder(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

// Styles
const styles = {
  tableHeader: {
    backgroundColor: "#f4f4f4",
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: "10px",
  },
  completeButton: {
    margin: "0 5px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  cancelButton: {
    margin: "0 5px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#ffc107",
    color: "#fff",
    cursor: "pointer",
  },
  deleteButton: {
    margin: "0 5px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#dc3545",
    color: "#fff",
    cursor: "pointer",
  },
};

export default OrderManagement;
