import Image from "next/image";

interface Props {
  title: string;
  subtitle: string;
  background: string;
  logo: string;
}

export default function LeftSection({ title, subtitle, background, logo }: Props) {
  return (
    <div
      className="w-1/2 h-full flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `url('${background}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="w-44 h-44 bg-white rounded-full flex items-center justify-center mb-8">
        <Image src={logo} alt="logo" width={100} height={100} />
      </div>

      <h1 className="text-4xl font-bold text-center leading-tight">
        {title}
      </h1>

      <p className="text-3xl font-semibold mt-6 text-center">
        {subtitle}
      </p>
    </div>
  );
}