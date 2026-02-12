# 🎨 Bot Customization - Detailed Implementation Plan

## Current State Analysis

### ✅ What's Already Implemented:
- Basic theme support: Light & Dark themes
- Widget customization: Width, height, color, avatar
- Position customization: bottom-right, bottom-left, etc.
- Custom greeting messages

### ❌ What's Missing (from IMPROVEMENTS_NEEDED.md):
1. **Custom themes for widgets** - More than just light/dark
2. **Multiple widget styles** - Different layouts/designs
3. **Custom response templates** - Pre-defined response formats
4. **A/B testing for responses** - Test different response styles

---

## 1. Custom Themes for Widgets

### 1.1 Implementation Plan

#### Database Schema Addition:
```sql
-- Add theme_config column to bots table
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS theme_config JSONB DEFAULT '{
  "name": "default",
  "colors": {
    "primary": "#8b5cf6",
    "secondary": "#a855f7",
    "background": "#ffffff",
    "text": "#111827",
    "border": "#e5e7eb"
  },
  "fonts": {
    "family": "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto",
    "size": "14px"
  },
  "borderRadius": "16px",
  "shadow": "0 10px 40px rgba(0, 0, 0, 0.2)"
}'::jsonb;
```

#### Pre-built Theme Options:

```javascript
// backend/utils/themes.js

const PREDEFINED_THEMES = {
  'default': {
    name: 'Default Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#a855f7',
      background: '#ffffff',
      text: '#111827',
      border: '#e5e7eb',
      accent: '#f3f4f6'
    },
    fonts: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      size: '14px'
    },
    borderRadius: '16px',
    shadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
  },
  'dark': {
    name: 'Dark Mode',
    colors: {
      primary: '#7c3aed',
      secondary: '#9333ea',
      background: '#1f2937',
      text: '#ffffff',
      border: '#374151',
      accent: '#111827'
    },
    fonts: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
      size: '14px'
    },
    borderRadius: '16px',
    shadow: '0 10px 40px rgba(0, 0, 0, 0.4)'
  },
  'minimal': {
    name: 'Minimal Clean',
    colors: {
      primary: '#2563eb',
      secondary: '#3b82f6',
      background: '#ffffff',
      text: '#1e293b',
      border: '#e2e8f0',
      accent: '#f1f5f9'
    },
    fonts: {
      family: 'Inter, system-ui, sans-serif',
      size: '15px'
    },
    borderRadius: '12px',
    shadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  'vibrant': {
    name: 'Vibrant Colors',
    colors: {
      primary: '#ec4899',
      secondary: '#f472b6',
      background: '#ffffff',
      text: '#111827',
      border: '#fce7f3',
      accent: '#fdf2f8'
    },
    fonts: {
      family: 'Poppins, sans-serif',
      size: '14px'
    },
    borderRadius: '20px',
    shadow: '0 8px 32px rgba(236, 72, 153, 0.2)'
  },
  'professional': {
    name: 'Professional Blue',
    colors: {
      primary: '#1e40af',
      secondary: '#2563eb',
      background: '#ffffff',
      text: '#0f172a',
      border: '#cbd5e1',
      accent: '#f8fafc'
    },
    fonts: {
      family: 'Roboto, sans-serif',
      size: '14px'
    },
    borderRadius: '8px',
    shadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  },
  'warm': {
    name: 'Warm Orange',
    colors: {
      primary: '#ea580c',
      secondary: '#f97316',
      background: '#fffbeb',
      text: '#78350f',
      border: '#fed7aa',
      accent: '#fef3c7'
    },
    fonts: {
      family: 'Comfortaa, cursive',
      size: '15px'
    },
    borderRadius: '18px',
    shadow: '0 6px 20px rgba(234, 88, 12, 0.15)'
  }
};
```

