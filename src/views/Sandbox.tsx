import * as React from "react";
import {
  ChatPage,
  useAssistantAnswerMock,
  Thread, MessageSentParams, useChatApiRef,
} from "@plteam/chat-ui";
import Box from "@mui/material/Box";

const text = `
The user is asking me to list the main events in the game "Garden Affairs" and how they are monetized. I need to go through the article dataset and identify the main events and their monetization methods.

Let me search for all events in the dataset and analyze their monetization mechanisms:

1. **Jazz & Juice Pack offer** (ID: 583649)
   - This is an offer rather than an event, consisting of two deals to purchase premium currency, boosters, and unlimited lives.

2. **Challenge: Pool Party** (ID: 583647)
   - Event mechanic where players complete 7 levels on first attempt to share 10,000 premium currency units.
   - Monetization: Indirectly monetized through potential premium currency purchase if players fail and want to try again.

3. **Mini Boat Race event** (ID: 583646)
   - Competition between 5 random opponents to complete 15 new game levels as quickly as possible.
   - Rewards include unlimited lives and boosters.
   - Monetization: Indirectly through potential booster purchases to progress faster.

4. **Boom or Bust event** (ID: 583645)
   - Players complete levels and activate Bomb bonus elements, with doubled rewards for hard levels and tripled for super hard levels.
   - Total of 20 rewards with premium currency, boosters, and decoration as final reward.
   - Monetization: Indirectly through potential purchases to help activate more bomb bonuses.

5. **Special Offer promotion** (ID: 583630)
   - Offer to purchase a bundle with premium currency, unlimited lives, unlimited boosters, and regular boosters for real money.

6. **Event: Juice Splash** (ID: 581928)
   - Park Master mechanic board game where landing on specific tiles grants cocktails.
   - Rewards for achieving cocktail collection goals.
   - Monetization: Indirectly through potential purchases in the Park Master mechanic.

7. **Juice Pack Promotion** (ID: 581925)
   - Offer with a deal available for real money, providing vouchers and dice for the Park Master mechanic.

8. **Paper Plane Frenzy event** (ID: 581923)
   - Competition to collect points (paper airplanes) from Pinwheel bonus on levels.
   - More points for hard and super hard levels.
   - Unlimited lives for 1 hour as a gift at start.
   - Monetization: Indirectly through potential booster purchases to activate more Pinwheel bonuses.

9. **Beach Exploration tournament event** (ID: 581271)
   - Tournament based on number of shells collected in mini-games in Park Master mode.
   - Rewards based on player ranking.
   - Additional rewards for collecting specified number of shells.
   - Monetization: Indirectly through potential purchases in Park Master mode.

10. **Offer with the possibility to extend the event** (ID: 580676)
    - Offer to extend Blossom Tea Time event for 3 days with x3 multiplier for event currency.
    - Directly monetized through purchase price of $2.99.

11. **Furniture Gift Pack offer** (ID: 580675)
    - Offer to purchase a bundle with premium currency, unlimited boosters, regular boosters, unlimited lives, and unique decoration.

12. **Team Event Road Trip Adventure** (ID: 580666)
    - Team members complete levels and collect gasoline canisters.
    - Rewards for collecting canisters together.
    - Top team members receive additional rewards.
    - Monetization: Indirectly through potential premium currency or booster purchases to collect more canisters.

13. **Sky Sailing event** (ID: 580665)
    - Complete levels in a row without losing faster than opponents.
    - Rewards only for winner who completed levels fastest.
    - Monetization: Indirectly through potential booster purchases to complete levels faster.

14. **Floral Fantasy Event** (ID: 580664)
    - Collect red elements (flowers) during levels.
    - 25 tasks with increasing goals.
    - Rewards include premium currency, boosters, and decoration.
    - Monetization: Indirectly through potential premium currency or booster purchases to complete more tasks.

15. **Easter Mansion season pass event** (ID: 574927)
    - 30 seasonal levels with free and paid rewards.
    - Paid pass costs $4.99 with benefits like increased maximum lives, avatar frame, etc.
    - Monetization: Directly through paid pass purchase.

16. **Offer: Spring Prelude Sale** (ID: 570466 & 570465)
    - Offer with deals for premium currency, boosters, unlimited lives, and season pass event points.
    - One deal includes paid pass for seasonal pass event.
    - Directly monetized through real money purchase.

17. **Blossom Tea Time event** (ID: 568714)
    - Players receive event currency for winning levels, used to buy decorations.
    - Rewards for installing a certain number of decorations.
    - Monetization: Indirectly through potential premium currency purchases to get more event currency.

18. **Gifts & Goodies event with a seasonal pass** (ID: 211799)
    - Event with 15 seasonal levels, free and paid rewards.
    - Paid pass costs $2.99 or $4.99 with various benefits.
    - Rechargeable Booster Maker bonus for paid pass holders.
    - Monetization: Directly through paid pass purchase.

19. **Catching Waves event** (ID: 196333)
    - Collect points (balls) in 1 hour from Bomb bonus activation.
    - Winner receives boosters as reward.
    - Monetization: Indirectly through potential premium currency or booster purchases to activate more Bomb bonuses.

20. **Treat Yourself! offer** (ID: 190680)
    - Offer with customizable deal composition for real money.
    - Choices include premium currency, season pass points, boosters, decorations, character outfits, etc.

21. **Firework Fever event** (ID: 295194)
    - Complete levels to earn fireworks.
    - Rewards for collecting a certain number of fireworks.
    - Monetization: Indirectly through potential premium currency or booster purchases to complete more levels.

22. **Florists League clan tournament** (ID: 291591)
    - Teams compete to collect more flowers than other teams.
    - Top 5 teams and top 3 members receive rewards.
    - Monetization: Indirectly through potential premium currency or booster purchases to collect more flowers.

23. **Weekly Contest Challenge** (ID: 302831)
    - Weekly contest between 10 players to complete the highest number of new levels.
    - Top 3 winners receive boosters.
    - Monetization: Indirectly through potential premium currency or booster purchases to complete more levels.

24. **Runway Dream event** (ID: 464765)
    - Merge-2 mechanic board where players complete tasks of creating items.
    - Points for completing tasks, which give rewards including puzzle pieces.
    - Event store for purchasing items for premium currency.
    - Event energy system that can be purchased.
    - Monetization: Directly through event store purchases and event energy purchases.

25. **Nellie's Mojo event** (ID: 163536)
    - Complete new levels in a row without losing to get free boosters.
    - 18 steps with increasing rewards.
    - Character colors a picture as steps are completed.
    - Monetization: Indirectly through potential premium currency or booster purchases to avoid losing streak.

26. **Triple Points event** (ID: 152744)
    - Triple event currency when completing levels on first attempt.
    - Monetization: Indirectly through potential premium currency or booster purchases to ensure first-attempt completion.

Let me now organize these events by their primary monetization method:

**Directly Monetized Events (Paid Pass/Purchase Required):**
1. Easter Mansion season pass event ($4.99 pass)
2. Gifts & Goodies event with a seasonal pass ($2.99 or $4.99 pass)
3. Offer with the possibility to extend the event ($2.99)
4. Runway Dream event (event store and energy purchases)

**Indirectly Monetized Events (Encourage Premium Currency/Booster Purchases):**
1. Challenge: Pool Party
2. Mini Boat Race event
3. Boom or Bust event
4. Event: Juice Splash
5. Paper Plane Frenzy event
6. Beach Exploration tournament event
7. Team Event Road Trip Adventure
8. Sky Sailing event
9. Floral Fantasy Event
10. Blossom Tea Time event
11. Catching Waves event
12. Firework Fever event
13. Florists League clan tournament
14. Weekly Contest Challenge
15. Nellie's Mojo event
16. Triple Points event

Now I'll format my response with links and images as requested. I'll focus on the main events (not offers) and their monetization methods.
`;

