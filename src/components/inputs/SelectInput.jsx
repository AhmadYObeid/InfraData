// src/components/inputs/SelectInput.jsx

export default function SelectInput({ label, value, onChange, options, error }) {
  return (
    <div className="flex flex-col text-left mb-10">
      <label className="block text-gray-700 font-medium mb-2">{label}</label>
      <select
        className={`w-full border border-gray-300 rounded px-4 py-2 mt-1 ${error ? 'border-red-500' : ''}`}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">-- Select --</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