#### Backend API Enhancement:
```javascript
// backend/routes/chatbot.js - Add new endpoint

// Get available themes
router.get('/themes', async (req, res) => {
  try {
    const { PREDEFINED_THEMES } = require('../utils/themes');
    res.json({ themes: PREDEFINED_THEMES });
  } catch (error) {
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});

// Update bot theme
router.put('/:id/theme', authMiddleware, async (req, res) => {
  try {
    const botId = req.params.id;
    const { themeName, customTheme } = req.body;
    
    // Verify ownership
    const bot = await Bot.findByIdAndUserId(botId, req.user.id);
    if (!bot) {
      return ErrorResponses.NOT_FOUND(res, 'Bot not found');
    }
    
    let themeConfig;
    if (customTheme) {
      // Use custom theme
      themeConfig = {
        name: 'custom',
        ...customTheme
      };
    } else if (themeName) {
      // Use predefined theme
      const { PREDEFINED_THEMES } = require('../utils/themes');
      if (!PREDEFINED_THEMES[themeName]) {
        return ErrorResponses.VALIDATION_ERROR(res, 'Invalid theme name');
      }
      themeConfig = PREDEFINED_THEMES[themeName];
    } else {
      return ErrorResponses.BAD_REQUEST(res, 'Either themeName or customTheme required');
    }
    
    await Bot.update(botId, req.user.id, { theme_config: themeConfig });
    
    res.json({ message: 'Theme updated', theme: themeConfig });
  } catch (error) {
    ErrorResponses.INTERNAL_SERVER_ERROR(res);
  }
});
```

#### Frontend Implementation:
```typescript
// frontend/components/ThemeSelector.tsx

import { useState } from 'react';
import { botsAPI } from '@/lib/api';

interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    accent: string;
  };
}

export default function ThemeSelector({ botId, currentTheme, onThemeChange }: {
  botId: string;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}) {
  const [themes, setThemes] = useState<Record<string, Theme>>({});
  const [selectedTheme, setSelectedTheme] = useState('default');

  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    try {
      const response = await fetch('/api/bots/themes');
      const data = await response.json();
      setThemes(data.themes);
    } catch (error) {
      console.error('Failed to fetch themes:', error);
    }
  };

  const handleThemeSelect = async (themeName: string) => {
    try {
      await botsAPI.updateTheme(botId, themeName);
      setSelectedTheme(themeName);
      onThemeChange(themes[themeName]);
    } catch (error) {
      console.error('Failed to update theme:', error);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(themes).map(([key, theme]) => (
        <div
          key={key}
          onClick={() => handleThemeSelect(key)}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedTheme === key
              ? 'border-purple-500 ring-2 ring-purple-200'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-8 h-8 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <span className="font-semibold">{theme.name}</span>
          </div>
          <div className="flex gap-1">
            {Object.values(theme.colors).slice(0, 5).map((color, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 2. Multiple Widget Styles

### 2.1 Widget Style Options

#### Style 1: Compact Chat
- Smaller footprint (300px width)
- Minimal design
- Perfect for mobile

#### Style 2: Full Panel
- Large chat interface (500px width)
- Rich UI with images
- Perfect for desktop

#### Style 3: Sidebar Style
- Full-height sidebar
- Always visible
- Perfect for dashboards

#### Style 4: Popup Modal
- Modal overlay style
- Centered on screen
- Professional look

### 2.2 Implementation:

```javascript
// backend/utils/widgetStyles.js

const WIDGET_STYLES = {
  'compact': {
    name: 'Compact Chat',
    width: '300px',
    height: '500px',
    position: 'bottom-right',
    layout: 'vertical',
    headerHeight: '50px',
    messageSpacing: '8px',
    inputHeight: '50px'
  },
  'full-panel': {
    name: 'Full Panel',
    width: '500px',
    height: '700px',
    position: 'bottom-right',
    layout: 'vertical',
    headerHeight: '70px',
    messageSpacing: '12px',
    inputHeight: '60px',
    showTypingIndicator: true,
    showReadReceipts: true
  },
  'sidebar': {
    name: 'Sidebar Style',
    width: '400px',
    height: '100vh',
    position: 'right',
    layout: 'vertical',
    headerHeight: '60px',
    messageSpacing: '10px',
    inputHeight: '55px',
    fullHeight: true
  },
  'popup-modal': {
    name: 'Popup Modal',
    width: '450px',
    height: '600px',
    position: 'center',
    layout: 'vertical',
    headerHeight: '60px',
    messageSpacing: '10px',
    inputHeight: '55px',
    modal: true,
    overlay: true
  }
};
```

#### Backend Update:
```javascript
// Add widget_style field
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS widget_style VARCHAR(50) DEFAULT 'compact';
```

#### Frontend Component:
```typescript
// frontend/components/WidgetStyleSelector.tsx

