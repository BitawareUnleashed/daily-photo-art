// TODO management functionality
let todos = [];

// Helper function to translate category names
function translateCategory(category) {
  if (!category) return '';
  
  const languageSelect = document.getElementById('quote-language');
  const currentLang = languageSelect ? languageSelect.value : (localStorage.getItem('quoteLang') || 'it');
  const texts = window.currentTexts || window.TranslationUtils?.translations[currentLang] || {};
  
  const categoryMap = {
    'Lavoro': 'categoryWork',
    'Work': 'categoryWork', 
    'Travail': 'categoryWork',
    'Arbeit': 'categoryWork',
    'Casa': 'categoryHome',
    'Home': 'categoryHome',
    'Maison': 'categoryHome', 
    'Zuhause': 'categoryHome',
    'Hobby': 'categoryHobby',
    'Loisirs': 'categoryHobby',
    'Burocrazia': 'categoryBureaucracy',
    'Bureaucracy': 'categoryBureaucracy',
    'Bureaucratie': 'categoryBureaucracy',
    'Bürokratie': 'categoryBureaucracy',
    'Pagamenti': 'categoryPayments',
    'Payments': 'categoryPayments',
    'Paiements': 'categoryPayments',
    'Zahlungen': 'categoryPayments'
  };
  
  const translationKey = categoryMap[category];
  return translationKey ? texts[translationKey] : category;
}

async function renderTodos() {
  const list = document.getElementById("todo-list");
  const previewPanel = document.getElementById('todo-preview-panel');
  
  if (!list) return;
  
  const items = (await load("todos")) || [];
  
  list.innerHTML = items
    .map((item, i) => {
      const status = item.status || (item.completed ? 'completed' : 'todo');
      const color = item.color || '#ffffff';
      const category = item.category || '';
      const translatedCategory = translateCategory(category);
      
      let textStyle;
      if (status === 'completed') {
        textStyle = `style="text-decoration: line-through; opacity: 0.6; color: ${color};"`;
      } else if (status === 'priority') {
        textStyle = `style="font-weight: bold; color: ${color};"`;
      } else {
        textStyle = `style="color: ${color};"`;
      }
      
      const categoryBadge = translatedCategory ? `<span class="todo-category-badge">${translatedCategory}</span>` : '';
      return `
        <li>
          <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
            <div class="todo-checkbox-custom state-${status}" data-index="${i}"></div>
            <span ${textStyle}>${item.text}${categoryBadge}</span>
          </div>
          <div style="display: flex; gap: 4px;">
            <button data-index="${i}" class="todo-focus" title="Imposta come focus">🎯</button>
            <button data-index="${i}" class="todo-edit" title="Modifica">✏️</button>
            <button data-index="${i}" class="todo-delete">✕</button>
          </div>
        </li>
      `;
    })
    .join("");

  // Update preview panel
  if (previewPanel) {
    if (items.length > 0) {
      previewPanel.style.display = 'block';
      previewPanel.innerHTML = items
        .map((item, i) => {
          const status = item.status || (item.completed ? 'completed' : 'todo');
          const color = item.color || '#ffffff';
          const category = item.category || '';
          const translatedCategory = translateCategory(category);
          
          let textStyle;
          if (status === 'completed') {
            textStyle = `style="text-decoration: line-through; opacity: 0.6; color: ${color};"`;
          } else if (status === 'priority') {
            textStyle = `style="font-weight: bold; color: ${color};"`;
          } else {
            textStyle = `style="color: ${color};"`;
          }
          
          const categoryBadge = translatedCategory ? `<span class="todo-category-badge">${translatedCategory}</span>` : '';
          return `
            <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, .15); font-size: 16px;">
              <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                <div class="todo-checkbox-custom state-${status}" data-index="${i}"></div>
                <span ${textStyle}>${item.text}${categoryBadge}</span>
              </div>
              <div style="display: flex; gap: 4px;">
                <button data-index="${i}" class="todo-preview-focus" style="background: transparent; border: 0; color: var(--muted); cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;" title="Imposta come focus">🎯</button>
                <button data-index="${i}" class="todo-preview-edit" style="background: transparent; border: 0; color: var(--muted); cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;" title="Modifica">✏️</button>
                <button data-index="${i}" class="todo-preview-delete" style="background: transparent; border: 0; color: var(--muted); cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;">✕</button>
              </div>
            </li>
          `;
        })
        .join("");
    } else {
      previewPanel.style.display = 'none';
      previewPanel.innerHTML = '';
    }
    
    // Add event listeners for preview panel
    attachPreviewEventListeners(previewPanel);
  }

  // Add event listeners for main list
  attachMainListEventListeners(list);
  updateTodoNotificationVisibility();
}

