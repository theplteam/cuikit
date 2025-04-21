import * as React from 'react';

export type QuestionTemplateType = {
  title: string;
  message: string;
};

export const useQuestionTemplates = (): QuestionTemplateType[] => {
  return React.useMemo(() => ([
    [
      {
        title: "Impact of New Game Releases",
        message: "What are the most anticipated mobile game releases, and how are they expected to impact the market in terms of downloads and revenue?"
      },
      {
        title: "Trends in Mobile Monetization",
        message: "What new monetization strategies are being adopted in the mobile gaming industry, and how are they performing compared to traditional models like in-app purchases and ads?"
      },
      {
        title: "Growth in Cloud Gaming Adoption",
        message: "How is the adoption of cloud gaming on mobile devices progressing, and what are the challenges and opportunities identified in the latest reports?"
      },
      {
        title: "Esports Integration in Mobile Gaming",
        message: "How are mobile games integrating with the esports ecosystem, and what impact is this having on player engagement and the competitive gaming scene?"
      },
    ],
    [
      {
        title: "Влияние новых релизов игр",
        message: "Какие мобильные игры являются самыми ожидаемыми, и как они могут повлиять на рынок с точки зрения загрузок и доходов?"
      },
      {
        title: "Тренды в монетизации мобильных игр",
        message: "Какие новые стратегии монетизации внедряются в индустрии мобильных игр, и как они работают по сравнению с традиционными моделями, такими как внутриигровые покупки и реклама?"
      },
      {
        title: "Рост популярности облачного гейминга",
        message: "Как продвигается внедрение облачного гейминга на мобильных устройствах, и какие вызовы и возможности отмечены в последних отчетах?"
      },
      {
        title: "Интеграция киберспорта в мобильные игры",
        message: "Как мобильные игры интегрируются в экосистему киберспорта, и какое влияние это оказывает на вовлеченность игроков и развитие соревновательной сцены?"
      },
    ]
  ][0]), []);
}
