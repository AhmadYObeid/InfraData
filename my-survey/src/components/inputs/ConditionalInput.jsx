export default function ConditionalInput({ label, value, onChange, show, error, placeholder }) {
  if (!show) return null;

  return (
    <div className="flex flex-col text-left mb-4">
      <label className={`font-semibold mb-1 ${error ? 'text-red-600' : 'text-gray-800'} dark:text-black`}>
        {label}
      </label>
      <input
        type="text"
        className={`w-full border ${error ? 'border-red-500' : 'border-gray-300'} rounded px-4 py-2 focus:ring-2 focus:ring-blue-500`}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
