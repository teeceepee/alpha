
// A simple string hash method from:
// https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
// s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
export function stringHash (key: string): number {
  let hash: number = 0
  if (key.length === 0) {
    return hash
  }

  for (let i = 0; i < key.length; i++) {
    const char: number = key.charCodeAt(i)
    hash = 31 * hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  return hash
}

// https://ruby-china.org/topics/32549
// https://github.com/ruby/ruby/blob/e3cfb1f3ca9ab0ef4980e4e3cf983323da9a1846/st.c#L823
export function pseudoRandomProbing (bucket: number, capacity: number): number {
  const a = 5
  const c = 1
  return (a * bucket + c) % capacity
}

export function linearProbing (bucket: number, capacity: number): number {
  return (bucket + 1) % capacity
}
