import DateRangePicker from "@/components/ui/date-range-picker";
import { Input } from "@/components/ui/input";
import { subDays } from "date-fns";
import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";

export const Configuration = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const router = useRouter();
  const id = useId();
  const [search, setSearch] = useState<string>(
    searchParams.get("search") || ""
  );
  const [date, setDate] = useState<{ from: Date; to: Date }>({
    from: searchParams.get("from")
      ? new Date(searchParams.get("from")!)
      : subDays(new Date(), 3),
    to: searchParams.get("to") ? new Date(searchParams.get("to")!) : new Date(),
  });

  const handleSubmit = () => {
    if (search) searchParams.set("search", search);
    else searchParams.delete("search");
    if (date) {
      searchParams.set("from", date.from.toISOString());
      searchParams.set("to", date.to.toISOString());
    } else {
      searchParams.delete("from");
      searchParams.delete("to");
    }
    router.push(`?${searchParams.toString()}`);
  };

  return (
    <div className="flex flex-row gap-2 w-full">
      <div className="relative">
        <Input
          id={id}
          className="peer ps-9 pe-9"
          placeholder="Search..."
          type="search"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
        <button
          className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          onClick={handleSubmit}
        >
          <ArrowRightIcon size={16} aria-hidden="true" />
        </button>
      </div>
      <DateRangePicker
        date={date}
        setDate={(date) => {
          // @ts-ignore
          if (date) setDate(date);
        }}
      />
    </div>
  );
};
