import React from "react";

const NotificationCard: React.FC = () => {
  const totalErrors = 8; // Ejemplo de número de errores

  return (
    <div className="w-fit bg-[#f2f3f7] rounded-xl cursor-pointer transition-all ease-in-out duration-200 shadow-lg border border-[#f2f3f7] hover:bg-[#d3ddf1] hover:border-[#1677ff]">
      <div className="mt-5 mb-5 mx-7 flex gap-3">
        <div className="left">
          <div className="w-2.5 h-2.5 bg-red-500 my-1.5 rounded-full"></div>
        </div>
        <div className="right flex flex-col gap-5">
          <div className="text-wrap flex items-center w-full">
            <p className="font-medium text-gray-800 text-lg">
              Total de errores
            </p>
            <p className="text-red-500 font-bold text-lg ml-auto">
              {totalErrors}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
