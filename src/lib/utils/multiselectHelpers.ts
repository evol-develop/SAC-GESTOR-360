type Item = { value: string; label: string };

export const toggleSelectAll = (current: string[], items: Item[]) => {
  return current.length === items.length ? [] : items.map((item) => item.value);
};

export const toggleSelectItem = (current: string[], value: string) => {
  return current.includes(value)
    ? current.filter((v) => v !== value)
    : [...current, value];
};
