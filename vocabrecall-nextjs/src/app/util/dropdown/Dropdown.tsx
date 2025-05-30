'use client';

import { useState, useRef } from 'react';
import useOnClickOutside from './useOnClickOutside';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any[];
  selected: string | number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelect: (value: any) => void;
}

import styles from './Dropdown.module.css';

export default function Dropdown({ options, selected, onSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className={styles.dropdown} ref={ dropdownRef }>
      <button onClick={toggleDropdown} className={styles.button}>
        {capitaliseFirst(selected) || ''}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`${styles.option} ${selected === option ? styles.selected : ''}`}
            >
              {capitaliseFirst(option)}
              {selected === option && <Check className={styles.checkIcon} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function capitaliseFirst(str: string | number): string {
  if(!str)return '';
  return str.toString().charAt(0).toUpperCase() + str.toString().slice(1);
}