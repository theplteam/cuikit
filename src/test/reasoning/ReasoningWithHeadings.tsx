import * as React from "react";
import {
  ChatPage,
  Thread, useChatApiRef, MessageSentParams, ChatApiRef,
  useAssistantAnswerMock,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';

const thinkingText = `
** Breaking Down Quantum Concepts **

I'm now zeroing in on simplification. The goal is to distill the core quantum computing principles to a high-schooler without losing crucial accuracy. The plan involves using relatable analogies and avoiding jargon as much as possible, focusing on the basics of superposition, entanglement, and quantum gates. This approach should help create an accessible framework for the student.

** Defining Core Quantum Ideas **

I'm now zeroing in on simplification. The goal is to distill the core quantum computing principles to a high-schooler without losing crucial accuracy. The plan involves using relatable analogies and avoiding jargon as much as possible, focusing on the basics of superposition, entanglement, and quantum gates. This approach should help create an accessible framework for the student.

The next step involves breaking down "basic principles of quantum computing." Defining qubits, superposition, entanglement, and measurement are my primary focus. Classical bit comparison will set the stage for qubits. I'm prioritizing clear explanations and relatable analogies to clarify each principle. The final structure should be logical.

** Outlining Qubit Properties **

I've been working on structuring the explanation. My focus is on clarity and flow, beginning with a direct comparison between classical and quantum computing. I'm now fleshing out the qubit properties by using analogies to visualize concepts like superposition and entanglement. These analogies are aimed at being accessible, and avoiding jargon where possible.

** Clarifying Key Quantum Features **

I'm now focusing on a logical framework. I'm prioritizing clarity. I'll start by providing a contrast between classical and quantum computing. I aim to use analogies to explain superposition, entanglement, and measurement. My goal is to use the "spinning coin" and "magic coin" analogies. I will also incorporate the concept of interference.

** Outlining the Quantum Basics **

I've been mapping out the structure. I'm focusing on defining the key elements like qubits, superposition, entanglement, and measurement. I plan to use analogies to clarify these concepts. I plan to start by outlining the differences between classical and quantum computing, emphasizing qubits. The plan is to present these ideas logically.

** Crafting the Core Explanation **

My focus has shifted to the 'meat' of the explanation. I've broken down the central concepts - qubits, superposition, entanglement, and measurement - and am crafting relatable analogies. The "spinning coin" and "magic gloves" are key. I aim to build a logical progression, starting with a classical-quantum comparison and ending with a glimpse into quantum applications, maintaining the high-schooler's perspective. I will also incorporate appropriate emojis to boost engagement.

** Crafting the Introduction **

My focus has now shifted to the introduction. I'm building a simple and relatable comparison, setting the stage for the core concepts. The objective is to make the differences between classical and quantum computers instantly clear, using the familiar concepts of bits and qubits. The goal is to hook the high-schooler's attention, and prepare them for more complex concepts. I am focused on the "spinning coin" analogy.`;

const answerText = `
Of course! Imagine a regular computer as a series of light switches. Each switch can either be **ON** (representing a 1) or **OFF** (representing a 0). This is called a **bit**. All the amazing things your phone or laptop do are just based on manipulating billions of these simple on/off switches.

A quantum computer works on a completely different and mind-bending level. Here are its three core principles. 💡

***

## 1. Qubits and Superposition 🪙

Instead of a simple on/off switch, a quantum computer uses something called a **qubit**.

Think of a qubit not as a light switch, but as a **spinning coin**. While the coin is spinning, is it heads or tails? It's not definitively either one; it's in a state of *both* possibilities at the same time. This "both-at-once" state is called **superposition**.

* A classical **bit** is either a 0 or a 1.
* A **qubit** can be a 0, a 1, or in a superposition of both 0 and 1.

Only when you stop the coin (a process called **measurement**) does it land on a definite state: either heads (1) or tails (0). This ability to hold multiple values simultaneously allows quantum computers to process a massive amount of information at once. A few qubits can hold more information than millions of classical bits.


***

## 2. Entanglement ⚛️

This is what Einstein famously called "spooky action at a distance," and it's one of the strangest ideas in science.

Imagine you have two of our "magic" spinning coins. If they are **entangled**, their fates are linked, no matter how far apart they are. If you stop one coin and it lands on heads, you will *instantly* know that the other coin, even if it's on the other side of the galaxy, has landed on tails.

In quantum computing, this means the states of entangled qubits are perfectly correlated. Measuring one qubit gives you immediate information about the other. This powerful connection allows for creating complex computational states and running algorithms in ways that are impossible for classical computers.

***

## 3. Interference 🌊

So, how does a quantum computer use superposition and entanglement to get the right answer? It uses a principle called **quantum interference**.

Think of the waves in a pond. When two wave crests meet, they combine to make a bigger wave (**constructive interference**). When a crest meets a trough, they cancel each other out (**destructive interference**).

A quantum algorithm is designed to explore many possible solutions to a problem at once (thanks to superposition). The algorithm then cleverly uses interference to make the paths leading to the *wrong* answers cancel each other out, while the paths leading to the *right* answer reinforce each other.

When you finally measure the qubits at the end of the calculation, the probability of them collapsing into the correct answer has been massively amplified.

## So, What's the Point?

Quantum computers won't replace your laptop for browsing the internet or writing essays. Instead, they are designed to solve specific, enormously complex problems that are impossible for even the most powerful supercomputers today. These include:

* **Drug Discovery:** Simulating molecules to create new medicines.
* **Materials Science:** Designing new materials with incredible properties.
* **Financial Modeling:** Optimizing complex financial systems.
* **Cryptography:** Breaking current encryption codes (but also creating new, un-breakable ones!).

In short, quantum computers use the weird rules of the quantum world—superposition, entanglement, and interference—to explore a vast landscape of possibilities simultaneously, allowing them to find solutions to problems that classical computers could never solve in a human lifetime.`;

const SendMessageRow: React.FC<{ apiRef: React.RefObject<ChatApiRef> }> = ({ apiRef }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const onClick = async () => {
    setIsLoading(true);
    await apiRef.current?.sendUserMessage('Run test');
    setIsLoading(false);
  };
  return (
    <Box width="100%" display="flex" justifyContent="center">
      <Button
        disabled={isLoading}
        variant="contained"
        sx={{ width: "min(70%, 300px)" }}
        onClick={onClick}
      >
        {"Send test Message\r"}
      </Button>
    </Box>
  );
}

const App: React.FC = () => {

  const [threads] = React.useState<Thread[]>([
    {
      id: "test-thread",
      title: "Reasoning test",
      messages: [
        {
          role: "user",
          content: "Hello!",
        },
        {
          role: "assistant",
          content: "Hello! Click the \"Send Message\" button to test the reasoning visualization.\n\nThinking will be divided into sections with headers.",
        },
      ],
    },
  ]);

  const { streamGenerator } = useAssistantAnswerMock()

  const onUserMessageSent = async (params: MessageSentParams) => {
    await (new Promise((resolve) => setTimeout(resolve, 1000)));
    const streamThinking = streamGenerator(thinkingText, { chunkSize: 50 });

    for await (const part of streamThinking) {
      params.reasoning.pushChunk(part);
    }

    const streamBody = streamGenerator(answerText, { chunkSize: 40 });

    for await (const part of streamBody) {
      params.pushChunk(part);
    }
  }

  const apiRef = useChatApiRef();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableReasoning
        initialThread={threads[0]}
        threads={threads}
        apiRef={apiRef}
        slots={{
          messageRowInner: SendMessageRow,
        }}
        slotProps={{
          messageRowInner: { apiRef },
        }}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default App;
