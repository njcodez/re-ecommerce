"use client";
import { useState, useEffect, useRef } from 'react';

interface SelectWithSearchProps {
  options: { id: number; name: string; email: string }[];
  selectedValue: number | null;
  onChange: (value: number | null) => void;
}

const SelectWithSearch = ({ options, selectedValue, onChange }: SelectWithSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase()) ??
        option.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (id: number) => {
    onChange(id);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-2 w-full rounded-md border border-gray-300 p-2 text-left focus:border-indigo-500 focus:ring-indigo-500"
      >
        {selectedValue !== null
          ? options.find(option => option.id === selectedValue)?.name ?? 'Select a user'
          : 'Select a user'}
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border-b border-gray-300 p-2 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.map(option => (
              <li
                key={option.id}
                onClick={() => handleSelect(option.id)}
                className={`cursor-pointer p-2 hover:bg-gray-100 ${selectedValue === option.id ? 'bg-gray-200' : ''}`}
              >
                {option.name} ({option.email})
              </li>
            ))}
            {filteredOptions.length === 0 && (
              <li className="p-2 text-gray-500">No users found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelectWithSearch;
