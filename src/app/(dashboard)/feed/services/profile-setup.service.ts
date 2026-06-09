// src/app/(dashboard)/feed/services/profile-setup.service.ts

import axios from '@/lib/axios/client';
import { ApiResult, safeRequest } from '@/lib/axios/client';

export interface SetupData {
  careerId: number;
  semester: number;
}

export interface Career {
  id: number;
  name: string;
}

export const profileSetupService = {
  // Obtener lista de carreras desde el backend
  async getCareers(): Promise<ApiResult<Career[]>> {
    const token = localStorage.getItem("access_token");
    return safeRequest(
      axios.get<Career[]>('/career', {
        headers: { Authorization: `Bearer ${token}` }
      })
    );
  },

  // Guardar carrera y semestre en el backend (usando PATCH /students/:id)
  async saveUserCareerAndSemester(studentId: number, data: SetupData): Promise<ApiResult<any>> {
    const token = localStorage.getItem("access_token");
    return safeRequest(
      axios.patch(`/students/${studentId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
    );
  },

  // Obtener el estudiante actual para verificar si ya tiene datos
  async getCurrentStudent(userId: number): Promise<any> {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  // Verificar si el usuario ya tiene carrera y semestre
  async hasUserSetup(userId: number): Promise<{ hasSetup: boolean }> {
    try {
      const user = await this.getCurrentStudent(userId);
      const hasCareer = !!user.student?.career?.id;
      const hasSemester = !!user.student?.semester;
      return { hasSetup: hasCareer && hasSemester };
    } catch (error) {
      return { hasSetup: false };
    }
  }
};