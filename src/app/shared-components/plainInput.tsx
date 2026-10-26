import { FieldProps, getIn } from "formik";

type Props = FieldProps & React.InputHTMLAttributes<HTMLInputElement>;

export default function PlainInput({ field, form, ...props }: Props) {
  const touched = getIn(form.touched, field.name);
  const error = touched && getIn(form.errors, field.name);

  return (
    <>
      <input
        {...field}
        {...props}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <div className="text-danger small mt-1">{String(error)}</div>}
    </>
  );
}
