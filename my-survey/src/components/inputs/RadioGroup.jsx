export default function RadioGroup({ label, options, value, onChange, error }) {
  return (
    <div className="flex flex-col text-left mb-8">
      <span className={`${error?'text-red-600 ':'text-black'} mb-6`}>
        {label}
      </span>
      <div className="flex flex-wrap gap-6">
        {options.map(opt => (
          <label key={opt} className="inline-flex items-center cursor-pointer text-black">
            <input
              type="radio"
              name={label}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1form-radio text-blue-600"
            />
            <span className="ml-2 font-small">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
