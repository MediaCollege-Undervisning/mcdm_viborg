export const mdcPath = (type) => {
  switch (type) {
    case "pdf":
      return ["mdc_viborg", "pdfs"];
    case "review":
      return ["legekrogen", "reviews"];
    default:
      throw new Error("Unsupported legekrogen type");
  }
};
