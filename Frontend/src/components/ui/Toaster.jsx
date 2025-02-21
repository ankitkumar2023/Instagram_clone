import { useState } from "react";
import { X } from "lucide-react";

const Toast = ({ id, message, type, onClose }) => {
  return (
    <div
      className={`flex items-center gap-3 p-4 w-80 rounded-lg shadow-lg text-white transition-all duration-300 
      ${type === "success" ? "bg-green-600" : ""} 
      ${type === "error" ? "bg-red-600" : ""} 
      ${type === "info" ? "bg-blue-600" : ""}`}
    >
      <p className="flex-1">{message}</p>
      <button onClick={() => onClose(id)}>
        <X className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

const Toaster = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);

    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <>
      <div className="fixed top-5 right-5 space-y-3 z-50">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>

      {/* Buttons to trigger toasts for testing */}
      <div className="fixed bottom-10 left-10 flex gap-3">
        <button onClick={() => addToast("Success! 🎉", "success")} className="bg-green-600 text-white px-4 py-2 rounded-md">
          Success
        </button>
        <button onClick={() => addToast("Error occurred! ❌", "error")} className="bg-red-600 text-white px-4 py-2 rounded-md">
          Error
        </button>
        <button onClick={() => addToast("This is an info message! ℹ️", "info")} className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Info
        </button>
      </div>
    </>
  );
};

export default Toaster;
