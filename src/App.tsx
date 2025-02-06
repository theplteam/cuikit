import './App.css'
import * as React from 'react';
import dialogues from './test/dialogues.json';
import { useCustomAssistantActions } from './views/customAssistantActions';
import { ChatGptDialogue, ChatGptDialogueData } from './models/ChatGptDialogue';
import OpenAI from 'openai';
import ChatUi from '../packages/chat-ui/src/views/ChatUi';
import Root from './test/Root';

function App() {
  const dd = dialogues as ChatGptDialogueData[];

  const openAi = React.useMemo(() => {
    return new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY, // This is the default and can be omitted
      dangerouslyAllowBrowser: true,
    });
  }, []);

  const testArray = React.useMemo(() => dd.map(v => new ChatGptDialogue(v, openAi)).sort((a, b) => b.timestamp.value - a.timestamp.value), []);
  const customActions = useCustomAssistantActions();

  const handleCreateChat = () => {
    const newDialogue = new ChatGptDialogue(
      {
        id: '1-2-3',
        title: 'newDialogue',
        messages: [],
        authorId: 1,
      },
      openAi,
    );

    return newDialogue;
  }

  return (
    <Root>
      <ChatUi
        dialogues={testArray}
        handleCreateChat={handleCreateChat}
        assistantActions={customActions}
        userId={20}
        lang={'ru'}
        licenseKey={undefined}
      />
    </Root>
  )
}

export default App
