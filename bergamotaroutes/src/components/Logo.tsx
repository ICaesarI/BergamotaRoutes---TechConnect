import locationLogo from "@techconnect /src/img/locationLogo.svg";
import Image from "next/image";

export function Logo() {
  return (
    <div className="flex gap-2 items-center text-4xl">
      <Image src={locationLogo} alt="Location logo" className="w-12 h-12" />
      <h1 className="font-bold">BergamotaRoutes</h1>
    </div>
  );
}
