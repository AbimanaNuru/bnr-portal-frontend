import { Button } from "@/src/design-system/components/button/Button";
import InputTextField from "@/src/design-system/components/input/InputTextField";
import { Search, X } from "lucide-react";
import React, { useState } from "react";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (value: string) => void;
  onClear: () => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearch,
  onClear,
  placeholder = "Search for everything",
}) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(inputValue);
  };

  const handleClearClick = () => {
    setInputValue("");
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text-secondary">Search</label>
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <InputTextField
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            inputProps={{ onKeyDown: handleKeyPress }}
          />
        </div>
        <Button
          onClick={handleSearchClick}
          className="h-[48px] px-4 rounded-xl bg-primary hover:bg-primary/90 text-white transition-colors shrink-0"
        >
          <Search className="h-5 w-5" />
        </Button>
        {inputValue && (
          <Button
            variant="destructive"
            onClick={handleClearClick}
            className="h-[48px] w-[48px] rounded-xl flex items-center justify-center shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
