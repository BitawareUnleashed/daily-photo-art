# Todo.js Documentation

## Overview
The `todo.js` module provides a comprehensive task management system for the Daily Photo Art extension. It features multi-status todo items, category organization, color coding, focus integration, and dual-panel display with complete CRUD operations.

## Key Features
- **Multi-Status System**: Todo → Priority → Completed state cycle
- **Category Organization**: Work, Home, Hobby, Bureaucracy, Payments categories
- **Color Coding**: Visual differentiation with custom color selection
- **Focus Integration**: Convert todos to daily focus with one click
- **Dual Display**: Main list and preview panel views
- **Translation Support**: Multi-language category names
- **Notification System**: Visual alerts for pending todos
- **Edit-in-Place**: Inline editing with form pre-population

## Core Data Structure

### Todo Item Object
```javascript
{
  text: string,           // Todo item description
  createdAt: number,      // Timestamp when created
  completed: boolean,     // Legacy completion flag
  status: string,         // Current status: 'todo', 'priority', 'completed'
  color: string,          // Hex color code (e.g., '#ffffff')
  category: string        // Category name (e.g., 'Lavoro', 'Casa')
}
```

### Global State
- **`todos`**: Array of todo items (local variable)
- **Storage Key**: 'todos' in chrome.storage/localStorage
- **Categories**: Work, Home, Hobby, Bureaucracy, Payments

## Status Management System

### Status States
1. **Todo** (`'todo'`): Regular task, unfilled checkbox
2. **Priority** (`'priority'`): Important task, filled square, bold text
3. **Completed** (`'completed'`): Finished task, strikethrough, reduced opacity

### Status Cycling
**Function**: `cycleTodoStatus(index)`
**Cycle**: Todo → Priority → Completed → Todo

**Visual Indicators**:
- **Todo**: ☐ Empty checkbox, normal text
- **Priority**: ■ Filled square, bold text
- **Completed**: ☑ Checked box, strikethrough, faded

**Process**:
```javascript
Current Status: todo → Set to: priority
Current Status: priority → Set to: completed  
Current Status: completed → Set to: todo
```

## Category System

### Available Categories
- **Lavoro/Work**: Professional tasks and responsibilities
- **Casa/Home**: Household and personal tasks
- **Hobby**: Leisure and recreational activities
- **Burocrazia/Bureaucracy**: Administrative and official tasks
- **Pagamenti/Payments**: Financial and payment-related tasks

### `translateCategory(category)`
**Purpose**: Provides localized category names based on current language setting.

**Translation Logic**:
1. Gets current language from quote-language selector or localStorage
2. Maps category names to translation keys
3. Returns translated text from current language translations
4. Falls back to original category name if translation unavailable

**Category Mapping**:
```javascript
{
  'Lavoro'/'Work' → 'categoryWork',
  'Casa'/'Home' → 'categoryHome', 
  'Hobby' → 'categoryHobby',
  'Burocrazia'/'Bureaucracy' → 'categoryBureaucracy',
  'Pagamenti'/'Payments' → 'categoryPayments'
}
```

**Language Support**: Italian, English, French, German

## Rendering System

### `renderTodos()`
**Purpose**: Main rendering function that updates both main list and preview panel.

**Process**:
1. **Data Loading**: Retrieves todos from storage
2. **Main List**: Renders full todo list with all controls
3. **Preview Panel**: Renders compact view for quick access
4. **Event Binding**: Attaches all interactive event listeners
5. **Notification Update**: Updates notification button state

**Generated HTML Structure**:
```html
<li>
  <div class="todo-content">
    <div class="todo-checkbox-custom state-{status}" data-index="{i}"></div>
    <span style="...color styling...">
      {todo.text}
      <span class="todo-category-badge">{translatedCategory}</span>
    </span>
  </div>
  <div class="todo-actions">
    <button class="todo-focus" title="Set as focus">🎯</button>
    <button class="todo-edit" title="Edit">✏️</button>
    <button class="todo-delete">✕</button>
  </div>
</li>
```

### Visual Styling
**Color Application**:
- **Todo**: Normal color as specified
- **Priority**: Bold text with specified color
- **Completed**: Strikethrough, 60% opacity, specified color

