'use client';
import React, {
  useState,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';

type DropdownItemProps = {
  onClick?: (...args: unknown[]) => void;
  className?: string;
};

interface ButtonDropdownProps {
  children: ReactNode; 
}

export default function ButtonDropdown({ children }: ButtonDropdownProps) {
  const [open, setOpen] = useState(false);
  const [positionUp, setPositionUp] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open || !buttonRef.current) return;
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = dropdownRef.current?.offsetHeight ?? 200;
    setPositionUp(buttonRect.bottom + dropdownHeight > viewportHeight);
  }, [open]);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 rounded hover:bg-gray-100"
        type="button"
      >
        <FiMoreHorizontal size={18} />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className={`absolute right-0 min-w-50 w-auto bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50
            ${positionUp ? 'bottom-full mb-2' : 'mt-2'}`}
        >
          {React.Children.map(children, (child) => {
            if (!React.isValidElement<DropdownItemProps>(child)) return child;

            const childProps = child.props;

            return React.cloneElement(child, {
              onClick: (...args: unknown[]) => {
                childProps.onClick?.(...args);
                setOpen(false);
              },
              className: `${childProps.className ?? ''} w-full text-left px-4 py-3 hover:bg-gray-50`,
            });
          })}
        </div>
      )}
    </div>
  );
}
