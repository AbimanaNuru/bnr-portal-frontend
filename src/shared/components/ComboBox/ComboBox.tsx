"use client";

import { ChevronDown, ChevronUp, Search } from "lucide-react";
import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Option = {
  label: string;
  value: string;
};

type DropdownFieldProps = {
  label: string;
  options: Option[];
  register: any;
  name: string;
  error?: string;
  value?: string;
  onChange?: (e: { target: { name: string; value: string } }) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  labelClassName?: string;
};

const DropdownField = ({
  label,
  options,
  register,
  name,
  error,
  value = "",
  onChange,
  required = false,
  placeholder = `Select ${label}`,
  className = "",
  labelClassName = "",
}: DropdownFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    let rawOptions = options;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      rawOptions = options.filter((opt) => opt.label.toLowerCase().includes(query));
    }

    // Deduplicate array by `value` to eliminate duplicate key warnings & misbehavior
    const seen = new Set<string>();
    const deduplicated: Option[] = [];

    for (const opt of rawOptions) {
      if (!seen.has(opt.value)) {
        seen.add(opt.value);
        deduplicated.push(opt);
      }
      // Performance optimization: limit rendered items to 100 to prevent browser lag with large datasets
      if (deduplicated.length >= 100) break;
    }

    return deduplicated;
  }, [options, searchQuery]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          setIsOpen(true);
          setHighlightedIndex(0);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchQuery("");
          setHighlightedIndex(-1);
          buttonRef.current?.focus();
          break;
        case "Tab":
          setIsOpen(false);
          setSearchQuery("");
          setHighlightedIndex(-1);
          break;
      }
    },
    [isOpen, filteredOptions, highlightedIndex]
  );

  const handleSelect = (option: Option) => {
    const syntheticEvent = { target: { name, value: option.value } };
    if (onChange) {
      onChange(syntheticEvent);
    } else {
      register(name).onChange(syntheticEvent);
    }
    setIsOpen(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
    buttonRef.current?.focus();
  };

  // Auto-focus search input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={dropdownRef}>
      {/* Label */}
      <label
        htmlFor={`${name}-button`}
        className={`block text-sm font-medium ${labelClassName || "text-text-secondary"}`}
      >
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>

      {/* Trigger Button */}
      <button
        id={`${name}-button`}
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${name}-listbox`}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`
          w-full flex items-center justify-between
          px-4 py-3 rounded-xl border text-sm text-left
          bg-bg-card
          border-border
          focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary
          transition-all duration-200
          ${error ? "border-error focus:border-error focus:ring-error/40" : ""}
          ${isOpen ? "border-primary ring-2 ring-primary/40" : ""}
        `}
      >
        <span
          className={`truncate ${selectedOption
            ? "text-text-primary"
            : "text-text-muted"
            }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
        ) : (
          <ChevronDown className="h-4 w-4 text-text-muted flex-shrink-0 ml-2" />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          id={`${name}-listbox`}
          role="listbox"
          aria-labelledby={`${name}-button`}
          className="absolute z-50 mt-1 w-full bg-bg-card rounded-xl shadow-xl border border-border overflow-hidden"
        >
          {/* Search */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={`Search ${label}...`}
                className="w-full pl-8 pr-4 py-2 text-sm rounded-lg border border-border bg-bg-elevated text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-text-muted text-center">
                No results found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm transition-colors duration-100
                    ${index === highlightedIndex
                      ? "bg-primary/10 text-primary"
                      : option.value === value
                        ? "bg-primary/5 text-primary font-medium"
                        : "text-text-primary hover:bg-bg-hover"
                    }
                  `}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Hidden input for react-hook-form */}
      <input type="hidden" {...register(name)} value={value} />

      {error && (
        <p className="text-error text-xs flex items-center gap-1 mt-1">
          <span className="inline-block w-1 h-1 rounded-full bg-error" />
          {error}
        </p>
      )}
    </div>
  );
};

export default DropdownField;