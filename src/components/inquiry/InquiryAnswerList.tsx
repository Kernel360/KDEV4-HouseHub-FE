import React from 'react';
import InquiryAnswerCard from './InquiryAnswerCard';
import { AnswerDto } from '../../types/inquiry';

const InquiryAnswerList: React.FC<{ answers: AnswerDto[] }> = ({ answers }) => {
  return (
    <div className="space-y-4">
      {answers.map((ans, index) => (
        <InquiryAnswerCard key={index} answer={ans} />
      ))}
    </div>
  );
};

export default InquiryAnswerList;
