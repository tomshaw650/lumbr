// take the ISOString and format it to a readable date (UK format)
const formatDate = (date: string) => {
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return dateFormatter.format(new Date(date));
};

export default formatDate;
