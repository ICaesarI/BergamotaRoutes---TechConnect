import Image from "next/image";
import cameraIcon from "@techconnect /src/img/cameraIcon.png";

const PhotoUpload = ({ profileImage, handleImageUpload }) => (
  <div className="flex items-center gap-4">
    <label className="flex items-center p-3 border border-gray-500 rounded-full w-12 h-12 opacity-75 hover:opacity-100 hover:border-blue-500 cursor-pointer transition-opacity duration-300">
      {profileImage ? (
        <Image
          src={profileImage}
          alt="Uploaded Image"
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
      ) : (
        <Image src={cameraIcon} alt="Camera Icon" width={30} height={30} />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </label>
    <h1 className="font-bold text-xl">Upload a photo</h1>
  </div>
);

export default PhotoUpload;
