import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Main colours */
        "schiphol-blue": "#141251",
        "afternoon-blue": "#1b60db",
        "seebuyfly-yellow": "#f9c900",

        /* Secondary colours */
        "morning-pink": "#aa3191",
        "lightmorning-pink": "#ff8fb2",
        "lightmorning-blue": "#94b0ea",
        "dusk-green": "#027e9b",
        "dusk-blue": "#25d7f4",
        "evening-pink": "#6552a8",
        "evening-lilac": "#d285d6",

        /* Greys */
        black: "#000",
        "grey-storm": "#706a8a",
        "grey-overcast": "#9491aa",
        "grey-broken": "#bfbdcc",
        "grey-scattered": "#eae9ee",
        "grey-few": "#f2f1f4",
        white: "#fff",

        /* Signal colours */
        "dark-red": "#d0021b",
        green: "#128a0b",
        "light-blue": "#eef6ff",
        "light-green": "#d0e8cf",
        "light-yellow": "#fdfbda",
      },

      /* Domain gradients */
      backgroundImage: {
        "gradient-flights": "linear-gradient(90deg, #a35bcd 0%, #1b60db 80%)",
        "gradient-parking": "linear-gradient(90deg, #d472bc 0%, #1b60db 80%)",
        "gradient-at-schiphol": "linear-gradient(90deg, #d472bc 0%, #1b60db 80%)",
        "gradient-more": "linear-gradient(90deg, #6892ea 0%, #1b60db 80%)",
        "gradient-privium": "linear-gradient(90deg, #027e9b 40%, #1b60db 90%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
