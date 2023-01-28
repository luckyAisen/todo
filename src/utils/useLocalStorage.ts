function parse(str: string) {
  let value;
  try {
    value = JSON.parse(str);
  } catch {
    value = null;
  }
  return value;
}

function stringify(obj: any) {
  let value;
  try {
    value = JSON.stringify(obj);
  } catch {
    value = null;
  }
  return value;
}

export default function useLocalStorage<T>() {
  function setItem(key: any, value: any) {
    value = stringify(value);
    window.localStorage.setItem(key, value);
  }

  function getItem<T>(key: any): T {
    let value = window.localStorage.getItem(key);
    if (value) {
      value = parse(value);
    }
    return value as unknown as T
  }

  return {
    setItem,
    getItem,
  };
}
