export const classNames = (...args: (string | undefined | boolean)[]) => {
  const result = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg) result.push(arg);
  }
  return result.join(" ");
};
