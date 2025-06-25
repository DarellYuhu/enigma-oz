"use client";

import { DatePicker } from "@/components/DatePicker";
import useHashtagStore from "../store/hashtag-config-store";
import Window from "@/components/Window";

const HashtagConfig = () => {
  const { date, setDate, setWindow } = useHashtagStore();

  return (
    <div className="flex justify-end space-x-4">
      <Window
        options={[
          { label: "2d", value: "2" },
          { label: "7d", value: "7" },
        ]}
        defaultValue="3"
        onValueChange={(value) => setWindow(parseInt(value))}
      />
      <DatePicker
        date={date}
        onDateChange={(value) => value && setDate(value)}
      />
    </div>
  );
};

export default HashtagConfig;
