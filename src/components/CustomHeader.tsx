import React from "react";

interface CustomHeaderProps {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const CustomHeader = ({ isShow, setIsShow }: CustomHeaderProps) => {
    const handleShow = () => {
        setIsShow(!isShow);
    }
  return (
    <div className="w-full flex justify-between p-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold justify-center">
          Chat with Mia Claude
        </h1>
        <p>Initialisation du projet avec TS React et Tailwind</p>
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-2 rounded flex items-center justify-center"
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
        </button>
      </div>
    </div>
  );
};

export default CustomHeader;
