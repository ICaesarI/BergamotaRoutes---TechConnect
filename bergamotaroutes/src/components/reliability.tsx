import money from "@techconnect /src/img/money.svg";
import Image from "next/image";

export function Money() {
  return (
    <div className="flex gap-2 items-center text-4xl">
      <Image src={money} alt="Location logo" className="w-12 h-12" />
    </div>
  );
}
