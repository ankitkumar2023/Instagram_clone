import React from "react";
import { User } from "lucide-react";

const Avatar = ({ src, alt, name = "User", size = "40px" }) => {
  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden rounded-full bg-gray-200 text-white font-bold"
      style={{ width: size, height: size, fontSize: `calc(${size} / 2.5)` }}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className="w-full h-full object-cover rounded-full"
        />
      ) : name.trim() ? (
        <span className="uppercase">{getInitials(name)}</span>
      ) : (
        <User className="w-2/3 h-2/3 text-gray-500" />
      )}
    </div>
  );
};

export default Avatar;
