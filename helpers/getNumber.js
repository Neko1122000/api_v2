exports.getNumberIfPossitive = async (str) => {
    const value = await Number(str);
    //console.log(str);
    if (isNaN(value)) return NaN;
    if (value <= 0) return NaN;
    return value;
}