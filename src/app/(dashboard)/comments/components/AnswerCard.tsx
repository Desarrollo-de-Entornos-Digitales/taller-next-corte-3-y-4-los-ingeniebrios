"use client";

import { AnswerResponse } from "../services/answer.service";

type Props = {
  answer: AnswerResponse;
};

export default function AnswerCard({ answer }: Props) {
  const level = answer.user.student?.level ?? 1;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <img
          src={answer.user.avatar && answer.user.avatar.startsWith("data:")
            ? answer.user.avatar
            : `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(answer.user.name)}`}
          alt={answer.user.name}
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
        />
        <p className="font-semibold text-gray-800 text-sm">
          {answer.user.name} – Nivel {level}
        </p>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed">
        {answer.content ?? answer.description}
      </p>

      {answer.image && (
        <img
          src={answer.image}
          alt="Imagen de la respuesta"
          className="rounded-xl max-h-48 object-contain border border-gray-100"
        />
      )}

      <div className="flex justify-end">
        <button className="flex items-center gap-1.5 text-[#5856D6] text-sm font-semibold hover:opacity-70 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          Gracias
        </button>
      </div>
    </div>
  );
}