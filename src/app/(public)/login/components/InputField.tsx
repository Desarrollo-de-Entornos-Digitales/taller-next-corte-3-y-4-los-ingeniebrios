type InputFieldProps = {
  name: string;
  placeholder: string;
  type: string;
};

export default function InputField({
  name,
  placeholder,
  type,
}: InputFieldProps) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      type={type}
      className="bg-transparent border border-[#6A5AE0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6A5AE0] text-black"
    />
  );
}