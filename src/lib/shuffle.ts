import { CollectionQuestionAnswersT } from "../states/useQuestionAnswers";

export const shuffle = (questionAnswers: Array<CollectionQuestionAnswersT>) => {
  const returnArr = questionAnswers;
  for (let i = returnArr.length - 1, j = returnArr.length; i > 0; i--) {
    const randNum = Math.floor(Math.random() * (i - 0) + 0);
    const val1 = returnArr[randNum];
    const val2 = returnArr[i];
    returnArr.splice(randNum, 1, val2);
    returnArr.splice(i, 1, val1);
  }

  return returnArr;
};
