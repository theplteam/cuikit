import { MessageFeedbackTagType } from "@plteam/chat-ui";

const locale = {
    factuallyCorrect: 'Factually correct',
    easyToUnderstand: 'Easy to understand',
    informative: 'Informative',
    creativeInteresting: 'Creative / Interesting',
    wellFormatted: 'Well formatted',
    other: 'Other',
    offensiveUnsafe: 'Offensive / Unsafe',
    notFactuallyCorrect: 'Not factually correct',
    didntFollowInstructions: 'Didn\'t follow instructions',
    wrongLanguage: 'Wrong language',
    poorlyFormatted: 'Poorly formatted',
    genericBland: 'Generic / Bland'
  };

export const messageFeedbackLikeOptions: MessageFeedbackTagType[] = [
  {
    id: 1,
    label: locale.factuallyCorrect,
    value: 'factuallyCorrect',
  }, {
    id: 2,
    label: locale.easyToUnderstand,
    value: 'easyToUnderstand',
  }, {
    id: 3,
    label: locale.informative,
    value: 'informative'
  }, {
    id: 4,
    label: locale.creativeInteresting,
    value: 'creativeInteresting'
  }, {
    id: 5,
    label: locale.wellFormatted,
    value: 5
  }, {
    id: 6,
    label: locale.other,
    value: 'other'
  },
];

export const messageFeedbackDislikeOptions: MessageFeedbackTagType[] = [
  {
    id: 1,
    label: locale.offensiveUnsafe,
    value: 'offensiveUnsafe'
  },
  {
    id: 2,
    label: locale.notFactuallyCorrect,
    value: 'notFactuallyCorrect'
  },
  {
    id: 3,
    label: locale.didntFollowInstructions,
    value: 'didntFollowInstructions'
  },
  {
    id: 4,
    label: locale.wrongLanguage,
    value: 'wrongLanguage'
  },
  {
    id: 5,
    label: locale.poorlyFormatted,
    value: 'poorlyFormatted'
  },
  {
    id: 6,
    label: locale.genericBland,
    value: 'genericBland'
  }
];
