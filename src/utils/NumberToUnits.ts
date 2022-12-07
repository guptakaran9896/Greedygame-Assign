const convertToInternationalCurrencySystem = (labelValue:number) => {

    // Nine Zeroes for Billions
    return Math.abs(labelValue) >= 1.0e+9

    ? (Math.abs(labelValue) / 1.0e+9).toFixed(2) + "B"
    // Six Zeroes for Millions 
    : Math.abs(labelValue) >= 1.0e+6

    ? (Math.abs(labelValue) / 1.0e+6).toFixed(2) + "M"
    // Three Zeroes for Thousands
    : Math.abs(labelValue) >= 1.0e+3

    ? (Math.abs(labelValue) / 1.0e+3).toFixed(2) + "K"

    : Math.abs(labelValue);

};

export default convertToInternationalCurrencySystem;

