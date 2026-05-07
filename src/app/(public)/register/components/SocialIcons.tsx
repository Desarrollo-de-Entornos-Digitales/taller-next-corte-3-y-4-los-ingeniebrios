interface Props {
  icons: string[];
}

export default function SocialIcons({ icons }: Props) {
  return (
    <div className="flex justify-center gap-5 mt-4">
      {icons.map((icon, i) => (
        <div
          key={i}
          className="w-12 h-12 border rounded-full flex items-center justify-center bg-white shadow"
        >
          {icon}
        </div>
      ))}
    </div>
  );
}