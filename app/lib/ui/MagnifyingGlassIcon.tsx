import { HTMLProps } from "react";

export function MagnifyingGlassIcon(props: HTMLProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      preserveAspectRatio="xMidYMid meet"
      {...props}
    >
      <path
        fill="currentcolor"
        d="M19.8,18.4l-4.2-4.2a6.5,6.5,0,1,0-9.1,1.5,6.7,6.7,0,0,0,3.9,1.2,6.5,6.5,0,0,0,3.8-1.3l4.2,4.2A1,1,0,1,0,20,18.6Zm-13.9-8a4.5,4.5,0,0,1,9,0,4.6,4.6,0,0,1-4.5,4.5A4.5,4.5,0,0,1,5.9,10.4Z"
      />
    </svg>
  );
}
