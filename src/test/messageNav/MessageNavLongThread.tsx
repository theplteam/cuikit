import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

type Turn = {
  question: string;
  answer: string;
};

/**
 * The main branch of the conversation — one rib per question in the navigation rail.
 */
const mainTurns: Turn[] = [
  {
    question: "How should I structure a new React project?",
    answer: `Start with a flat structure and let it grow into folders when a pattern actually repeats.

- **Feature folders** beat type folders once you pass ~20 components
- Keep shared primitives in one place, everything else next to its usage
- Co-locate tests and styles with the component they belong to

Premature structure is the most common thing teams regret after six months.`,
  },
  {
    question: "What is the difference between server and client components?",
    answer: `Server components render on the server and never ship their code to the browser. Client components hydrate and can hold state.

The practical rule: default to server components, and opt into client components only when you need interactivity, browser APIs, or effects. Every \`useState\` is a boundary decision.`,
  },
  {
    question: "How do I choose a state management library?",
    answer: `Ask what kind of state you actually have:

- **Server cache** — use a data-fetching library, not a store
- **URL state** — keep it in the URL, it is free persistence and sharing
- **Local UI state** — component state is almost always enough
- **Genuinely global state** — this is the only case a store earns its keep

Most apps that reach for a global store are really solving a server-cache problem.`,
  },
  {
    question: "When should I add a database index?",
    answer: `Add one when a query you run often filters or sorts on a column and the planner shows a sequential scan.

Indexes are not free — they cost write throughput and disk. A useful heuristic is to index the columns in your \`WHERE\` and \`ORDER BY\` clauses for your ten most frequent queries, then measure again.`,
  },
  {
    question: "How do I design a caching layer?",
    answer: `Decide on invalidation before you decide on storage. Caching is easy; knowing when the cached value is wrong is the hard part.

- **Time-based** — simplest, accepts staleness for a fixed window
- **Event-based** — precise, but every writer must remember to invalidate
- **Versioned keys** — invalidation becomes a key change, nothing to purge

Start with short TTLs and only add explicit invalidation where staleness actually hurts.`,
  },
  {
    question: "What belongs in an integration test versus a unit test?",
    answer: `Unit tests pin down logic that is hard to reason about — parsers, reducers, pricing rules. Integration tests prove the wiring works.

If a test breaks every time you rename something but never catches a real bug, it was testing structure instead of behavior.`,
  },
  {
    question: "How should I handle errors in an API?",
    answer: `Separate expected failures from unexpected ones.

Expected failures (validation, not found, conflicts) are part of your contract and deserve typed, documented responses. Unexpected failures should return a generic message, log the detail server-side, and never leak internals to the caller.`,
  },
  {
    question: "What is the right way to paginate a large list?",
    answer: `Cursor pagination for anything that changes while users read it.

Offset pagination (\`LIMIT/OFFSET\`) is easy but shifts rows under the reader when items are inserted or deleted, so people see duplicates and gaps. A cursor anchored to a stable sort key avoids that and stays fast at depth.`,
  },
  {
    question: "How do I keep bundle size under control?",
    answer: `Measure first — most bundle problems are two or three dependencies, not a thousand small ones.

- Check what a dependency costs before adding it
- Prefer libraries that tree-shake
- Split on routes before splitting on components
- Watch for a heavy locale or icon set sneaking in through a transitive import`,
  },
  {
    question: "When is a monorepo worth the setup cost?",
    answer: `When packages ship together and change together. If two codebases require coordinated releases, the monorepo removes real pain.

If they release independently and rarely touch each other, you are buying tooling complexity for no benefit.`,
  },
  {
    question: "How do I make code review faster?",
    answer: `Smaller pull requests, mostly. A 200-line change gets a real review; a 2000-line change gets a rubber stamp.

Beyond size: say what the change is for in the description, mark the parts you are unsure about, and let a formatter handle every style question so reviewers never spend attention on them.`,
  },
  {
    question: "What should I log in production?",
    answer: `Log decisions and boundaries, not steps.

- Every inbound request with its outcome and duration
- Every outbound call to something you do not control
- Every branch where the system chose between meaningfully different paths

Logging each line of a function produces volume without insight.`,
  },
  {
    question: "How do I approach a performance problem I cannot reproduce?",
    answer: `Instrument before you guess. Add timing around the suspect boundaries and ship it — production is the only environment with the real data shape and the real concurrency.

Unreproducible problems are usually about data volume, cold caches, or contention, and none of those exist on your laptop.`,
  },
  {
    question: "What makes a good on-call runbook?",
    answer: `It should be readable at 3am by someone who did not write the service.

Lead with symptoms, not architecture. For each alert: what it means, what to check first, what the safe mitigation is, and who to escalate to. Anything requiring judgment should say so explicitly instead of pretending there is a script.`,
  },
  {
    question: "How do I decide between fixing and rewriting?",
    answer: `Rewrites are worth it when the *model* is wrong, not when the code is ugly.

Ugly code with a correct model can be refactored incrementally and keeps working the whole time. A wrong model means every fix fights the design — that is the signal that starting over may actually be cheaper.`,
  },
  {
    question: "What is the last thing to check before launch?",
    answer: `That you can undo it.

Rollback path, feature flag, database migration that works in both directions, and someone awake who knows how to trigger all three. Everything else about a launch is recoverable if you can get back to the previous state quickly.`,
  },
];

