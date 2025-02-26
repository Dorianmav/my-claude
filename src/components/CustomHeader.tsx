import React from "react";
import { Button } from "./ui/button";

interface CustomHeaderProps {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const CustomHeader = ({ isShow, setIsShow }: CustomHeaderProps) => {
    const handleShow = () => {
        setIsShow(!isShow);
    }
  return (
    <div className="w-full flex justify-between items-center p-4 bg-white shadow-sm">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Chat with Mia Claude
        </h1>
        <p className="text-slate-600">Initialisation du projet avec TS React et Tailwind</p>
      </div>
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={handleShow}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default CustomHeader;
