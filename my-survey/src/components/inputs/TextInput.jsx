export default function TextInput({ label, value, onChange, error, placeholder, type = 'text', min, max }) {
  return (
    <div className="flex flex-col text-left mb-10">
      <label className={`mb-2 ${error?'text-red-600':'text-black'}`}>
        {label}
      </label>
      <input
        type={type}
        min={min}
        max={max}
        className={`w-full mt-4 border ${error ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 mt-1 focus:ring-2 focus:ring-blue-500`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
