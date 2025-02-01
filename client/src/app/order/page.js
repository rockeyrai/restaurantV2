'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const userId = useSelector((state) => state.user?.userInfo?.user_id);

  // Fetch user orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_FRONTEND_API}/orders/user/${userId}`);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };


  // Delete an order
  // const deleteOrder = async (id) => {
  //   try {
  //     await axios.delete(`${process.env.NEXT_PUBLIC_FRONTEND_API}/orders/${id}`);
  //     fetchOrders();
  //   } catch (error) {
  //     console.error('Error deleting order:', error);
  //   }
  // };

  // Update order status
  // const updateOrderStatus = async (id, status) => {
  //   try {
  //     await axios.patch(`${process.env.NEXT_PUBLIC_FRONTEND_API}/orders/${id}`, { status });
  //     fetchOrders();
  //   } catch (error) {
  //     console.error('Error updating order status:', error);
  //   }
  // };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
        <h2>Orders</h2>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Table ID</th>
              <th>Total Cost</th>
              <th>Status</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.user_id}</td>
                <td>{order.table_id}</td>
                <td>{order.total_cost}</td>
                <td>{order.status}</td>
                {/* <td>
                  <button onClick={() => updateOrderStatus(order._id, 'completed')}>Complete</button>
                  <button onClick={() => updateOrderStatus(order._id, 'cancelled')}>Cancel</button>
                  <button onClick={() => deleteOrder(order._id)}>Delete</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default OrderManagement;
