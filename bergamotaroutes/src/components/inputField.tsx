"user client";

import Image from "next/image";

// Componente para los campos de entrada
const InputField = ({
  label,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
}) => (
  <div>
    <h1 className="font-bold text-xl">{label}</h1>
    <div className="flex items-center bg-gray-main p-3 rounded-lg">
      <Image
        src={icon}
        alt={`${label} Icon`}
        width={30}
        height={30}
        className="mr-3"
      />
      <input
        type={type}
        placeholder={placeholder}
        className="bg-transparent outline-none flex-1 text-white placeholder-white"
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

export default InputField;