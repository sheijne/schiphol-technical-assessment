import type { HTMLProps } from "react";

export function ChevronDownIcon(props: HTMLProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentcolor"
        d="M18.2 8.6L12 14.7 5.8 8.6 4.4 10l7.6 7.5 7.6-7.5-1.4-1.4z"
      ></path>
    </svg>
  );
}
