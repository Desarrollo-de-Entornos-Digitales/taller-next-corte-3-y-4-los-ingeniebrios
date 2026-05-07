import SocialIcons from "./SocialIcons";

interface Props {
  title: string;
  buttonText: string;
}

export default function RegisterCard({ title, buttonText }: Props) {
  return (
    <div className="bg-[#F5F5F5] p-10 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-[420px]">

      <h2 className="text-2xl font-bold text-center mb-8">
        {title}
      </h2>

      <form className="flex flex-col gap-5">

        <input
          type="email"
          placeholder="Email"
          className="bg-transparent border border-[#6A5AE0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6A5AE0]"
        />

        <input
          type="password"
          placeholder="Password"
          className="bg-transparent border border-[#6A5AE0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6A5AE0]"
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="bg-transparent border border-[#6A5AE0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6A5AE0]"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-[#5B4BDB] to-[#6A5AE0] text-white py-3 rounded-xl mt-2 font-medium"
        >
          {buttonText}
        </button>

      </form>

      <p className="text-center text-gray-400 mt-6 text-sm">
        - Or sign in with -
      </p>

      <SocialIcons icons={["G", "M", "X"]} />

      <p className="text-center text-sm mt-6">
        Don’t have an account?{" "}
        <span className="text-[#5B4BDB] font-medium cursor-pointer">
          Sign up
        </span>
      </p>

    </div>
  );
}