export default () => {
  let store: Record<string, string> = {};

  const getItem = (key: string) => store[key] || null;
  const setItem = (key: string, value: string): void => {
    store[key] = value;
  };

  const removeItem = (key: string): void => {
    delete store[key];
  };

  const clear = () => {
    store = {};
  };

  return { getItem, setItem, removeItem, clear };
};