const threadsData: Thread[] = Array(500).fill(0)
  .map((_, i) => ({
    id: `test-thread-${i}`,
    title: "Welcome message",
    messages: [
      {
        role: "user",
        content: `Hello ${i}`,
      },
      {
        role: "assistant",
        content: "Hello there! How can I assist you today?",
      },
    ],
  }))

const App: React.FC = () => {
  const [threads] = React.useState<Thread[]>(threadsData);
  const [thread, setThread] = React.useState<Thread | undefined>();
  const [loading, setLoading] = React.useState(true);

  const apiRef = useChatApiRef();

  const { streamGenerator, handleStopMessageStreaming } =
    useAssistantAnswerMock();

  React.useEffect(() => {
    setTimeout(() => {
      console.log('set thread')
      setThread(threads[0]);
      setLoading(false);
    }, 3000);
  });

  React.useEffect(() => {
    console.log(thread?.id, apiRef.current?.getCurrentThread()?.id)
    if (thread && apiRef.current?.getCurrentThread()?.id !== thread.id) {
      apiRef.current?.onChangeThread(thread.id);
    }
  }, [thread?.id]);

  const onSent = async (params: MessageSentParams) => {
    const stream1 = streamGenerator(text, { chunkSize: 300 });

    params.reasoning.setViewType('stream');
    for await (const chunk of stream1) {
      params.reasoning.pushChunk(chunk);
    }

    const stream = streamGenerator(text, { chunkSize: 200 });

    for await (const chunk of stream) {
      params.pushChunk(chunk);
    }

    params.onFinish();
  }

  return (
    <Box height="100dvh" width="100dvw">
      <ChatPage
        enableReasoning
        apiRef={apiRef}
        threads={threads}
        loading={loading}
        defaultTextFieldValue="Text"
        handleStopMessageStreaming={handleStopMessageStreaming}
        onChangeCurrentThread={({ thread }) => setThread(thread)}
        onUserMessageSent={onSent}
      />
    </Box>
  );
}

export default App;
