import Image from "next/image";
import boxPackage from "@techconnect /src/img/boxPackage.svg";
import qR from "@techconnect /src/img/qR.svg";

export default function Scan() {
  return (
    // Div General
    <div className="main-container flex flex-col">
      {/* Div superior */}
      <div className=" flex flex-col justify-center items-center bg-white">
        <h1 className="text-3xl font-bold">Routes</h1>
        <h1 className="text-4xl text-gray-400 font-bold">
          Scan or manually enter the product code
        </h1>
      </div>
      <div className="flex">
        {/* Primer div inferior */}
        <div className="w-1/2 bg-white p-16">
          <div className="p-4 bg-white flex justify-center items-center">
            <Image src={qR} alt="QR" />
            <h1 className="text-center text-3xl ml-2 font-bold">Scan</h1>
          </div>
          <div>
            <h1 className="text-2xl mt-6 mx-16 font-bold">Insert Code</h1>
            <input
              id="codeInput"
              placeholder="Escriba aquí su código..."
              type="text"
              className="w-52 mx-16 p-2 rounded-lg"
            />
            <button className="w-52 mx-16 bg-black-main text-sm text-white rounded-lg my-1 py-1 px-2">
              Insert
            </button>
          </div>
        </div>

        {/* Segundo div inferior */}
        <div className="w-1/2 bg-white p-4 flex flex-col">
          {/* Div de el package list */}
          <div className="bg-black-main rounded-lg p-4 flex flex-col h-64">
            <div className="">
              <h1 className="text-center text-white font-bold text-2xl">
                Package List
              </h1>
            </div>

            <div className="flex flex-col bg-black-main h-64 w-128 mx-auto overflow-y-auto p-2">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center p-2 mt-2">
                  <Image
                    src={boxPackage}
                    alt="Box Package"
                    className="w-7 h-7"
                  />
                  <h3 className="ml-2 text-xs text-white text-center">
                    #1 Calle Gabriel Ramos Millan 25, Col Americana, Americana,
                    44160 Guadalajara, Jal. Total Kilometers 10.3KM ID PAQUETE
                    #1123123 #5434634 #6585685
                  </h3>
                </div>
                <div className="flex items-center p-2">
                  <Image
                    src={boxPackage}
                    alt="Box Package"
                    className="w-7 h-7"
                  />
                  <h3 className="ml-2 text-xs text-white text-center">
                    #2 Avenida de los Ocotillos 45, Colonia La Luz, 44220
                    Guadalajara, Jal. Total Kilometers 15.8KM ID PAQUETE
                    #9876543 #1234567 #7654321
                  </h3>
                </div>
                <div className="flex items-center p-2">
                  <Image
                    src={boxPackage}
                    alt="Box Package"
                    className="w-7 h-7"
                  />
                  <h3 className="ml-2 text-xs text-white text-center">
                    #2 Avenida de los Ocotillos 45, Colonia La Luz, 44220
                    Guadalajara, Jal. Total Kilometers 15.8KM ID PAQUETE
                    #9876543 #1234567 #7654321
                  </h3>
                </div>
                <div className="flex items-center p-2">
                  <Image
                    src={boxPackage}
                    alt="Box Package"
                    className="w-7 h-7"
                  />
                  <h3 className="ml-2 text-xs text-white text-center">
                    #2 Avenida de los Ocotillos 45, Colonia La Luz, 44220
                    Guadalajara, Jal. Total Kilometers 15.8KM ID PAQUETE
                    #9876543 #1234567 #7654321
                  </h3>
                </div>
                <div className="flex items-center p-2">
                  <Image
                    src={boxPackage}
                    alt="Box Package"
                    className="w-7 h-7"
                  />
                  <h3 className="ml-2 text-xs text-white text-center">
                    #2 Avenida de los Ocotillos 45, Colonia La Luz, 44220
                    Guadalajara, Jal. Total Kilometers 15.8KM ID PAQUETE
                    #9876543 #1234567 #7654321
                  </h3>
                </div>
                <div className="flex items-center p-2">
                  <Image
                    src={boxPackage}
                    alt="Box Package"
                    className="w-7 h-7"
                  />
                  <h3 className="ml-2 text-xs text-white text-center">
                    #2 Avenida de los Ocotillos 45, Colonia La Luz, 44220
                    Guadalajara, Jal. Total Kilometers 15.8KM ID PAQUETE
                    #9876543 #1234567 #7654321
                  </h3>
                </div>
              </div>
            </div>
          </div>
          {/* Div del boton */}
          <div className="flex justify-end">
            <button className="mw-1/2 bg-black-main text-sm text-white rounded-lg my-1 py-1 px-2">
              Go to Drive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
