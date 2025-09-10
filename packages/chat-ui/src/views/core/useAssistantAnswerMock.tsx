import * as React from 'react';
import { MessageSentParams } from '../../models';
import { generateRandomLoremIpsum, LoremIpsumSize } from '../../utils/stringUtils/generateLoremIpsum';

let stop = false;

const reasoningMock = `
**Logical Deduction**

Based on the provided information, the most reasonable conclusion is derived by analyzing facts and establishing logical connections between them. This method requires a sequential breakdown of the initial data, identifying key relationships among various elements of information, and formulating conclusions based on strict logic. Such an approach helps minimize the likelihood of errors caused by subjective assumptions or insufficient consideration of context.

**Comparative Analysis**

By evaluating different aspects and comparing similar cases, one can develop a balanced perspective to determine the most probable outcome. In comparative analysis, parallel situations are examined, their similarities and differences are identified, which allows for determining the critical factors for achieving a specific result. This method encourages learning from examples and helps uncover patterns in diverse data.

**Pattern Recognition**

Identifying trends and recurring structures allows for a well-founded evaluation, aiding in the formation of a reliable judgment. This approach involves analyzing data sequences and searching for common patterns, which may indicate underlying principles or trends. Pattern recognition is especially useful when processing large volumes of information, where repetitive elements help reveal essential factors.

**Risk and Benefit Assessment**

Weighing potential advantages and disadvantages provides a clear understanding of possible outcomes and their consequences. This analysis involves identifying all possible risks and benefits, evaluating their likelihood and significance. It allows for anticipating negative outcomes in advance and leveraging positive aspects to optimize decision-making.

**Contextual Interpretation**

Understanding the context in which the question is posed helps in providing a more relevant and substantial answer. The context may include historical, cultural, or technical aspects of the situation that influence the interpretation of the information. Considering these factors allows for a deeper understanding of the issue and the formation of a more precise and appropriate conclusion.

**Data-Driven Conclusion**

Using available data and previous examples ensures that reasoning is grounded in factual evidence. This approach involves gathering statistical data, analyzing reliable sources, and incorporating empirical observations. It ensures that conclusions are well-founded and reduces the risk of making decisions based solely on assumptions.

**Probability Assessment**

Evaluating the probability of various options leads to a well-founded conclusion that accounts for existing uncertainties. This method includes assessing the likelihood of different events using statistical models and scenario analysis. It helps form conclusions that reflect a realistic distribution of possible outcomes.

**Principle-Based Evaluation**

Applying general principles and established rules helps ensure a consistent and fair evaluation. This approach is based on fundamental norms, standards, and logical patterns that have stood the test of time. It contributes to developing objective conclusions while minimizing the influence of subjective factors and bias.

**Testing Hypothetical Scenarios**

Considering different hypothetical situations provides a broad perspective on possible outcomes and their consequences. This method involves modeling scenarios, analyzing the potential impact of each option, and evaluating the likelihood of their realization. Testing hypothetical scenarios helps prepare for unexpected changes and develop adaptive strategies.

**Neutral Synthesis**

Combining different viewpoints without bias ensures a balanced conclusion that objectively takes multiple factors into account. Neutral synthesis involves integrating data from various sources, thoroughly analyzing the presented arguments, and excluding subjective assessments. This allows for forming universal recommendations that are applicable across a wide range of situations.
`;

type TestParams = Partial<{ delay: number, chunkSize: number, loremIpsumSize: LoremIpsumSize }>;

export const useAssistantAnswerMock = (mockOptions?: Partial<{ delayTimeout: number, loremIpsumSize: LoremIpsumSize }>) => {

  const onUserMessageSent = React.useCallback(async (params: MessageSentParams) => {
    if (mockOptions?.delayTimeout) {
      await new Promise(resolve => setTimeout(resolve, mockOptions.delayTimeout));
    }

    const stream = streamGenerator();

    for await (const chunk of stream) {
      params.pushChunk(chunk);
    }

    params.onFinish();
  }, []);

  const streamGenerator = React.useCallback(async function* (
    text?: string,
    params?: TestParams
  ) {
    stop = false;
    if (!text) {
      text = generateRandomLoremIpsum(params?.loremIpsumSize ?? mockOptions?.loremIpsumSize ?? "medium");
    }

    const delay = params?.delay ?? 100;
    const chunkSize = params?.chunkSize ?? 30;
    let index = 0;
    while (index < text.length && !stop) {
      const chunk = text.slice(index, index + chunkSize);

      await new Promise(resolve => setTimeout(resolve, delay));
      yield chunk;
      index += chunkSize;
    }
  }, []);

  const reasoningGenerator = React.useCallback((params?: TestParams) => {
    const delay = params?.delay ?? 100;
    const chunkSize = params?.chunkSize ?? 8;

    const text = params?.loremIpsumSize
      ? generateRandomLoremIpsum(params.loremIpsumSize)
      : reasoningMock;

    return streamGenerator(text, { delay, chunkSize });
  }, []);

  const handleStopMessageStreaming = React.useCallback(() => {
    stop = true;
  }, []);

  const runStream = React.useCallback(async (pushChunkFn: (chunk: string) => void, params?: TestParams) => {
    const stream = streamGenerator(undefined, params);

    for await (const chunk of stream) {
      pushChunkFn(chunk);
    }
  }, [streamGenerator]);

  return { onUserMessageSent, handleStopMessageStreaming, streamGenerator, reasoningGenerator, runStream };
}
