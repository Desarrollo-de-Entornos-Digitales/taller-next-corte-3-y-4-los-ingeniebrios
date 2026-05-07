"use client";

export default function FeedFilters() {

  const categories = [
    "Math",
    "Design",
    "Physics",
    "Chemistry",
    "Economics",
    "Programming",
  ];

  return (
    <div className="w-64 bg-white rounded-2xl shadow-md p-5 h-fit">

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-bold text-lg text-indigo-600">
          Filtros
        </h2>

        <button>x</button>
      </div>

      <div className="flex flex-col gap-4">

        <button className="bg-indigo-100 text-indigo-600 rounded-lg px-3 py-2 text-left">
          All categories
        </button>

        {categories.map((category) => (
          <button
            key={category}
            className="
  text-left
  text-gray-700
  px-3
  py-2
  rounded-lg
  transition
  hover:bg-indigo-100
  hover:text-indigo-600
"
          >
            {category}
          </button>
        ))}

      </div>
    </div>
  );
}