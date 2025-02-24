import React, { createContext, useContext, useState } from "react";
import { motion } from "framer-motion";
import { X, MoreHorizontal } from "lucide-react";

// Context for managing dialog state
const DialogContext = createContext();

 const Dialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

// 🔹 Dialog Trigger (Button to open modal)
 const DialogTrigger = ({ children }) => {
  const { setIsOpen } = useContext(DialogContext);
  return (
    <button
      onClick={() => setIsOpen(true)}
      className="px-4 py-2 bg-blue-500 text-white rounded-md"
    >
      {children}
    </button>
  );
};

// 🔹 Dialog Content (Modal Box)
 const DialogContent = ({ title, description, children }) => {
  const { isOpen, setIsOpen } = useContext(DialogContext);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>

      {/* Dialog Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6"
      >
        {/* Header with More Options & Close */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <MoreHorizontal size={20} />
            </button>
            <DialogClose />
          </div>
        </div>

        {/* Description */}
        {description && <p className="text-gray-600 mt-2">{description}</p>}

        {/* Content */}
        <div className="mt-4">{children}</div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-2">
          <button className="px-4 py-2 bg-gray-200 rounded-md" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Confirm</button>
        </div>
      </motion.div>
    </div>
  );
};

// 🔹 Dialog Close (Button to close modal)
const DialogClose = () => {
  const { setIsOpen } = useContext(DialogContext);
  return (
    <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-gray-200">
      <X size={20} />
    </button>
  );
};

export  {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogClose,
  };
  
