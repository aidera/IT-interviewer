export const getEnumKeys = (en: {}): number[] => {
  return (
    Object.keys(en).filter((v) => isNaN(Number(v))) as (keyof typeof en)[]
  ).map((key) => {
    return en[key];
  });
};
