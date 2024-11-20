import RoutingImage from "@techconnect /src/img/mapRoutingImage.webp";
import Image from "next/image";
export function Card() {
  return (
    <div className="flex justify-center items-center relative w-full h-screen rounded overflow-hidden m-3">
      <div className="card w-3/4 h-full rounded-[20px] bg-[#f5f5f5] relative p-7 border-2 border-[#c3c6ce] transition ease-out duration-500 overflow-visible hover:border-[#008bf8] hover:shadow-[0_4px_18px_rgba(0,0,0,0.25)]">
        <Image
          src={RoutingImage}
          alt="Routing Image"
          layout="fill"
          className="object-cover rounded-[20px]"
        />
        <div className="absolute inset-0 flex justify-center items-center text-white font-bold text-center before:absolute before:inset-0 before:bg-green-bold before:bg-opacity-50 p-5">
          <div className="card-details text-black h-full gap-2 grid place-content-center z-50 text-white">
            <p className="text-title text-white text-5xl font-bold">HELLO!</p>
            <p className="text-body text-3xl">
              Remember, every kilometer brings you closer to your goals. Have a
              great trip and a productive day at work!
            </p>
          </div>
          <button className="card-button transform translate-x-[-50%] translate-y-[125%] w-[60%] rounded-lg border-none bg-[#008bf8] text-white text-base py-2 px-4 absolute left-1/2 bottom-0 opacity-0 transition ease-out duration-300 hover:translate-y-[50%] hover:opacity-100">
            More info
          </button>
        </div>
      </div>
    </div>
  );
}
