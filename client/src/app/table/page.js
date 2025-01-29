"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTablesFromDB, saveReservedTableInDB, storeTablesInDB } from "@/storage/IndexedDB/table";

const TableReservationApp = () => {
  const [tables, setTables] = useState(null); // Default to null to prevent mismatches
  const [loading, setLoading] = useState(true);
  const [tableId, setTableId] = useState("");
  const userId = useSelector((state) => state.user?.userInfo?.user_id);
  const userName = useSelector((state) => state.user?.userInfo?.username);

  // Fetch table availability
  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_FRONTEND_API}/table`
        );
        const fetchedTables = response.data;
        setTables(fetchedTables);
  
        // Store tables in IndexedDB
        await storeTablesInDB(fetchedTables);
  
        // Filter reserved tables and save them in IndexedDB
        const reservedTables = fetchedTables.filter(
          (table) => !table.available && table.user_id === userId // Check both conditions
        );
        for (const table of reservedTables) {
          await saveReservedTableInDB(table); // Save only the matching tables
        }
  
      } catch (error) {
        console.error("Error fetching tables:", error);
        toast.error("Unable to fetch table data. Trying to load offline data.");
  
        // Fallback to IndexedDB
        const storedTables = await getTablesFromDB();
        if (storedTables.length > 0) {
          setTables(storedTables);
        } else {
          toast.error("No offline data available.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchTables();
  }, []);
  
  
  

  const handleReserve = async (e) => {
    e.preventDefault();
    try {
      const selectedTable = tables?.find(
        (table) => table.id === parseInt(tableId)
      );
      if (!selectedTable?.available) {
        toast.error("The selected table is unavailable.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_FRONTEND_API}/reserve`,
        {
          user_id: userId,
          table_id: tableId,
        }
      );
      setTableId("");
      toast.success(response.data.message || "Table reserved successfully!");

      // Refresh table availability
      const updatedTables = await axios.get(
        `${process.env.NEXT_PUBLIC_FRONTEND_API}/table`
      );
      setTables(updatedTables.data);
      // Update IndexedDB with the latest table data
      await storeTablesInDB(updatedTables.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error reserving table.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Table Reservation System</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Table Availability</h2>
        {loading ? (
          <p>Loading...</p>
        ) : tables ? (
          tables.length > 0 ? (
            <table className="table-auto w-full border">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Table ID</th>
                  <th className="border px-4 py-2">Table Seats</th>
                  <th className="border px-4 py-2">Reserved</th>
                </tr>
              </thead>
              <tbody>
                {tables.map((table) => (
                  <tr key={table.id}>
                    <td className="border px-4 py-2">{table.id}</td>
                    <td className="border px-4 py-2">{table.seats}</td>
                    <td className="border px-4 py-2">
                      {table.available ? (
                        "Available"
                      ) : table.user_id === userId ? (
                        <span>{userName}</span> // Show the user's name if it matches
                      ) : (
                        "Unavailable"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No tables available.</p>
          )
        ) : (
          <p>Error loading tables.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Reserve a Table</h2>
        <form onSubmit={handleReserve} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Table ID</label>
            <input
              type="text"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Reserve Table
          </button>
        </form>
      </div>
    </div>
  );
};

export default TableReservationApp;
