import { parseAddressAnswer } from '../../utils/isAddressAnswer';

type AddressAnswerProps = {
  answer: string;
};

export const AddressAnswer = ({ answer }: AddressAnswerProps) => {
  const parsed = parseAddressAnswer(answer);

  if (!parsed) return <span>{answer}</span>;

  return (
    <div className="flex flex-col gap-1">
      <div>도로명: {parsed.roadAddress}</div>
      <div>지번: {parsed.jibunAddress}</div>
      <div>상세 주소: {parsed.detailAddress}</div>
      <div>우편번호: {parsed.zipCode}</div>
    </div>
  );
};
