type CheckboxAnswerProps = {
  answer: string;
};

export const CheckboxAnswer = ({ answer }: CheckboxAnswerProps) => {
  let parsedAnswer;

  try {
    parsedAnswer = JSON.parse(answer);
  } catch {
    return <span>알 수 없는 오류 발생</span>;
  }

  return (
    <div>
      {parsedAnswer.length > 0 ? (
        <ul className="list-disc ml-5">
          {parsedAnswer.map((item: string, index: number) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <span>동의하지 않음</span>
      )}
    </div>
  );
};
