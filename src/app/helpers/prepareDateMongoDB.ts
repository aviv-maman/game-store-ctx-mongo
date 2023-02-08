export const prepareDateToMongoDB = (date: string) => {
  const newFormattedDate = date.replace(/\//g, '-');
  const [day, month, year] = newFormattedDate.split('-');
  return `${month}-${day}-${year}`;
};
