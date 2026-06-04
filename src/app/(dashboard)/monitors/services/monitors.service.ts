export interface MonitorResponse {
  id: number;
  subject: string;
  availability: string;
  student: {
    id: number;
    user: {
      name: string;
      avatar: string;
    };
  };
}

export const monitorService = {
  getMonitors: async (): Promise<{ data: MonitorResponse[]; error: boolean; message?: string }> => {
    try {
      // Intentamos capturar el token de las cookies o del localStorage de forma segura
      let token = "";
      if (typeof window !== "undefined") {
        token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1] ?? localStorage.getItem("token") ?? "";
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/monitors`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          data: [], 
          error: true, 
          message: data.message || "Error al obtener monitores del servidor." 
        };
      }

      // 🛡️ Desempaquetamos de forma segura si viene en { data: [...] } o directo [...]
      const monitorsArray = Array.isArray(data) 
        ? data 
        : (data && Array.isArray(data.data) ? data.data : []);

      return { data: monitorsArray, error: false };
    } catch (error) {
      console.error("MonitorService Error:", error);
      return { data: [], error: true, message: "Error de conexión de red." };
    }
  }
};