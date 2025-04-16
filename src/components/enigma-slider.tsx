import { cn } from "@/lib/utils";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";

export const EnigmaSlider = ({
  label,
  defaultValue = [5],
  value,
  onValueChange,
}: {
  label?: string;
  defaultValue?: number[];
  value?: number[];
  onValueChange?: (val: number[]) => void;
}) => {
  const max = 10;
  const skipInterval = 2; // Set to 1 to allow no text skipping
  const ticks = [...Array(max + 1)].map((_, i) => i);

  return (
    <div>
      {label && <Label>{label}</Label>}
      <Slider
        value={value}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        max={max}
        aria-label="Slider with ticks"
      />
      <span
        className="text-muted-foreground mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium"
        aria-hidden="true"
      >
        {ticks.map((_, i) => (
          <span
            key={i}
            className="flex w-0 flex-col items-center justify-center gap-2"
          >
            <span
              className={cn(
                "bg-muted-foreground/70 h-1 w-px",
                i % skipInterval !== 0 && "h-0.5"
              )}
            />
            <span className={cn(i % skipInterval !== 0 && "opacity-0")}>
              {i}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
};
