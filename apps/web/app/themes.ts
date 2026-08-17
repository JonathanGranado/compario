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
  { value: "cozy-witch-cafe", label: "Cozy Witch Cafe" },
  { value: "moonlit-cottage", label: "Moonlit Cottage" },
  { value: "autumn-stardust", label: "Autumn Stardust" },
];
