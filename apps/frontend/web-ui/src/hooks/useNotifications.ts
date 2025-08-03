import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

// Extend WebSocket interface to include heartbeat property
interface CustomWebSocket extends WebSocket {
  heartbeat?: NodeJS.Timeout;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: number;
  metadata?: any;
}

function showToastNotification(notification: Notification) {
  const options = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  };

  switch (notification.type) {
    case "TASK_CREATED":
    case "TASK_ASSIGNED":
      toast.info(`📋 ${notification.title}`, options);
      break;

    case "TASK_DUE_SOON":
      toast.warning(`⏰ ${notification.title}`, options);
      break;

    case "CALENDAR_EVENT_REMINDER":
      toast.warning(`📅 ${notification.title}`, options);
      break;

    case "CALENDAR_EVENT_CREATED":
    case "CALENDAR_EVENT_UPDATED":
      toast.info(`📅 ${notification.title}`, options);
      break;

    default:
      toast(notification.title, options);
  }
}

export const useNotifications = () => {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<CustomWebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = useCallback(() => {
    if (!session?.accessToken) return;

    try {
      // Connect to WebSocket with JWT token
      const wsUrl = `ws://localhost:8080/ws-notifications?token=${session.accessToken}`;
      const ws: CustomWebSocket = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);

        // Send heartbeat every 30 seconds
        const heartbeat = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "PING" }));
          }
        }, 30000);

        wsRef.current = ws;
        wsRef.current.heartbeat = heartbeat;
      };

      ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          console.log("Received notification:", notification);

          // Handle different notification types
          switch (notification.type) {
            case "CONNECTION":
              console.log("Connected to notification service");
              break;

            case "PONG":
              // Heartbeat response
              break;

            default:
              // Add to notifications array
              setNotifications((prev) => [notification, ...prev]);
              setUnreadCount((prev) => prev + 1);

              // Show toast notification
              showToastNotification(notification);
              break;
          }
        } catch (error) {
          console.error("Error parsing notification:", error);
          toast.error("Error parsing notification.");
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        toast.error("WebSocket connection error.");
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        toast.warn("WebSocket disconnected. Attempting to reconnect...");

        // Clear heartbeat
        if (wsRef.current?.heartbeat) {
          clearInterval(wsRef.current.heartbeat);
        }

        // Attempt to reconnect after 5 seconds
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log("Attempting to reconnect...");
          connect();
        }, 5000);
      };
    } catch (error) {
      console.error("Failed to connect WebSocket:", error);
      toast.error("Failed to connect to notification service.");
    }
  }, [session, showToastNotification]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  }, []);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        const response = await fetch(
          `/api/v1/notifications/${notificationId}/read`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        if (response.ok) {
          setNotifications((prev) =>
            prev.map((n) =>
              n.id === notificationId ? { ...n, read: true } : n
            )
          );
          setUnreadCount((prev) => Math.max(0, prev - 1));
          toast.success("Notification marked as read.");
        } else {
          toast.error("Failed to mark notification as read.");
        }
      } catch (error) {
        console.error("Failed to mark notification as read:", error);
        toast.error("Failed to mark notification as read.");
      }
    },
    [session]
  );

  const markAllAsRead = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(
        `/api/v1/notifications/user/${session.user.id}/read-all`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
        toast.success("All notifications marked as read.");
      } else {
        toast.error("Failed to mark all notifications as read.");
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      toast.error("Failed to mark all notifications as read.");
    }
  }, [session]);

  const fetchNotifications = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(
        `/api/v1/notifications/user/${session.user.id}?size=20`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.content);
      } else {
        toast.error("Failed to fetch notifications.");
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to fetch notifications.");
    }
  }, [session]);

  const fetchUnreadCount = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const response = await fetch(
        `/api/v1/notifications/user/${session.user.id}/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count);
      } else {
        toast.error("Failed to fetch unread count.");
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
      toast.error("Failed to fetch unread count.");
    }
  }, [session]);

  // Connect WebSocket when session is available
  useEffect(() => {
    if (session?.accessToken) {
      connect();
      fetchNotifications();
      fetchUnreadCount();
    }

    return () => {
      disconnect();
    };
  }, [session, connect, disconnect, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    refetch: fetchNotifications,
  };
};