**Category Badges**: Small colored badges next to todo text showing translated category name

## Event Handling

### Main List Events
**Function**: `attachMainListEventListeners(list)`

**Event Types**:
- **Checkbox Click**: `cycleTodoStatus(index)` - Status cycling
- **Delete Button**: `deleteTodo(index)` - Remove todo
- **Edit Button**: `editTodo(index)` - Open edit form
- **Focus Button**: `setTodoAsFocus(index)` - Set as daily focus

### Preview Panel Events  
**Function**: `attachPreviewEventListeners(previewPanel)`
**Same functionality as main list with preview-specific selectors**

### Form Events
**Function**: `initializeTodoForm()`
**Handles**: Form submission, input validation, edit/add mode switching

## CRUD Operations

### Create Todo
**Trigger**: Form submission with new todo text
**Process**:
1. **Validation**: Checks for non-empty trimmed text
2. **Data Creation**: Creates todo object with current timestamp
3. **Color/Category**: Applies selected color and category
4. **Storage**: Saves updated todos array
5. **UI Reset**: Clears form and resets to default state
6. **Re-render**: Updates both displays

### Read Todos
**Function**: `load("todos")` from storage.js
**Returns**: Array of todo objects or empty array
**Usage**: Called by renderTodos() and all CRUD operations

### Update Todo
**Function**: `editTodo(index)`
**Process**:
1. **Form Population**: Pre-fills form with existing todo data
2. **Mode Switch**: Changes form to edit mode (💾 save button)
3. **Color/Category**: Pre-selects existing values
4. **Focus**: Automatically focuses and selects input text
5. **Submission**: Updates existing todo at specified index

### Delete Todo
**Function**: `deleteTodo(index)`
**Process**:
1. **Array Removal**: Splices todo from array at index
2. **Storage Update**: Saves modified todos array
3. **Re-render**: Updates all displays
4. **Notification Update**: Adjusts notification button state

## Focus Integration

### `setTodoAsFocus(index)`
**Purpose**: Converts a todo item into the daily focus with priority status.

**Process**:
1. **Priority Clearing**: Removes priority status from all other todos
2. **Status Setting**: Sets selected todo to 'priority' status  
3. **Focus Storage**: Saves todo text as daily focus
4. **Focus Display**: Updates focus display element with formatting
5. **Text Truncation**: Applies character limit with ellipsis
6. **Tooltip**: Sets full text as hover tooltip
7. **UI Update**: Re-renders todos to show new priority state

**Integration**: Works with focus.js module for consistent daily focus management

## Notification System

### `updateTodoNotificationVisibility()`
**Purpose**: Manages the todo notification button state and appearance.

**Button States**:
- **Hidden**: No todos exist
- **Blinking 📝**: Todos exist but panel hidden
- **Static ✕**: Todos exist and panel visible

**Visual Feedback**:
- **Blinking Animation**: CSS animation for attention-grabbing
- **Dynamic Text**: Changes between 📝 and ✕ based on panel state
- **Tooltips**: "Mostra todo" / "Nascondi todo" (localized)

## Form Management

### Form Modes
1. **Add Mode**: Default state for creating new todos
   - Button: ✔ "Aggiungi alla lista"
   - Placeholder: "Aggiungi attività"
   - Edit Index: -1

2. **Edit Mode**: Activated when editing existing todo
   - Button: 💾 "Salva modifiche"  
   - Placeholder: "Modifica attività"
   - Edit Index: Actual todo index

### Form Elements
- **Text Input**: `#todo-input` for todo description
- **Color Selection**: Radio buttons for color choice
- **Category Selection**: Radio buttons for category choice
- **Edit Index**: Hidden field tracking edit state
- **Submit Button**: Changes appearance based on mode