/**
 * Alternative continuations, keyed by the index of the main turn they replace.
 * Each one is a branch you can switch to with the pagination arrows under a user message.
 */
const branchTurns: Record<number, Turn[]> = {
  3: [
    {
      question: "Actually, let's talk about query planning instead.",
      answer: `The planner picks a strategy from table statistics, so stale statistics are a common cause of a plan that suddenly gets worse.

Read the plan before changing anything — the difference between a nested loop and a hash join usually explains the whole regression.`,
    },
    {
      question: "How do I read an execution plan without drowning in it?",
      answer: `Read it bottom-up and look at two numbers: rows estimated versus rows returned.

Where those diverge badly is where the planner was working from a wrong assumption, and that node is almost always the real problem.`,
    },
  ],
  8: [
    {
      question: "Let me change direction — how do I speed up the build?",
      answer: `Find out whether you are bound by type checking, bundling, or tests. They have completely different fixes and teams often optimize the wrong one.

Caching between CI runs usually beats any config tweak.`,
    },
    {
      question: "Is it worth running type checking in parallel with tests?",
      answer: `Yes, if they are independent. The wall-clock win is real and the cost is one extra CI job.

The exception is when your tests need generated types, in which case ordering matters more than parallelism.`,
    },
  ],
  12: [
    {
      question: "Different question: how should we structure the incident review?",
      answer: `Timeline first, judgment second. Write down what happened and when, with no interpretation, then discuss.

Mixing the two makes people argue about the story instead of fixing the system.`,
    },
    {
      question: "How do we keep those reviews blameless in practice?",
      answer: `Ask what made the wrong action look correct at the time. That question moves attention to the missing guardrail rather than the person who pressed the button.

If the answer is "nothing, they were careless", the system still let carelessness reach production.`,
    },
  ],
};

const buildMessages = () => {
  const messages: Thread['messages'] = [];
  let parentId: string | undefined = undefined;

  mainTurns.forEach((turn, index) => {
    // Alternatives are declared before the main turn, so the long branch stays the default view
    const alternatives = branchTurns[index];

    if (alternatives) {
      let branchParentId = parentId;

      alternatives.forEach((alternative, alternativeIndex) => {
        const userId = `branch-${index}-user-${alternativeIndex}`;
        const assistantId = `branch-${index}-assistant-${alternativeIndex}`;

        messages.push({ id: userId, parentId: branchParentId, role: 'user', content: alternative.question });
        messages.push({ id: assistantId, parentId: userId, role: 'assistant', content: alternative.answer });

        branchParentId = assistantId;
      });
    }

    const userId = `user-${index}`;
    const assistantId = `assistant-${index}`;

    messages.push({ id: userId, parentId, role: 'user', content: turn.question });
    messages.push({ id: assistantId, parentId: userId, role: 'assistant', content: turn.answer });

    parentId = assistantId;
  });

  return messages;
};

const MessageNavLongThread: React.FC = () => {
  const [threads] = React.useState<Thread[]>(() => [
    {
      id: "message-nav-thread",
      title: "Long engineering thread",
      date: "2024-11-16 08:07:54",
      messages: buildMessages(),
    },
  ]);

  const { onUserMessageSent, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableMessageNav
        enableBranches
        initialThread={threads[0]}
        threads={threads}
        handleStopMessageStreaming={handleStopMessageStreaming}
        onUserMessageSent={onUserMessageSent}
      />
    </Box>
  );
}

export default MessageNavLongThread;
