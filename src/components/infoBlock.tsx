// Componente reutilizable para los bloques de información
export function InfoBlock({
  circleColor = "bg-white",
  lineHeight = "h-20",
  lineColor = "bg-white",
  linebottom = "-bottom-3",
  textColor = "text-white",
  text = "Null",
}) {
  return (
    <div className="relative">
      <div className="flex items-center gap-5">
        {/* Círculo con color dinámico */}
        <div className="relative">
          <div className={`w-10 h-10 rounded-full ${circleColor}`}></div>

          {/* Línea vertical sobrepuesta al círculo con altura y color dinámicos */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${linebottom} w-1 ${lineHeight} ${lineColor}`}
          ></div>
        </div>

        {/* Texto al lado del círculo */}
        <h1 className={`text-3xl ${textColor} font-bold`}>{text}</h1>
      </div>
    </div>
  );
}
