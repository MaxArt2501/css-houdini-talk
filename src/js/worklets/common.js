export function getOptionObject(props, prefix) {
  const map = {};
  props.forEach((value, key) => {
    const stringValue = value.toString();
    if (stringValue) {
      map[propToOption(key, prefix)] = stringValue;
    }
  });
  return map;
}

function propToOption(name, prefix) {
  // const start = `--` + (prefix ? prefix + '-' : '')
  const re = new RegExp(`^--${prefix ? prefix + '-' : ''}`);
  return name.replace(re, '').replace(/-[a-z]/g, m => m[1].toUpperCase());
}
