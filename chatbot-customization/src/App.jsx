import { ChatbotProvider } from './context/ChatbotContext';
import CustomizationPanel from './components/CustomizationPanel';
import ChatbotPreview from './components/ChatbotPreview';
import './index.css';

function App() {
    return (
        <ChatbotProvider>
            <div className="flex h-screen overflow-hidden">
                <CustomizationPanel />
                <ChatbotPreview />
            </div>
        </ChatbotProvider>
    );
}

export default App;
