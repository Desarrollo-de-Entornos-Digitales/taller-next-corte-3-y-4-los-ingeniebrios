// utils/post.util.ts

export type MockPost = {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number; // Cambiado a number
  };
  content: string;
  category: string;
  image?: string | null;
};

export const mockPosts: MockPost[] = [
  {
    id: "1",
    author: {
      name: "Ana Martínez",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      level: 3
    },
    content: "¿Alguien me puede explicar cómo resolver integrales por partes? Estoy estudiando para el examen y no entiendo bien la fórmula ∫u dv = uv - ∫v du",
    category: "Matemáticas"
  },
  {
    id: "2",
    author: {
      name: "Carlos López",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      level: 5
    },
    content: "¿Cuál es la diferencia entre 'let' y 'const' en JavaScript? He visto que se usan para declarar variables pero no sé cuál es mejor en cada caso.",
    category: "Programación"
  },
  {
    id: "3",
    author: {
      name: "Laura Gómez",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      level: 2
    },
    content: "Necesito recomendaciones de herramientas para diseñar wireframes. ¿Qué usan ustedes? Figma, Adobe XD o alguna otra?",
    category: "Diseño"
  },
  {
    id: "4",
    author: {
      name: "Miguel Torres",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      level: 4
    },
    content: "¿Alguien entiende la ley de Ohm? V = I * R. No me queda claro cómo aplicar la fórmula en circuitos en serie y paralelo.",
    category: "Física"
  },
  {
    id: "5",
    author: {
      name: "Sofía Ramírez",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
      level: 1
    },
    content: "¿Cómo balancear ecuaciones químicas por el método redox? Me pierdo con los números de oxidación. Ayuda por favor 🙏",
    category: "Química"
  },
  {
    id: "6",
    author: {
      name: "Javier Mendoza",
      avatar: "https://randomuser.me/api/portraits/men/6.jpg",
      level: 3
    },
    content: "¿Qué es la inflación y cómo afecta a los ciudadanos? Necesito ejemplos prácticos para mi tarea de economía.",
    category: "Economía"
  },
  {
    id: "7",
    author: {
      name: "Valentina Díaz",
      avatar: "https://randomuser.me/api/portraits/women/7.jpg",
      level: 2
    },
    content: "¿Alguien me explica qué es el hoisting en JavaScript? Veo que las funciones y variables se elevan pero no entiendo bien el concepto.",
    category: "Programación"
  },
  {
    id: "8",
    author: {
      name: "Andrés Herrera",
      avatar: "https://randomuser.me/api/portraits/men/8.jpg",
      level: 5
    },
    content: "¿Qué tips me dan para mejorar mis composiciones en diseño gráfico? Siento que mis diseños no tienen buena jerarquía visual.",
    category: "Diseño"
  }
];