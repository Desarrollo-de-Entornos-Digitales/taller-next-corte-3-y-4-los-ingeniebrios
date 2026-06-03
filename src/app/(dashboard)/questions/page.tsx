import QuestionForm from "./components/QuestionForm";
import { postsService } from "../../../common/services/post.service";
import { facultyService } from "../../../common/services/faculty.service";

export default async function QuestionsPage() {
  const [categoriesResult, facultiesResult] = await Promise.all([
    postsService.getCategories(),
    facultyService.getFaculties(),
  ]);

  const categories = categoriesResult.error ? [] : categoriesResult.data;
  const faculties  = facultiesResult.error  ? [] : facultiesResult.data;

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto">

        {/* Hero */}
        <section className="bg-[#D4E84A] rounded-2xl relative overflow-hidden w-full min-h-[220px] flex items-center px-10">
          <h1 className="text-5xl font-bold text-[#5856D6] max-w-sm z-10">
            Necesitas ayuda?
          </h1>
          <img
            src="/hero-pregunta.png"
            alt=""
            className="absolute right-0 top-0 h-full object-cover rounded-r-2xl"
          />
        </section>

        {/* Formulario */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <QuestionForm categories={categories} faculties={faculties} />
        </div>

      </div>
    </div>
  );
}