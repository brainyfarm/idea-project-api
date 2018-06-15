const convertToPrecise = value =>
  value % 1 === 0 ?
    (Math.round(value * 10) / 10).toFixed(1) :
      value;

export default convertToPrecise;
