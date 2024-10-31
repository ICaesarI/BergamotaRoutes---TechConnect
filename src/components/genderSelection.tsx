const GenderSelection = ({ selectedGender, handleGenderSelect }) => (
  <div className="flex flex-col items-center justify-center mt-6">
    <h1 className="font-bold text-xl mb-4">Gender:</h1>
    <div className="flex gap-4">
      {["Male", "Female"].map((gender) => (
        <button
          key={gender}
          onClick={() => handleGenderSelect(gender)}
          className={`border p-3 rounded-lg transition-all duration-300 ${
            selectedGender === gender
              ? "bg-black text-white"
              : "bg-gray-main text-white"
          }`}
        >
          {gender}
        </button>
      ))}
    </div>
  </div>
);

export default GenderSelection;
