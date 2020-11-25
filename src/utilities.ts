export const debounceRequest = (
  request: Function,
  params: Array<any>,
  timeout: number,
): Promise<any> => {
  return new Promise((resolve, reject) =>
    setTimeout(
      () =>
        request(...params)
          .then((res: any) => resolve(res))
          .catch((err: Error) => reject(err)),
      timeout,
    ),
  );
};

export const capitalize = (value: string): string =>
  value
    .split(" ")
    .map((word: string): string => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export const padLeft = (n: string, length: number, z?: string): string => {
  z = z || "0";
  n = n + "";
  return n.length >= length ? n : new Array(length - n.length + 1).join(z) + n;
};

export const padRight = (n: string, length: number, z?: string): string => {
  z = z || "0";
  n = n + "";
  return n.length >= length ? n : n + new Array(length - n.length + 1).join(z);
};

export const getDataString = (func: string, arrVals: Array<any>): string => {
  let val = "";
  for (let i = 0; i < arrVals.length; i++) val += padLeft(arrVals[i], 64);
  const data = func + val;
  return data;
};

export const getNakedAddress = (address: string): string => address.toLowerCase().replace("0x", "");

export function isSuccessful(response: any) {
  return response.data && response.data.status !== "0";
}
