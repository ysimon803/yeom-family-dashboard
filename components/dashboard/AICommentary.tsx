"use client";

type Props = {
  netWorth: number;
  investmentRatio: number;
  moveProgress: number;
  fiProgress: number;
};


export default function AICommentary({
  netWorth,
  investmentRatio,
  moveProgress,
  fiProgress,
}: Props) {


  const comments = [];


  if (netWorth > 500000) {

    comments.push(
      "현재 순자산 수준은 안정적인 성장 단계입니다."
    );

  } else {

    comments.push(
      "자산 축적 초기 단계로 투자 지속성이 중요합니다."
    );

  }


  if (investmentRatio > 0.5) {

    comments.push(
      "투자 자산 비중이 높아 장기 성장에 유리합니다."
    );

  } else {

    comments.push(
      "현금 및 투자 비율을 점검해 보세요."
    );

  }


  if (moveProgress >= 80) {

    comments.push(
      "2028년 주택 이동 목표가 매우 가까워졌습니다."
    );

  } else {

    comments.push(
      "주택 구매 목표를 위해 꾸준한 자금 축적이 필요합니다."
    );

  }


  if (fiProgress >= 50) {

    comments.push(
      "Financial Independence 진행률이 좋은 흐름입니다."
    );

  }


  return (

    <div className="rounded-2xl bg-white p-8 shadow">


      <h2 className="text-2xl font-bold">

        🤖 AI Financial Advisor

      </h2>


      <div className="mt-6 space-y-3">


        {comments.map((comment, index) => (

          <div
            key={index}
            className="rounded-xl bg-slate-100 p-4"
          >

            {comment}

          </div>

        ))}


      </div>


    </div>

  );

}