export const isAddressQuestion = (questionContent: string) => questionContent.includes('주소');

export const parseAddressAnswer = (answer: string) => {
  try {
    const parsed = JSON.parse(answer);
    return parsed;
  } catch {
    return null;
  }
};
