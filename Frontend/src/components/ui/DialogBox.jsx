import React, { useEffect, useState } from "react";

const DialogBoxModal = ({ isOpen, setIsOpen, children }) => {
  const [size, setSize] = useState({ width: 600, height: 400 });

  useEffect(() => {
    const updateSize = () => {
      const modalContent = document.getElementById("modal-content");
      if (modalContent) {
        setSize({
          width: Math.max(modalContent.scrollWidth, 400),
          height: Math.max(modalContent.scrollHeight, 400),
        });
      }
    };
    updateSize();
  }, [children]);

  if (!isOpen) return null;

  const handleClose = (e) => {
    if (e.target.id === "overlay") {
      setIsOpen(false);
    }
  };

  return (
    <div
      id="overlay"
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      onClick={handleClose}
    >
      <div
        id="modal-content"
        className="bg-white rounded-lg shadow-lg p-4 transition-all"
        style={{ width: size.width, height: size.height }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {children}
      </div>
    </div>
  );
};

export default DialogBoxModal;
