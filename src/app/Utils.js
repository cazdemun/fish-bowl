export const probability = n => !!n && Math.random() <= n;

export const randomInt = (mi, ma) => {
  const min = Math.ceil(mi);
  const max = Math.floor(ma);
  return Math.floor(Math.random() * (max - min)) + min;
}

export const dateToString = d => {
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);

  const h = new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "numeric"
  }).format(d);

  return `${da}-${mo}-${ye} ${h}`;
};

export const tryCatchPromise = (tag, fn) => new Promise((resolve, reject) => {
  try {
    resolve(fn())
  } catch {
    reject(tag)
  }
})
