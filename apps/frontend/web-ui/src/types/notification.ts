export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    channel: NotificationChannel;
    title: string;
    message: string;
    metadata?: any;
    status: NotificationStatus;
    createdAt: string;
    sentAt?: string;
    readAt?: string;
    read?: boolean;
  }
  
  export enum NotificationType {
    TASK_CREATED = 'TASK_CREATED',
    TASK_UPDATED = 'TASK_UPDATED',
    TASK_DELETED = 'TASK_DELETED',
    TASK_ASSIGNED = 'TASK_ASSIGNED',
    TASK_DUE_SOON = 'TASK_DUE_SOON',
    CALENDAR_EVENT_CREATED = 'CALENDAR_EVENT_CREATED',
    CALENDAR_EVENT_UPDATED = 'CALENDAR_EVENT_UPDATED',
    CALENDAR_EVENT_REMINDER = 'CALENDAR_EVENT_REMINDER',
    CALENDAR_EVENT_CANCELLED = 'CALENDAR_EVENT_CANCELLED'
  }
  
  export enum NotificationChannel {
    EMAIL = 'EMAIL',
    WEBSOCKET = 'WEBSOCKET',
    IN_APP = 'IN_APP'
  }
  
  export enum NotificationStatus {
    PENDING = 'PENDING',
    SENT = 'SENT',
    FAILED = 'FAILED',
    READ = 'READ'
  }