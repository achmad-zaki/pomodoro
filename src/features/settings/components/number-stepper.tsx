import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiAddLine, RiSubtractLine } from "@remixicon/react";

interface NumberStepperProps {
  id?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function NumberStepper({
  id,
  value,
  min = 1,
  max = 180,
  step = 1,
  onChange,
  className,
}: NumberStepperProps) {
  const handleDecrement = () => {
    onChange(Math.max(min, value - step));
  };

  const handleIncrement = () => {
    onChange(Math.min(max, value + step));
  };

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={value <= min}
        onClick={handleDecrement}
        className="size-9 rounded-xl shrink-0 cursor-pointer text-muted-foreground hover:text-foreground hover:border-primary/50"
        title="Kurangi"
      >
        <RiSubtractLine className="size-4" />
      </Button>

      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value === 0 ? "" : value}
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChange(0);
            return;
          }
          const num = parseInt(raw, 10);
          if (!isNaN(num)) {
            onChange(num);
          }
        }}
        onBlur={() => {
          if (value < min) {
            onChange(min);
          } else if (value > max) {
            onChange(max);
          }
        }}
        className="text-center text-sm font-semibold h-9 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        disabled={value >= max}
        onClick={handleIncrement}
        className="size-9 rounded-xl shrink-0 cursor-pointer text-muted-foreground hover:text-foreground hover:border-primary/50"
        title="Tambah"
      >
        <RiAddLine className="size-4" />
      </Button>
    </div>
  );
}
