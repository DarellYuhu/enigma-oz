"use client";

import { DatePicker } from "@/components/DatePicker";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useConfigStore from "../store/config-store";

const NetworkConfig = () => {
  const { networkDate, setNetworkDate, networkType, setNetworkType } =
    useConfigStore();
  return (
    <div className="flex justify-self-end gap-3">
      <ToggleGroup
        type="single"
        value={networkType}
        onValueChange={(value) =>
          value && setNetworkType(value as typeof networkType)
        }
      >
        <ToggleGroupItem value={"60"}>Weekly</ToggleGroupItem>
        <ToggleGroupItem value={"120"}>Monthly</ToggleGroupItem>
      </ToggleGroup>

      <DatePicker
        date={networkDate as Date}
        onDateChange={(date) => date && setNetworkDate(date)}
      />
    </div>
  );
};

export default NetworkConfig;
