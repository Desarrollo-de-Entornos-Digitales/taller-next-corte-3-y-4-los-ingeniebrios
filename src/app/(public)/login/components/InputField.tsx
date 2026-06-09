// InputField Component - reusable input component for login form
// Client component for form input fields with styling
"use client";

type InputFieldProps = {
  name: string;
  placeholder: string;
  type: string;
  required?: boolean; // Optional since input is reusable
};

// Render styled input field with focus states
export default function InputField({
  name,
  placeholder,
  type,
  required = false,
}: InputFieldProps) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      type={type}
      required={required}
      className="bg-transparent border border-[#6A5AE0] rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#6A5AE0] text-black w-full"
    />
  );
}