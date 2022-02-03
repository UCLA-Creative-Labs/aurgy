export interface Dimensions {
  width: number;
  height: number;
}

export function getElementSizeById(id: string, defaults: Dimensions): Dimensions {
  if (typeof document === 'undefined') {
    return defaults;
  }

  const el = document.getElementById(id);
  return {
    width: el?.offsetWidth ?? defaults.width,
    height: el?.offsetHeight ?? defaults.height,
  };
}
