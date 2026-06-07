import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import QuestionForm from "./components/QuestionForm";
import { postsService } from "../../../common/services/post.service";
import { facultyService } from "../../../common/services/faculty.service";

export default async function QuestionsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    try {
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
      if (payload.permissions?.includes("manage_users")) {
        redirect("/feed");
      }
    } catch {}
  }

  const [categoriesResult, facultiesResult] = await Promise.all([
    postsService.getCategories(),
    facultyService.getFaculties(),
  ]);

  const categories = categoriesResult.error ? [] : categoriesResult.data;
  const faculties = facultiesResult.error ? [] : facultiesResult.data;

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#D4E84A] relative overflow-hidden h-[300px] flex items-center">
        <h1 className="ml-36 text-[72px] font-medium text-[#5856D6] z-10">
          Necesitas ayuda?
        </h1>
        <img src="/questionPic.png" alt="" className="absolute right-0 top-0 h-full" />
      </section>

      <div className="max-w-[900px] mx-auto py-14">
        <QuestionForm categories={categories} faculties={faculties} />
      </div>
    </div>
  );
}