import { Wave } from "@/components/loading-ui/wave";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <Wave className="h-10 w-14 text-primary" />
    </div>
  );
}
