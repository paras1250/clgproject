import React from 'react';
import BuilderFooter from '../builder/BuilderFooter';
import { useChatbot } from './ChatbotContext';

const Step4Controls = ({ onBack, onSave }) => {
    const {
        selectedAvatar,
        firstMessage,
        themeColor,
        widgetSize,
        alignment
    } = useChatbot();

    const handleSave = () => {
        // Convert widgetSize to actual dimensions
        const sizeMap = {
            small: { width: '320', height: '500' },
            medium: { width: '380', height: '600' },
            large: { width: '450', height: '700' }
        };

        const dimensions = sizeMap[widgetSize] || sizeMap.medium;

        // Collect all customization data with correct field names
        const customizationData = {
            avatar: selectedAvatar,
            greetingMessage: firstMessage,  // This will be saved to greeting_message field
            primaryColor: themeColor,  // ✅ Fixed: was themeColor, backend expects primaryColor
            position: alignment,  // ✅ Fixed: was alignment, backend expects position
            width: dimensions.width,  // ✅ Added: convert size to pixels
            height: dimensions.height  // ✅ Added: convert size to pixels
        };

        // Pass it up to the parent save handler
        onSave(customizationData);
    };

    return (
        <BuilderFooter
            onBack={onBack}
            onNext={handleSave}
            nextLabel="Continue to Test"
            backLabel="Back to Edit"
        />
    );
};

export default Step4Controls;
