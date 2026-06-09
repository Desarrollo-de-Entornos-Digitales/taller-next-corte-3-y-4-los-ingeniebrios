"use server";

import axiosClient, { ApiResult, safeRequest } from "../../../../lib/axios/client";
import { MonitorResponse } from "../services/monitors.service";

// Server Action for fetching monitors
export async function getMonitorsAction(): Promise<ApiResult<MonitorResponse[]>> {
  return safeRequest(axiosClient.get<MonitorResponse[]>("/monitors"));
}
