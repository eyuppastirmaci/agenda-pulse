import apiClient from "@/lib/api-client";

export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  dueDate?: string;
  status?: TaskStatus;
}

export interface TasksResponse {
  content: Task[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export async function createTask(data: CreateTaskRequest): Promise<Task> {
  const response = await apiClient.post("/api/tasks", data);
  return response.data;
}

export async function getTasks(
  page = 0,
  size = 20,
  status?: TaskStatus
): Promise<TasksResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  const response = await apiClient.get(`/api/tasks?${params}`);
  return response.data;
}

export async function getTask(taskId: number): Promise<Task> {
  const response = await apiClient.get(`/api/tasks/${taskId}`);
  return response.data;
}

export async function updateTask(
  taskId: number,
  data: UpdateTaskRequest
): Promise<Task> {
  const response = await apiClient.put(`/api/tasks/${taskId}`, data);
  return response.data;
}

export async function deleteTask(taskId: number): Promise<void> {
  await apiClient.delete(`/api/tasks/${taskId}`);
}
