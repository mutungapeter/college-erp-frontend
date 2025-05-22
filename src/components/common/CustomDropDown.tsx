import ClickOutside from "@/hooks/ClickOutside";
import { ChangeEvent, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
interface CustomDropdownOption {
  label: string;
  value: string | number;
}

interface CustomDropdownProps {
  name: string;
  value: string;
  options: CustomDropdownOption[];
  onChange: (event: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
  defaultValue?: string;
  loading?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  name,
  value,
  options,
  onChange,
  defaultValue,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const allOptions = [{ label: defaultValue, value: "" }, ...options];

  const filteredOptions = allOptions.filter((option) =>
    (option.label || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedLabel =
    options.find((opt) => String(opt.value) === String(value))?.label ||
    defaultValue;

  return (
    <ClickOutside onClick={() => setIsOpen(false)}>
      <div className="relative w-full md:w-auto min-w-[250px]">
        <div
          className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-2 cursor-pointer w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="truncate text-sm text-gray-800">
            {selectedLabel}
          </span>
          <BsChevronDown size={16} className="text-gray-400" />
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-2 p-3 shadow-lg">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary   text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {loading ? (
              <div className="p-2 text-center text-gray-500 text-sm">
                Loading...
              </div>
            ) : (
              <ul className="max-h-40 overflow-y-auto mt-2 text-sm">
                {filteredOptions.map((option, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      onChange({
                        target: {
                          name,
                          value: String(option.value),
                        },
                      } as ChangeEvent<HTMLSelectElement>);
                      setIsOpen(false);
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </ClickOutside>
  );
};
export default CustomDropdown;
