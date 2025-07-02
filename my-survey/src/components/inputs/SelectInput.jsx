export default function SelectInput({ label, value, onChange, error, options }) {
  return (
    <div className="flex flex-col text-left mb-4">
      <label className={`font-semibold mb-1 ${error ? 'text-red-600' : 'text-black'}`}>
        {label}
      </label>
      <select
        className={`w-full border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded px-4 py-2 focus:ring-2 focus:ring-blue-500 text-black`}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">-- Select --</option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
