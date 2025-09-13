export const checkEmptyForm = <T extends Record<string, string | null>>(
  obj: T
) => {
  return Object.values(obj).some((value) => value === "" || value === null);
};
