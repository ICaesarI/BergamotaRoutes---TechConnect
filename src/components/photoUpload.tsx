import Image from "next/image";
import cameraIcon from "@techconnect /src/img/cameraIcon.png"
import { useState } from "react";

const PhotoUpload = ({ onImageChange }) => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string; // Formato base64
      setProfileImage(base64Image);
      if (onImageChange) {
        onImageChange(base64Image); // Notifica al componente padre
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4">
      <label className="relative flex items-center justify-center border border-gray-500 rounded-full w-24 h-24 overflow-hidden opacity-75 hover:opacity-100 hover:border-blue-500 cursor-pointer transition-opacity duration-300">
        {profileImage ? (
          <img
            src={profileImage}
            alt="Uploaded Image"
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={cameraIcon}
            alt="Camera Icon"
            width={40}
            height={40}
          />
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
};

export default PhotoUpload;
