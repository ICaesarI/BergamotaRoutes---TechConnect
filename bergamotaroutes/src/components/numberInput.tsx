import { useState } from "react";

const NumberInput = () => {
  const [values, setValues] = useState(["", "", "", ""]); // Estado para los cuatro inputs

  const handleChange = (index, e) => {
    const newNumbers = [...values];
    newNumbers[index] = e.target.value; // Actualiza el valor del input

    setValues(newNumbers); // Actualiza el estado

    // Mueve el foco al siguiente input automáticamente
    if (e.target.value.length === 1 && index < values.length - 1) {
      document.getElementById(`input-${index + 1}`)?.focus(); // Usar comillas invertidas para interpolación
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      {values.map((value, index) => (
        <div key={index} className="flex flex-col items-center">
          <input
            id={`input-${index}`} // Asignar un id único para cada input
            type="text"
            value={value}
            onChange={(e) => handleChange(index, e)}
            className="w-12 h-15 text-center text-5xl border-b-2 border-gray-600 focus:outline-none focus:border-blue-500"
            maxLength={1} // Limitar a un solo carácter
          />
        </div>
      ))}
    </div>
  );
};

export default NumberInput;
