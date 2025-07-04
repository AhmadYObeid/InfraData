// src/components/inputs/SelectInput.jsx
import { useState, useRef, useEffect } from 'react';

export default function SelectInput({ label, value, onChange, options, error }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const noLabel = !label;
  return (
    <div
      ref={ref}
      className={`${noLabel
        ? 'inline-block align-middle relative'
        : 'mb-10 text-left font-sans relative'}`}
    >
      {label && (
        <label className={`block mb-2 ${error ? 'text-red-600' : 'text-black'}`}>
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        onClick={() => setOpen(o => !o)}
        className={`
          w-full
          bg-white
          border ${error ? 'border-red-500' : 'border-gray-400'}
          rounded-xl px-4 py-2 flex justify-between items-center cursor-pointer
          shadow-sm hover:shadow-md transition
        `}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || '— Select —'}
        </span>
        <svg
          className={`w-5 h-5 text-gray-600 transform transition-transform ${open ? 'rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L10 9.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0110 12z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Options */}
      {open && (
        <ul
          className="
            absolute z-20 mt-1 w-full
            bg-[#edecea]
            border border-gray-300
            rounded-xl shadow-lg
            max-h-60 overflow-auto
          "
        >
          {options.map(opt => (
            <li
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`
                relative       /* container for absolute check */
                pl-8           /* indent text to line up */
                px-4 py-2
                text-sm cursor-pointer select-none
                ${opt === value
                  ? 'bg-gray-300 text-gray-900'
                  : 'text-gray-800 hover:bg-gray-200'
                }
              `}
            >
              {opt === value && (
                <svg
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 00-1.414-1.414L7 12.172l-2.293-2.293a1
                       1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l8-8z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{opt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

