import tuerca from "@techconnect /src/img/tuerca.svg";
import Image from "next/image";

export function Tuerca() {
  return (
    <div className="flex gap-2 items-center text-4xl">
      <Image src={tuerca} alt="Location logo" className="w-12 h-12" />
    </div>
  );
}
