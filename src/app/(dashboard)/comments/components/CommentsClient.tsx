"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { PostResponse } from "../../../../common/services/post.service";
import { getAnswersByPostAction } from "../actions/create-answer.action";
import QuestionCard from "./QuestionCard";
import AnswerCard from "./AnswerCard";
import AnswerForm from "./AnswerForm";

type Props = {
  post: PostResponse;
};

export default function CommentsClient({ post }: Props) {
  const [answers, setAnswers] = useState<any[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLDivElement>(null);

  const fetchAnswers = () => {
    startTransition(async () => {
      setLoadingAnswers(true);
      const result = await getAnswersByPostAction(post.id);
      if (!result.error) setAnswers(result.data);
      setLoadingAnswers(false);
    });
  };

  useEffect(() => {
    fetchAnswers();
  }, [post.id]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── Izquierda ── */}
        <div className="flex flex-col gap-6">
          <QuestionCard post={post} onReply={scrollToForm} />

          <div className="flex justify-end pe-4 -mt-4">
            <img src="/mascot.png" alt="mascota" className="w-20 opacity-90" />
          </div>

          <div ref={formRef}>
            <AnswerForm postId={post.id} onAnswerSent={fetchAnswers} />
          </div>
        </div>

        {/* ── Derecha: Respuestas ── */}
        <div className="flex flex-col gap-4">
          {loadingAnswers ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#5856D6] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : answers.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center text-gray-400 text-sm">
              Aún no hay respuestas. ¡Sé el primero en responder!
            </div>
          ) : (
            answers.map((answer) => (
              <AnswerCard key={answer.id} answer={answer} />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
