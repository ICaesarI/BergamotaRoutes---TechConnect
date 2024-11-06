import diamond from "@techconnect /src/img/diamond.svg";
import Image from "next/image";

export function Diamond() {
  return (
    <div className="flex gap-2 items-center text-4xl">
      <Image src={diamond} alt="Location logo" className="w-12 h-12" />
    </div>
  );
}
