export const getStage = (stage: any) => {
  if (stage === "development") {
    return "development";
  }
  if (stage === "staging") {
    return "staging";
  }
  if (stage === "production") {
    return "production";
  }
  return "development";
};
