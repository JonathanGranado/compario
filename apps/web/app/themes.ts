export type ThemeOption =
  | "botanical"
  | "moonlight"
  | "sherbet"
  | "cozy-witch-cafe"
  | "moonlit-cottage"
  | "autumn-stardust";

export const themeOptions: ReadonlyArray<{
  value: ThemeOption;
  label: string;
}> = [
  { value: "botanical", label: "Botanical" },
  { value: "moonlight", label: "Moonlight" },
  { value: "sherbet", label: "Sherbet" },
  { value: "cozy-witch-cafe", label: "Warm Autumn Cafe" },
  { value: "moonlit-cottage", label: "Dark Enchanted Forest" },
  { value: "autumn-stardust", label: "Autumn Celestial" },
];
