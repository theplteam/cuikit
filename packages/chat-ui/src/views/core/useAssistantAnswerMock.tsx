import * as React from 'react';
import { MessageSentParams } from '../../models';
import { generateRandomLoremIpsum, LoremIpsumSize } from '../../utils/stringUtils/generateLoremIpsum';

let stop = false;

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const reasoningClaudeMock = `
Let me create a React component based on the provided name:
Component Name: Test ReactApp
Since there isn't a specific description provided about the functionality of the TestReactApp component, I'll create a general test application that demonstrates core React concepts, including:
1. Component structure
2. State management with hooks (useState, useEffect)
3. Basic event handling
4. Conditional rendering
5. Lists and keys
6. Basic styling
Here’s the React component I'll create:

\`\`\`jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TestReactApp.css'; // Assuming there would be a CSS file

/**
 * TestReactApp - A sample React application demonstrating core React concepts
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the application
 * @param {string} props.subtitle - The subtitle of the application
 */
const TestReactApp = ({ title = 'Test React Application', subtitle = 'A sample React app' }) => {
  // State declarations
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);
  const [newItemText, setNewItemText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate data fetching with useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Sample initial data
        setItems([
          { id: 1, text: 'Learn React' },
          { id: 2, text: 'Build a test app' },
          { id: 3, text: 'Share with others' }
        ]);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Cleanup function
    return () => {
      console.log('Component unmounting, cleanup performed');
    };
  }, []); // Empty dependency array means this runs once on mount

  // Event handlers
  const handleIncrement = () => {
    setCount(prevCount => prevCount + 1);
  };

  const handleDecrement = () => {
    setCount(prevCount => prevCount - 1);
  };

  const handleInputChange = (e) => {
    setNewItemText(e.target.value);
  };

  const handleAddItem = () => {
    // Validate input
    if (!newItemText.trim()) {
      setError('Please enter a valid item text');
      return;
    }

    // Clear any existing errors
    setError(null);

    // Add new item with unique ID
    const newItem = {
      id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
      text: newItemText.trim()
    };

    setItems([...items, newItem]);
    setNewItemText(''); // Clear input after adding
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Render helpers
  const renderCounter = () => (
    <div className="counter-section">
      <h3>Counter: {count}</h3>
      <div className="button-group">
        <button onClick={handleDecrement} aria-label="Decrement count">-</button>
        <button onClick={handleIncrement} aria-label="Increment count">+</button>
      </div>
    </div>
  );

  const renderItemList = () => (
    <div className="item-list-section">
      <h3>Todo Items</h3>
      {items.length === 0 ? (
        <p>No items yet. Add some below!</p>
      ) : (
        <ul className="item-list">
          {items.map(item => (
            <li key={item.id} className="item">
              <span>{item.text}</span>
              <button 
                onClick={() => handleRemoveItem(item.id)}
                className="remove-button"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderAddItemForm = () => (
    <div className="add-item-section">
      <h3>Add New Item</h3>
      <div className="input-group">
        <input
          type="text"
          value={newItemText}
          onChange={handleInputChange}
          placeholder="Enter item text"
          aria-label="New item text"
        />
        <button 
          onClick={handleAddItem}
          disabled={!newItemText.trim()}
          aria-label="Add item"
        >
          Add
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );

  return (
    <div className="test-react-app">
      <header className="app-header">
        <h1>{title}</h1>
        <h2>{subtitle}</h2>
      </header>
      
      <main className="app-content">
        {isLoading ? (
          <div className="loading">Loading data...</div>
        ) : (
          <>
            {renderCounter()}
            {renderItemList()}
            {renderAddItemForm()}
          </>
        )}
      </main>
      
      <footer className="app-footer">
        <p>TestReactApp demonstration - {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

// PropTypes for type checking
TestReactApp.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string
};

export default TestReactApp;
\`\`\`

This component:

1. Uses modern React syntax with functional components and hooks  
2. Imports necessary dependencies (React, hooks, PropTypes)  
3. Uses proper ES6+ syntax with arrow functions, destructuring, etc.  
4. Implements state management using useState for multiple state variables  
5. Uses useEffect for data fetching simulation  
6. Implements event handlers for various user interactions  
7. Includes error handling and input validation  
8. Uses conditional rendering for loading state and empty lists  
9. Demonstrates proper list rendering with keys  
10. Organizes the code into logical sections with helper render functions  
11. Includes PropTypes for type checking  
12. Uses semantic HTML and aria attributes for accessibility  
13. Follows proper naming conventions (PascalCase for components, camelCase for variables and functions)

The component demonstrates a simple todo list application with:
- A counter that can be incremented/decremented
- A list of items that can be added and removed
- Basic form validation
- Loading state simulation
- Error handling

This covers many of the core React concepts in a single test application, making it a good example for learning or testing purposes.

Let me check if I missed anything from the requirements:

1. ✅ Modern React syntax with functional components and hooks  
2. ✅ Necessary dependencies imported  
3. ✅ Functional component with the provided name (TestReactApp)  
4. ✅ Functionality implemented (general React concepts since no specific functionality was requested)  
5. ✅ Appropriate props and state management  
6. ✅ Basic error handling and input validation  
7. ✅ Comments to explain logic  
8. ✅ ES6+ syntax  
9. ✅ Proper React naming conventions  
10. ✅ Proper indentation and formatting  
11. ✅ Meaningful variable and function names  
12. ✅ Component focused on a single responsibility (a test app)  
13. ✅ PropTypes for type checking

The component meets all the requirements specified in the instructions. I'll now format it as requested.
`

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
    params?: Partial<{ delay: number, chunkSize: number, loremIpsumSize?: LoremIpsumSize }>
  ) {
    stop = false;
    if (!text) {
      text = generateRandomLoremIpsum(params?.loremIpsumSize ?? mockOptions?.loremIpsumSize ?? "medium");
    }

    const delay = params?.delay ?? 150;
    const chunkSize = params?.chunkSize ?? 15;
    let index = 0;
    while (index < text.length && !stop) {
      const chunk = text.slice(index, index + chunkSize);

      await new Promise(resolve => setTimeout(resolve, delay));
      yield chunk;
      index += chunkSize;
    }
  }, []);

  const reasoningGenerator = React.useCallback((params?: Partial<{ delay: number, chunkSize: number }>) => {
    const delay = params?.delay ?? 100;
    const chunkSize = params?.chunkSize ?? 8;
    return streamGenerator(reasoningClaudeMock, { delay, chunkSize });
  }, []);

  const handleStopMessageStreaming = React.useCallback(() => {
    stop = true;
  }, []);

  return { onUserMessageSent, handleStopMessageStreaming, streamGenerator, reasoningGenerator };
}
