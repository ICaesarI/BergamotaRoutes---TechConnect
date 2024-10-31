"use client";

import Image from "next/image";

// Componente para los campos de entrada
const InputField = ({
  label,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  backgroundInput = "bg-gray-main",
  textColor = "white",
}) => {
  // Función de manejo del evento onChange
  const handleChange = (e) => {
    // Llama a onChange con el valor del input
    onChange(e.target.value); // Esto es correcto
  };

  return (
    <div>
      <h1 className="font-bold text-xl">{label}</h1>
      <div className={`flex items-center ${backgroundInput} p-3 rounded-lg`}>
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
          className={`bg-transparent outline-none flex-1 text-${textColor} placeholder-${textColor}`} // Usa las variables de color
          required
          value={value} // Esto debe ser correcto
          onChange={handleChange} // Usa la función de manejo
        />
      </div>
    </div>
  );
};

export default InputField;
