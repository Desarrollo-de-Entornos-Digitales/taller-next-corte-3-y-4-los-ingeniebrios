import axiosClient, {ApiResult, safeRequest} from "../../lib/axios/client";

// Type definition for Faculty API response
export type FacultyResponse = {
  id: number;
  name: string;
};

// Faculty Service - handles all faculty-related API calls
class FacultyService {
  // Retrieve all available faculties from the API
  async getFaculties(): Promise<ApiResult<FacultyResponse[]>> {
    return safeRequest(axiosClient.get<FacultyResponse[]>("/faculty"));
  }
}

export const facultyService = new FacultyService();