function attachMainListEventListeners(list) {
  const checkboxes = list.querySelectorAll('.todo-checkbox-custom');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      await cycleTodoStatus(index);
    });
  });
  
  const deleteButtons = list.querySelectorAll('.todo-delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      await deleteTodo(index);
    });
  });
  
  const editButtons = list.querySelectorAll('.todo-edit');
  editButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      editTodo(index);
    });
  });
  
  const focusButtons = list.querySelectorAll('.todo-focus');
  focusButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      await setTodoAsFocus(index);
    });
  });
}

function attachPreviewEventListeners(previewPanel) {
  const checkboxes = previewPanel.querySelectorAll('.todo-checkbox-custom');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      await cycleTodoStatus(index);
    });
  });
  
  const deleteButtons = previewPanel.querySelectorAll('.todo-preview-delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      await deleteTodo(index);
    });
  });
  
  const editButtons = previewPanel.querySelectorAll('.todo-preview-edit');
  editButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      editTodo(index);
    });
  });
  
  const focusButtons = previewPanel.querySelectorAll('.todo-preview-focus');
  focusButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      await setTodoAsFocus(index);
    });
  });
}

async function cycleTodoStatus(index) {
  const items = (await load("todos")) || [];
  if (items[index]) {
    const currentStatus = items[index].status || (items[index].completed ? 'completed' : 'todo');
    
    // Cycle through states: todo -> priority -> completed -> todo
    switch (currentStatus) {
      case 'todo':
        items[index].status = 'priority';
        items[index].completed = false;
        break;
      case 'priority':
        items[index].status = 'completed';
        items[index].completed = true;
        break;
      case 'completed':
        items[index].status = 'todo';
        items[index].completed = false;
        break;
      default:
        items[index].status = 'todo';
        items[index].completed = false;
    }
    
    await save("todos", items);
    renderTodos();
    updateTodoNotificationVisibility();
  }
}

async function updateTodoNotificationVisibility() {
  const items = (await load("todos")) || [];
  const todoNotificationBtn = document.getElementById('todo-notification-btn');
  const todoSection = document.querySelector('.todo');
  
  if (!todoNotificationBtn) return;
  
  const hasTodos = items.length > 0;
  const isSectionVisible = todoSection?.style.display === 'block';
  
  if (hasTodos) {
    todoNotificationBtn.style.display = 'inline-flex';
    
    if (isSectionVisible) {
      todoNotificationBtn.textContent = '✕';
      todoNotificationBtn.title = 'Nascondi todo';
      todoNotificationBtn.classList.remove('blinking');
    } else {
      todoNotificationBtn.textContent = '📝';
      todoNotificationBtn.title = 'Mostra todo';
      todoNotificationBtn.classList.add('blinking');
    }
  } else {
    todoNotificationBtn.style.display = 'none';
    todoNotificationBtn.classList.remove('blinking');
  }
}

async function toggleTodo(index) {
  const items = (await load("todos")) || [];
  if (items[index]) {
    items[index].completed = !items[index].completed;
    await save("todos", items);
    renderTodos();
    updateTodoNotificationVisibility();
  }
}

async function deleteTodo(index) {
  const items = (await load("todos")) || [];
  items.splice(index, 1);
  await save("todos", items);
  renderTodos();
  updateTodoNotificationVisibility();
}

/**
 * Set a TODO item as the daily focus
 * @param {number} index - Index of the TODO item
 */
