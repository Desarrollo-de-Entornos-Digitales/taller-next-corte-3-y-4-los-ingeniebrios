import axiosClient, { ApiResult, safeRequest } from "../../../../lib/axios/client";

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

class MonitorService {
  async getMonitors(): Promise<ApiResult<MonitorResponse[]>> {
    return safeRequest(axiosClient.get<MonitorResponse[]>("/monitors"));
  }
}

export const monitorService = new MonitorService();