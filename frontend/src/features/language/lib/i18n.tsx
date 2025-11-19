import React from "react";

/**
 * Interpolates {{placeholders}} in a string with string values.
 * @param template - the string from your dictionary
 * @param vars - object mapping placeholder names to string values
 * @returns interpolated string
 */
export const interpolateString = (
  template: string,
  vars: Record<string, string> = {}
) => {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => vars[key] ?? "");
};

/**
 * Interpolates {{placeholders}} in a string with React nodes.
 * @param template - the string from your dictionary
 * @param vars - object mapping placeholder names to React nodes
 * @returns array of React nodes
 */
export const interpolateReact = (
  template: string,
  vars: Record<string, React.ReactNode> = {}
) => {
  const parts = template.split(/({{\s*\w+\s*}})/g).filter(Boolean);

  return parts.map((part, i) => {
    const match = part.match(/{{\s*(\w+)\s*}}/);
    if (match) {
      const key = match[1];
      return <React.Fragment key={i}>{vars[key]}</React.Fragment>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};
