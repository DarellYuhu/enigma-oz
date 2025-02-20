"use client";

import { DatePicker } from "@/components/DatePicker";
import useGraphConfigStore from "../store/graph-config-store";
import Window from "@/components/Window";
import { useConfigStore } from "../store/config-store";

export default function GraphFilter() {
  const { setWindow } = useConfigStore();
  const { to, setTo } = useGraphConfigStore();

  return (
    <div className="flex flex-row gap-4 justify-end">
      <Window
        options={[
          { label: "3d", value: "3" },
          { label: "7d", value: "7" },
        ]}
        defaultValue="3"
        onValueChange={(value) => setWindow(parseInt(value))}
      />
      <DatePicker date={to} onDateChange={setTo} />
    </div>
  );
}
