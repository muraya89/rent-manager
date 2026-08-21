import { Button, Input, InputGroup, InputGroupText } from "reactstrap";
import { Icon } from "./dashboard-icon";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onAddTenant: () => void;
  onOpenMenu: () => void;
};
export function DashboardHeader({
  query,
  onQueryChange,
  onAddTenant,
  onOpenMenu,
}: Props) {
  return (
    <header className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
      <Button
        color="link"
        onClick={onOpenMenu}
        className="mobile-menu-button grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white p-0 text-slate-600 shadow-sm"
        aria-label="Open navigation"
      >
        <Icon name="grid" size={19} />
      </Button>
      <InputGroup className="hidden max-w-sm rounded-xl shadow-sm sm:flex">
        <InputGroupText className="border-slate-200 bg-white text-slate-400">
          <Icon name="search" size={18} />
        </InputGroupText>
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          className="border-slate-200 border-l-0 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-200 focus:shadow-none"
          placeholder="Search tenants, properties..."
        />
      </InputGroup>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <button
          className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm"
          aria-label="Notifications"
        >
          <Icon name="bell" size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
        <Button
          onClick={onAddTenant}
          color="primary"
          className="inline-flex items-center gap-2 rounded-xl border-0 bg-[#4437d8] px-3 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 sm:px-4"
        >
          <Icon name="plus" size={18} />
          <span className="hidden sm:inline">Add tenant</span>
        </Button>
      </div>
    </header>
  );
}