### Form Reset
**Triggers**: After successful add/edit operations
**Actions**:
- Clear input text
- Reset to default color (#ffffff)
- Reset to default category (Lavoro)
- Hide todo section and form
- Reset button to add mode

## Display Panels

### Main Todo List
**Location**: Primary todo display area
**Features**: Full functionality with all buttons and controls
**Visibility**: Shown/hidden via todo section toggle

### Preview Panel
**Location**: Secondary compact display
**Features**: Same functionality as main list
**Styling**: Inline styles for compact presentation
**Use Case**: Quick access without opening main todo section

## Storage Integration

### Save Operations
**Function**: Uses storage.js `save("todos", items)`
**Triggers**: All CRUD operations
**Data**: Complete todos array with updated items

### Load Operations
**Function**: Uses storage.js `load("todos")`
**Default**: Returns empty array if no todos stored
**Usage**: Beginning of all operations requiring todo data

## Translation Integration

### Category Translation
**Source**: window.currentTexts or TranslationUtils.translations
**Languages**: Italian, English, French, German
**Fallback**: Original category name if translation unavailable

### UI Text Translation
**Elements**: Tooltips, button titles, placeholders
**Method**: Direct Italian text (not yet fully integrated with translation system)
**Future Enhancement**: Full integration with TranslationManager

## Performance Optimizations

### Event Delegation
**Method**: Attaches events after each render
**Efficiency**: Direct event binding to generated elements
**Cleanup**: Automatic cleanup on re-render

### Storage Efficiency
**Pattern**: Load once, modify, save once per operation
**Caching**: Local todos array for temporary operations
**Batch Updates**: Single storage write per logical operation

### Rendering Efficiency
**Method**: Complete re-render on changes
**Justification**: Simple and reliable for small todo lists
**Optimization**: Minimal DOM manipulation per render

## Error Handling

### Storage Errors
**Load Failures**: Returns empty array, continues operation
**Save Failures**: Logs error, maintains UI state
**Data Corruption**: Graceful handling with fallback values

### DOM Errors
**Missing Elements**: Null checks before manipulation
**Event Binding**: Safe property access with optional chaining
**Form Validation**: Input sanitization and validation

### Index Validation
**Bounds Checking**: Validates array indices before operations
**Safe Access**: Checks item existence before manipulation
**Error Recovery**: Continues operation with available data

## Global API

### Window Exports
```javascript
window.TodoUtils = {
  renderTodos,                    // Main rendering function
  cycleTodoStatus,               // Status cycling
  updateTodoNotificationVisibility, // Notification management
  toggleTodo,                    // Legacy toggle function
  deleteTodo,                    // Delete operation
  editTodo,                      // Edit initiation
  setTodoAsFocus,               // Focus integration
  initializeTodoForm,           // Form initialization
  translateCategory             // Category translation
}
```

### Legacy Compatibility
- **`window.toggleTodo`**: Direct global access for backward compatibility
- **`window.deleteTodo`**: Direct global access for legacy code

## Integration Points

### Focus System
- **Daily Focus**: `setTodoAsFocus()` integration
- **Display Update**: Automatic focus display management
- **Text Formatting**: Character limit and ellipsis handling

### Translation System
- **Category Names**: Dynamic translation based on current language
- **UI Elements**: Tooltip and message localization

### Storage System
- **Persistence**: chrome.storage or localStorage via storage.js
- **Data Format**: JSON serialization of todo objects

### Notification System
- **Visual Alerts**: Blinking animation for pending todos
- **State Management**: Dynamic button text and visibility

## Accessibility Features

### Keyboard Support
- **Form Navigation**: Standard tab order through form elements
- **Enter Submission**: Form submission via Enter key
- **Focus Management**: Automatic input focus on edit activation

### Screen Reader Support
- **Button Titles**: Descriptive tooltip text for all actions
- **Status Indicators**: Clear visual status representation
- **Category Badges**: Labeled category information

### Visual Indicators
- **Color Coding**: User-selectable colors for organization
- **Status Icons**: Distinct checkbox states for different statuses
- **Animation**: Attention-grabbing blinking for notifications

## Future Enhancements
- **Drag & Drop**: Reorder todos by dragging
- **Due Dates**: Add deadline support with notifications
- **Subtasks**: Nested todo items for complex tasks
- **Search & Filter**: Find todos by text or category
- **Bulk Operations**: Select multiple todos for batch actions
- **Import/Export**: Backup and restore todo data
- **Recurring Tasks**: Automatically recreate periodic todos
- **Task Dependencies**: Link related todos with dependencies
