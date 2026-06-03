import axiosClient, {ApiResult, safeRequest} from "../../lib/axios/client";

export type FacultyResponse = {
  id: number;
  name: string;
};

class FacultyService {
  async getFaculties(): Promise<ApiResult<FacultyResponse[]>> {
    return safeRequest(axiosClient.get<FacultyResponse[]>("/faculty"));
  }
}

export const facultyService = new FacultyService();