async function setTodoAsFocus(index) {
  const items = (await load("todos")) || [];
  const item = items[index];
  
  if (!item) return;
  
  // Clear all existing priority states (only one focus at a time)
  items.forEach(todo => {
    if (todo.status === 'priority') {
      todo.status = 'todo';
    }
  });
  
  // Set this item as priority (which shows as filled square)
  item.status = 'priority';
  item.completed = false;
  
  // Save the TODO item text as the daily focus
  await save("focus", item.text);
  await save("todos", items);
  
  // Update the focus display
  const focusDisplay = document.getElementById("focus-display");
  const focusEl = document.getElementById("focus");
  
  if (focusDisplay && focusEl) {
    // Get max length from HTML element or default to 16
    const maxLength = parseInt(focusEl.getAttribute('maxlength')) || 16;
    
    // Format display text with ellipsis if needed
    function formatDisplayText(text) {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    }
    
    focusEl.style.display = 'none';
    focusDisplay.textContent = formatDisplayText(item.text);
    focusDisplay.title = item.text; // Show full text on hover
    focusDisplay.style.display = 'block';
  }
  
  // Re-render TODOs to update the UI
  renderTodos();
}

function editTodo(index) {
  const todoSection = document.querySelector('.todo');
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const editIndexField = document.getElementById('edit-todo-index');
  const addBtn = document.getElementById('add-todo-btn');
  
  load("todos").then(items => {
    const item = items[index];
    if (!item) return;
    
    todoSection.style.display = 'block';
    form.style.display = 'block';
    
    editIndexField.value = index;
    input.value = item.text;
    input.placeholder = "Modifica attività";
    
    const colorRadio = document.querySelector(`input[name="todo-color"][value="${item.color || '#ffffff'}"]`);
    if (colorRadio) colorRadio.checked = true;
    
    const categoryRadio = document.querySelector(`input[name="todo-category"][value="${item.category || 'Lavoro'}"]`);
    if (categoryRadio) categoryRadio.checked = true;
    
    addBtn.textContent = "💾";
    addBtn.title = "Salva modifiche";
    
    input.focus();
    input.select();
  });
}

function initializeTodoForm() {
  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  
  if (!form || !input) return;
  
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    
    const editIndexField = document.getElementById('edit-todo-index');
    const editIndex = parseInt(editIndexField.value);
    const addBtn = document.getElementById('add-todo-btn');
    
    const selectedColor = document.querySelector('input[name="todo-color"]:checked')?.value || '#ffffff';
    const selectedCategory = document.querySelector('input[name="todo-category"]:checked')?.value || 'Lavoro';
    
    const items = (await load("todos")) || [];
    
    if (editIndex >= 0 && items[editIndex]) {
      items[editIndex].text = text;
      items[editIndex].color = selectedColor;
      items[editIndex].category = selectedCategory;
    } else {
      items.push({ 
        text, 
        createdAt: Date.now(), 
        completed: false,
        status: 'todo',
        color: selectedColor,
        category: selectedCategory
      });
    }
    
    await save("todos", items);
    
    // Reset form
    input.value = "";
    input.placeholder = "Aggiungi attività";
    editIndexField.value = "-1";
    addBtn.textContent = "✔";
    addBtn.title = "Aggiungi alla lista";
    
    // Reset to defaults
    const defaultColor = document.querySelector('input[name="todo-color"][value="#ffffff"]');
    if (defaultColor) defaultColor.checked = true;
    
    const defaultCategory = document.querySelector('input[name="todo-category"][value="Lavoro"]');
    if (defaultCategory) defaultCategory.checked = true;
    
    renderTodos();
    
    // Hide todo section after adding/editing
    const todoSection = document.querySelector('.todo');
    if (todoSection) todoSection.style.display = 'none';
    if (form) form.style.display = 'none';
    
    // Update notification button visibility after adding todo
    setTimeout(() => {
      updateTodoNotificationVisibility();
    }, 100);
  });
}

// Export for global access
if (typeof window !== 'undefined') {
  window.TodoUtils = { 
    renderTodos, 
    cycleTodoStatus, 
    updateTodoNotificationVisibility, 
    toggleTodo, 
    deleteTodo, 
    editTodo,
    setTodoAsFocus,
    initializeTodoForm,
    translateCategory
  };
  
  // Make functions globally available for backward compatibility
  window.toggleTodo = toggleTodo;
  window.deleteTodo = deleteTodo;
  
  // Event listener for app initialization
  window.addEventListener('app:initialized', function() {
    console.log('📋 Todo module received app initialization event');
    renderTodos();
    updateTodoNotificationVisibility();
  });
}

// Initialize TODO form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeTodoForm();
});
