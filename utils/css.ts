export interface Dimensions {
  width: number;
  height: number;
}

export function getElementSizeById(id: string, defaults: Dimensions): Dimensions {
  if (typeof document !== 'undefined') {
    const el = document.getElementById(id);
    return {
      width: (el && el.offsetWidth) ?? defaults.width,
      height: (el && el.offsetHeight) ?? defaults.height,
    };
  }
  return defaults;
}
