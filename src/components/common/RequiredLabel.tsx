export const RequiredLabel = ({ label }: { label: string }) => (
  <label className="text-sm text-gray-700">
    {label} <span className="text-red-500 font-bold">*</span>
  </label>
);