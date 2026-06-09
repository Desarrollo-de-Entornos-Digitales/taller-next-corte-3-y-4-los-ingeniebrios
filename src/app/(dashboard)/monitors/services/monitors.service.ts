import axiosClient, { ApiResult, safeRequest } from "../../../../lib/axios/client";

// Type definition for monitor response
export interface MonitorResponse {
  id: number;
  subject: string;
  availability: string;
  student: {
    id: number;
    user: {
      id: number;
      name: string;
      avatar: string | null;
    };
  };
}

// Monitor Service - manages monitor API operations
class MonitorService {
  // Retrieve all monitors from API
  async getMonitors(): Promise<ApiResult<MonitorResponse[]>> {
    return safeRequest(axiosClient.get<MonitorResponse[]>("/monitors"));
  }
}

export const monitorService = new MonitorService();