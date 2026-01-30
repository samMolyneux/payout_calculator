export const calcNet: (inVal: number, outVal: number) => number = (
  inVal,
  outVal
) => {
  return outVal - inVal;
};

export const convertToPence: (input: number) => number = (input) =>
  Math.round(input * 100);

export const convertToPounds: (input: number) => string = (input) =>
  Number(input / 100).toFixed(2) || "";
