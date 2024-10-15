import Image from "next/image";

import maps from "@techconnect /src/img/maps.jpeg";

export default function Home(){
    return(
        <div className="flex justify-center items-center h-screen relative m-5">
            <Image src={maps} alt="Mapa maps" className="w-500 h-500 m-auto border-4 border-black" />
            <div className="absolute inset-0 flex items-center justify-start m-20">
                <div className="flex flex-col items-start border-4 border-black m-20">
                    <h1 className="font-bold text-xl font-bold bg-white bg-opacity-70 p-4 max-w-xs"> Convert long links into short and accessible links instantly.</h1>
                    <p className="text-white text-lg font-semibold bg-black bg-opacity-50 p-2 max-w-xs">Simplify the logistics of your deliveries with our route shortening solutions. At
                    BergamotRoutes, we make your routes more direct and profitable, guaranteeing
                    faster and more precise delivery. Optimize your routes and improve your parcel
                    service today!
                    </p>
                </div>
            </div>
            
        </div>
    )
}