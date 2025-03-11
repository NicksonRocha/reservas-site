import React, { useState } from "react";
import style from "./Dropdown.module.css";

const DropdownTime = ({ options = {}, placeholder, onOptionSelect }) => {
  const [isOpen, setIsOpen] = useState(false); 
  const [selectedOption, setSelectedOption] = useState(""); 

  

  const handleSelect = (optionId, optionName) => {
    setSelectedOption(optionName);
    onOptionSelect(optionId); 
    setIsOpen(false); 
    
  };

  return (
    <div className={style.dropdownContainer}>
      <div
        className={style.dropdownHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption || placeholder} 
      </div>
      {isOpen && (
        <div className={style.dropdownOptions}>
          {Object.entries(options).map(([optionName, optionValues]) => (
            <div
              key={optionValues[0].id}
              className={style.dropdownOption}
              onClick={() => handleSelect(optionValues[0].id, optionName)}
            >
              {optionName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownTime;
