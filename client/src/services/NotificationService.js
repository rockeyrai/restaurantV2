import API from "./API";

const NotificationService = {
  fetchNotifications: async (userId) => {
    try {
      const response = await API.get(`/notifications?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch notifications", error);
      throw error;
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await API.patch(`/notifications/${notificationId}`, {
        status: "read",
      });
      return response.data;
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      throw error;
    }
  },
};

export default NotificationService;
