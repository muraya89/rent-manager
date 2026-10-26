"use client";
import { useRouter } from "next/navigation";

interface EmptyActionProps {
  title: string;
  route: string;
  children?: React.ReactNode;
}

export default function EmptyState({ title, children, route }: EmptyActionProps) {
  const router = useRouter();
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-12 text-center w-100">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-indigo-100 text-xl font-light text-[#4437d8] cursor-pointer" onClick={()=> router.push(route)}>
        +
      </div>
      <p className="font-semibold text-slate-700">
        Your {title.toLowerCase()} will appear here.
      </p>
      {/* <p className="mt-2 text-sm text-slate-500">
        This route is ready for its data table and create form.
      </p> */}
      <div>{children}</div>
    </div>
  );
}
