export const convertToDDMMYYYY = (date) => {
    let splitDate=date.split("-");
    const yy=splitDate[0];
    const mm=splitDate[1];
    const dd=splitDate[2];

    return `${dd}-${mm}-${yy}`;
}
