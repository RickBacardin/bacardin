import { cn } from "@/lib/utils";

interface CloseIconProps {
  className?: string;
  size?: number;
}

export const CloseIcon = ({ className, size = 54 }: CloseIconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-muted-foreground", className)}
    >
      <path
        d="M18 18L46 46M46 18L18 46"
        stroke="currentColor"
        strokeWidth="5.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
