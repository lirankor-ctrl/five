type ClassValue = string | number | false | null | undefined;

/** Tiny classname joiner — concatenates truthy values with a single space. */
export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
