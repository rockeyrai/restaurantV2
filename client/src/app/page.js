'use client'
import React, { useEffect } from "react";
import axios from "axios";
import { saveMenuToCache } from "@/storage/CacheAPI/menu";

const Page = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const menuData = await axios.get(`${process.env.NEXT_PUBLIC_FRONTEND_API}/menu`);
        await saveMenuToCache(menuData.data)
        console.log("Menu data saved to cache:", menuData.data);
      } catch (error) {
        console.error("Error fetching or saving menu data:", error);
      }
    };

    fetchData(); // Call the async function inside useEffect
  }, []); // Empty dependency array ensures it runs only once

  return (
    <div>
      Hello
    </div>
  );
};

export default Page;