export default function WidgetStyleSelector({ 
  botId, 
  currentStyle, 
  onStyleChange 
}) {
  const styles = ['compact', 'full-panel', 'sidebar', 'popup-modal'];
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {styles.map(style => (
        <div
          key={style}
          onClick={() => handleStyleSelect(style)}
          className={`p-6 border-2 rounded-lg cursor-pointer ${
            currentStyle === style
              ? 'border-purple-500'
              : 'border-gray-200'
          }`}
        >
          <h3 className="font-semibold mb-2">
            {WIDGET_STYLES[style].name}
          </h3>
          <div className="bg-gray-100 rounded p-2">
            {/* Preview of widget style */}
            <div 
              className="rounded"
              style={{
                width: WIDGET_STYLES[style].width,
                height: WIDGET_STYLES[style].height,
                maxWidth: '100%',
                maxHeight: '200px'
              }}
            >
              {/* Style preview */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 3. Custom Response Templates

### 3.1 Template System

#### Database Schema:
```sql
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS response_templates JSONB DEFAULT '[]'::jsonb;

-- Example structure:
-- [
--   {
--     "id": "greeting",
--     "trigger": ["hello", "hi", "hey"],
--     "response": "Hello! How can I help you today?",
--     "enabled": true
--   },
--   {
--     "id": "farewell",
--     "trigger": ["bye", "goodbye", "see you"],
--     "response": "Goodbye! Have a great day!",
--     "enabled": true
--   }
-- ]
```

#### Backend Implementation:
```javascript
// backend/utils/responseTemplates.js

class ResponseTemplateEngine {
  constructor(templates) {
    this.templates = templates || [];
  }

  matchTemplate(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const template of this.templates) {
      if (!template.enabled) continue;
      
      // Check if any trigger word matches
      const matched = template.trigger.some(trigger => {
        return lowerMessage.includes(trigger.toLowerCase());
      });
      
      if (matched) {
        return this.processTemplate(template, userMessage);
      }
    }
    
    return null; // No template matched
  }

  processTemplate(template, userMessage) {
    // Replace variables in template
    let response = template.response;
    
    // Replace {name} with bot name if available
    response = response.replace(/\{name\}/g, 'Chatbot');
    
    // Replace {user_input} with user's message
    response = response.replace(/\{user_input\}/g, userMessage);
    
    // Replace {time} with current time
    response = response.replace(/\{time\}/g, new Date().toLocaleTimeString());
    
    return response;
  }
}

// Usage in chatbot route:
router.post('/:id/chat', async (req, res) => {
  // ... existing code ...
  
  // Check for response templates first
  if (bot.response_templates && bot.response_templates.length > 0) {
    const templateEngine = new ResponseTemplateEngine(bot.response_templates);
    const templateResponse = templateEngine.matchTemplate(message);
    
    if (templateResponse) {
      // Use template response instead of AI
      return res.json({
        response: templateResponse,
        source: 'template',
        sessionId: sessionId
      });
    }
  }
  
  // Otherwise, proceed with AI response
  // ...
});
```

#### Frontend Template Editor:
```typescript
// frontend/components/ResponseTemplateEditor.tsx

interface Template {
  id: string;
  trigger: string[];
  response: string;
  enabled: boolean;
}

export default function ResponseTemplateEditor({ 
  botId, 
  templates, 
  onUpdate 
}: {
  botId: string;
  templates: Template[];
  onUpdate: (templates: Template[]) => void;
}) {
  const [localTemplates, setLocalTemplates] = useState(templates);

  const addTemplate = () => {
    const newTemplate: Template = {
      id: `template_${Date.now()}`,
      trigger: [],
      response: '',
      enabled: true
    };
    setLocalTemplates([...localTemplates, newTemplate]);
  };

  const updateTemplate = (id: string, updates: Partial<Template>) => {
    setLocalTemplates(
      localTemplates.map(t => 
        t.id === id ? { ...t, ...updates } : t
      )
    );
  };

  const saveTemplates = async () => {
    try {
      await botsAPI.updateResponseTemplates(botId, localTemplates);
      onUpdate(localTemplates);
      showToast('Templates saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save templates', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Response Templates</h3>
        <button onClick={addTemplate} className="btn-primary">
          Add Template
        </button>
      </div>
      
      {localTemplates.map(template => (
        <div key={template.id} className="border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={template.enabled}
              onChange={(e) => updateTemplate(template.id, { enabled: e.target.checked })}
            />
            <label>Enabled</label>
          </div>
          
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              Trigger Words (comma-separated)
            </label>
            <input
              type="text"
              value={template.trigger.join(', ')}
              onChange={(e) => updateTemplate(template.id, { 
                trigger: e.target.value.split(',').map(t => t.trim()) 
              })}
              className="w-full border rounded px-3 py-2"
              placeholder="hello, hi, hey"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Response
            </label>
            <textarea
              value={template.response}
              onChange={(e) => updateTemplate(template.id, { response: e.target.value })}
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Hello! How can I help you? Use {name} for bot name, {time} for current time"
            />
          </div>
        </div>
      ))}
      
      <button onClick={saveTemplates} className="btn-primary">
        Save Templates
      </button>
    </div>
  );
}
```

---

## 4. A/B Testing for Responses

### 4.1 Implementation Plan

#### Database Schema:
```sql
ALTER TABLE bots 
ADD COLUMN IF NOT EXISTS ab_test_config JSONB DEFAULT '{
  "enabled": false,
  "variants": [],
  "distribution": 50
}'::jsonb;

-- Example structure:
-- {
--   "enabled": true,
--   "variants": [
--     {
--       "id": "variant_a",
--       "systemInstruction": "You are a friendly assistant...",
--       "weight": 50
--     },
--     {
--       "id": "variant_b",
--       "systemInstruction": "You are a professional assistant...",
--       "weight": 50
--     }
--   ],
--   "metrics": {
--     "variant_a": { "uses": 100, "satisfaction": 4.2 },
--     "variant_b": { "uses": 100, "satisfaction": 4.5 }
--   }
-- }
```

#### Backend A/B Testing Logic:
```javascript
// backend/utils/abTesting.js

class ABTestManager {
  selectVariant(abConfig, sessionId) {
    if (!abConfig.enabled || !abConfig.variants || abConfig.variants.length === 0) {
      return null;
    }

    // Use session ID to ensure consistent variant for user
    const hash = this.hashString(sessionId);
    const random = hash % 100;
    
    let cumulativeWeight = 0;
    for (const variant of abConfig.variants) {
      cumulativeWeight += variant.weight || 50;
      if (random < cumulativeWeight) {
        return variant;
      }
    }
    
    // Fallback to first variant
    return abConfig.variants[0];
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  trackUsage(botId, variantId, metrics) {
    // Store A/B test metrics
    // This could update analytics or a separate tracking table
  }
}

// Usage in chatbot route:
const abManager = new ABTestManager();
const selectedVariant = abManager.selectVariant(bot.ab_test_config, sessionId);

if (selectedVariant) {
  // Use variant's system instruction
  systemInstruction = selectedVariant.systemInstruction;
  
  // Track which variant was used
  abManager.trackUsage(botId, selectedVariant.id, {
    timestamp: new Date(),
    sessionId: sessionId
  });
}
```

#### Frontend A/B Test Dashboard:
```typescript
// frontend/components/ABTestDashboard.tsx

export default function ABTestDashboard({ botId, abConfig }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={abConfig.enabled}
          onChange={(e) => updateABConfig({ enabled: e.target.checked })}
        />
        <label className="font-semibold">Enable A/B Testing</label>
      </div>

      {abConfig.enabled && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Variants</h3>
          
          {abConfig.variants.map((variant, index) => (
            <div key={variant.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Variant {String.fromCharCode(65 + index)}</h4>
                <span className="text-sm text-gray-500">
                  {variant.weight}% distribution
                </span>
              </div>
              
              <textarea
                value={variant.systemInstruction}
                onChange={(e) => updateVariant(variant.id, { systemInstruction: e.target.value })}
                className="w-full border rounded px-3 py-2 mb-2"
                rows={4}
                placeholder="System instruction for this variant"
              />
              
              {abConfig.metrics && abConfig.metrics[variant.id] && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>Usage: {abConfig.metrics[variant.id].uses} times</p>
                  <p>Avg. Satisfaction: {abConfig.metrics[variant.id].satisfaction}/5</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Implementation Priority

### Phase 1 (Week 1-2): Custom Themes
- ✅ Add database schema
- ✅ Create predefined themes
- ✅ Build theme selector UI
- ✅ Update embed loader

### Phase 2 (Week 3-4): Widget Styles
- ✅ Add widget style options
- ✅ Implement style switcher
- ✅ Update preview component

### Phase 3 (Week 5-6): Response Templates
- ✅ Create template engine
- ✅ Build template editor
- ✅ Integrate with chat flow

### Phase 4 (Week 7-8): A/B Testing
- ✅ Implement A/B test manager
- ✅ Build analytics dashboard
- ✅ Add metrics tracking

---

## Testing Checklist

- [ ] Themes apply correctly in embed widget
- [ ] Widget styles render properly
- [ ] Response templates trigger correctly
- [ ] A/B testing distributes evenly
- [ ] All customizations save/load properly
- [ ] Preview updates in real-time
- [ ] Mobile responsiveness maintained

---

**Estimated Total Effort**: 8 weeks (160 hours)
**Priority**: Medium (enhances UX significantly)
