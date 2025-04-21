import { TagType } from 'types';
import { CHAT_LOCALE } from '../../../../locale/enEN';

export const messageFeedbackLikeOptions: TagType[] = [
  {
    id: 1,
    label: CHAT_LOCALE.messageFeedbackLikeOptions.factuallyCorrect,
    value: 'factuallyCorrect',
  }, {
    id: 2,
    label: CHAT_LOCALE.messageFeedbackLikeOptions.easyToUnderstand,
    value: 'easyToUnderstand',
  }, {
    id: 3,
    label: CHAT_LOCALE.messageFeedbackLikeOptions.informative,
    value: 'informative'
  }, {
    id: 4,
    label: CHAT_LOCALE.messageFeedbackLikeOptions.creativeInteresting,
    value: 'creativeInteresting'
  }, {
    id: 5,
    label: CHAT_LOCALE.messageFeedbackLikeOptions.wellFormatted,
    value: 5
  }, {
    id: 6,
    label: CHAT_LOCALE.messageFeedbackLikeOptions.other,
    value: 'other'
  },
];

export const messageFeedbackDislikeOptions: TagType[] = [
  {
    id: 1,
    label: CHAT_LOCALE.messageFeedbackDislikeOptions.offensiveUnsafe,
    value: 'offensiveUnsafe'
  },
  {
    id: 2,
    label: CHAT_LOCALE.messageFeedbackDislikeOptions.notFactuallyCorrect,
    value: 'notFactuallyCorrect'
  },
  {
    id: 3,
    label: CHAT_LOCALE.messageFeedbackDislikeOptions.didntFollowInstructions,
    value: 'didntFollowInstructions'
  },
  {
    id: 4,
    label: CHAT_LOCALE.messageFeedbackDislikeOptions.wrongLanguage,
    value: 'wrongLanguage'
  },
  {
    id: 5,
    label: CHAT_LOCALE.messageFeedbackDislikeOptions.poorlyFormatted,
    value: 'poorlyFormatted'
  },
  {
    id: 6,
    label: CHAT_LOCALE.messageFeedbackDislikeOptions.genericBland,
    value: 'genericBland'
  }
];
