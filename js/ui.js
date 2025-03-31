/**
 * Daily Code Widget - UI Module
 * Handles UI interactions for the code editor
 */

const CodeUI = {
  /**
   * Initialize the UI components
   */
  init: function() {
    // Add save button to the UI
    this.addSaveButton();
    
    // Add load snippets button
    this.addLoadButton();
    
    // Add generate button for Groq API
    this.addGenerateButton();
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Auto-generate code on page load
    this.autoGenerateCode();
  },
  
  /**
   * Auto-generate code on page load
   */
  autoGenerateCode: function() {
    // Check if Groq API key is set
    if (!GroqAPI.hasApiKey()) {
      // If no API key, show the API key modal and then generate code
      GroqAPI.showApiKeyModal(() => {
        this.performAutoGeneration();
      });
    } else {
      // If API key exists, generate code directly
      this.performAutoGeneration();
    }
  },
  
  /**
   * Perform the actual code generation
   */
  performAutoGeneration: function() {
    // Get the current language from the select element
    const languageSelect = document.getElementById('language-select');
    const language = languageSelect.value;
    
    // Show a loading notification
    this.showNotification('Generating code...', 'success');
    
    // Generate code using Groq API
    GroqAPI.generateCodeSnippet(language)
      .then(generatedCode => {
        // Update the editor with the generated code
        const textarea = document.getElementById('editor-textarea');
        const languageTab = document.getElementById('language-tab');
        
        // Update language tab
        const shortNames = {
          javascript: 'js',
          typescript: 'ts',
          jsx: 'jsx',
          html: 'html',
          css: 'css',
          python: 'py',
          json: 'json'
        };
        languageTab.textContent = shortNames[language] || language.substring(0, 2);
        
        // Set the code
        textarea.value = generatedCode;
        
        // Update highlighting and line numbers
        const highlight = document.getElementById('editor-highlight');
        highlight.className = `language-${language}`;
        
        // Trigger input event to update highlighting and line numbers
        const event = new Event('input');
        textarea.dispatchEvent(event);
        
        // Show success notification
        this.showNotification('Code generated successfully!');
      })
      .catch(error => {
        // Show error notification
        this.showNotification(`Error: ${error.message}`, 'error');
      });
  },
  
  /**
   * Add save button to the UI
   */
  addSaveButton: function() {
    const titleBar = document.querySelector('.title-bar');
    const spacer = titleBar.querySelector('div[style="width: 20px;"]');
    
    // Create save button
    const saveButton = document.createElement('button');
    saveButton.id = 'save-button';
    saveButton.className = 'editor-button';
    saveButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>';
    saveButton.title = 'Save Snippet';
    
    // Insert before the spacer
    titleBar.insertBefore(saveButton, spacer);
    
    // Add styles for the button
    const style = document.createElement('style');
    style.textContent = `
      .editor-button {
        background-color: transparent;
        border: none;
        color: #4d7bfe;
        cursor: pointer;
        padding: 4px 8px;
        margin: 0 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .editor-button:hover {
        background-color: rgba(77, 123, 254, 0.1);
      }
      
      .editor-button svg {
        width: 16px;
        height: 16px;
      }
      
      .snippets-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      
      .snippets-content {
        background-color: #1e2030;
        border-radius: 8px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      }
      
      .snippets-header {
        padding: 16px;
        border-bottom: 1px solid #2a2f45;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .snippets-header h2 {
        margin: 0;
        color: #fff;
        font-size: 18px;
      }
      
      .snippets-close {
        background: transparent;
        border: none;
        color: #9e9e9e;
        font-size: 20px;
        cursor: pointer;
      }
      
      .snippets-list {
        padding: 16px;
      }
      
      .snippet-item {
        padding: 12px;
        border-radius: 4px;
        margin-bottom: 8px;
        background-color: #2a2f45;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .snippet-info {
        flex: 1;
      }
      
      .snippet-filename {
        color: #fff;
        font-size: 16px;
        margin: 0 0 4px 0;
      }
      
      .snippet-meta {
        color: #9e9e9e;
        font-size: 12px;
      }
      
      .snippet-actions {
        display: flex;
        gap: 8px;
      }
      
      .snippet-button {
        background-color: transparent;
        border: 1px solid #4d7bfe;
        color: #4d7bfe;
        border-radius: 4px;
        padding: 4px 8px;
        cursor: pointer;
        font-size: 12px;
      }
      
      .snippet-button:hover {
        background-color: rgba(77, 123, 254, 0.1);
      }
      
      .snippet-button.delete {
        border-color: #ff5555;
        color: #ff5555;
      }
      
      .snippet-button.delete:hover {
        background-color: rgba(255, 85, 85, 0.1);
      }
      
      .no-snippets {
        color: #9e9e9e;
        text-align: center;
        padding: 24px;
      }
    `;
    document.head.appendChild(style);
  },
  
  /**
   * Add load button to the UI
   */
  addLoadButton: function() {
    const titleBar = document.querySelector('.title-bar');
    const spacer = titleBar.querySelector('div[style="width: 20px;"]');
    
    // Create load button
    const loadButton = document.createElement('button');
    loadButton.id = 'load-button';
    loadButton.className = 'editor-button';
    loadButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>';
    loadButton.title = 'Load Snippets';
    
    // Insert before the spacer
    titleBar.insertBefore(loadButton, spacer);
  },
  
  /**
   * Add generate button for Groq API
   */
  addGenerateButton: function() {
    const titleBar = document.querySelector('.title-bar');
    const spacer = titleBar.querySelector('div[style="width: 20px;"]');
    
    // Create generate button
    const generateButton = document.createElement('button');
    generateButton.id = 'generate-button';
    generateButton.className = 'editor-button';
    generateButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>';
    generateButton.title = 'Generate Code with Groq';
    
    // Insert before the spacer
    titleBar.insertBefore(generateButton, spacer);
  },
  
  /**
   * Initialize event listeners for UI interactions
   */
  initEventListeners: function() {
    // Save button click event
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
      saveButton.addEventListener('click', () => {
        const textarea = document.getElementById('editor-textarea');
        const languageSelect = document.getElementById('language-select');
        const filename = document.getElementById('filename');
        
        if (textarea && languageSelect && filename) {
          const saved = CodeStorage.saveSnippet(
            languageSelect.value,
            filename.value,
            textarea.value
          );
          
          if (saved) {
            this.showNotification('Snippet saved successfully!');
          } else {
            this.showNotification('Failed to save snippet', 'error');
          }
        }
      });
    }
    
    // Load button click event
    const loadButton = document.getElementById('load-button');
    if (loadButton) {
      loadButton.addEventListener('click', () => {
        this.showSnippetsModal();
      });
    }
    
    // Generate button click event
    const generateButton = document.getElementById('generate-button');
    if (generateButton) {
      generateButton.addEventListener('click', () => {
        // Instead of showing the modal, directly generate new code
        this.performAutoGeneration();
      });
    }
  },
  
  /**
   * Show a notification message
   * @param {string} message - The message to display
   * @param {string} type - The type of notification (success, error)
   */
  showNotification: function(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('code-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'code-notification';
      document.body.appendChild(notification);
      
      // Add styles for the notification
      const style = document.createElement('style');
      style.textContent = `
        #code-notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 12px 16px;
          border-radius: 4px;
          color: white;
          font-size: 14px;
          z-index: 1000;
          transition: transform 0.3s, opacity 0.3s;
          transform: translateY(100px);
          opacity: 0;
        }
        
        #code-notification.show {
          transform: translateY(0);
          opacity: 1;
        }
        
        #code-notification.success {
          background-color: #4CAF50;
        }
        
        #code-notification.error {
          background-color: #F44336;
        }
      `;
      document.head.appendChild(style);
    }
    
    // Set notification content and type
    notification.textContent = message;
    notification.className = type;
    
    // Show the notification
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Hide the notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  },
  
  /**
   * Show the snippets modal with saved code snippets
   */
  showSnippetsModal: function() {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'snippets-modal';
    
    // Get saved snippets
    const snippets = CodeStorage.getSavedSnippets();
    
    // Create modal content
    modal.innerHTML = `
      <div class="snippets-content">
        <div class="snippets-header">
          <h2>Saved Snippets</h2>
          <button class="snippets-close">&times;</button>
        </div>
        <div class="snippets-list">
          ${snippets.length > 0 ? 
            snippets.map(snippet => `
              <div class="snippet-item" data-filename="${snippet.filename}">
                <div class="snippet-info">
                  <h3 class="snippet-filename">${snippet.filename}</h3>
                  <div class="snippet-meta">
                    ${snippet.language} · ${new Date(snippet.lastModified).toLocaleString()}
                  </div>
                </div>
                <div class="snippet-actions">
                  <button class="snippet-button load-snippet">Load</button>
                  <button class="snippet-button delete delete-snippet">Delete</button>
                </div>
              </div>
            `).join('') : 
            '<div class="no-snippets">No saved snippets found</div>'
          }
        </div>
      </div>
    `;
    
    // Add modal to the document
    document.body.appendChild(modal);
    
    // Close button event
    const closeButton = modal.querySelector('.snippets-close');
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
    
    // Load snippet buttons
    const loadButtons = modal.querySelectorAll('.load-snippet');
    loadButtons.forEach(button => {
      button.addEventListener('click', () => {
        const snippetItem = button.closest('.snippet-item');
        const filename = snippetItem.dataset.filename;
        
        const snippet = CodeStorage.loadSnippet(filename);
        if (snippet) {
          // Update the editor with the loaded snippet
          const textarea = document.getElementById('editor-textarea');
          const languageSelect = document.getElementById('language-select');
          const filenameInput = document.getElementById('filename');
          const languageTab = document.getElementById('language-tab');
          
          textarea.value = snippet.code;
          languageSelect.value = snippet.language;
          filenameInput.value = snippet.filename;
          
          // Update language tab
          const shortNames = {
            javascript: 'js',
            typescript: 'ts',
            jsx: 'jsx',
            html: 'html',
            css: 'css',
            python: 'py',
            json: 'json'
          };
          languageTab.textContent = shortNames[snippet.language] || snippet.language.substring(0, 2);
          
          // Update highlighting and line numbers
          const highlight = document.getElementById('editor-highlight');
          highlight.className = `language-${snippet.language}`;
          
          // Trigger input event to update highlighting and line numbers
          const event = new Event('input');
          textarea.dispatchEvent(event);
          
          // Close the modal
          document.body.removeChild(modal);
          
          // Show notification
          this.showNotification('Snippet loaded successfully!');
        }
      });
    });
    
    // Delete snippet buttons
    const deleteButtons = modal.querySelectorAll('.delete-snippet');
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => {
        const snippetItem = button.closest('.snippet-item');
        const filename = snippetItem.dataset.filename;
        
        if (confirm(`Are you sure you want to delete "${filename}"?`)) {
          const deleted = CodeStorage.deleteSnippet(filename);
          if (deleted) {
            // Remove the snippet item from the list
            snippetItem.remove();
            
            // Check if there are no more snippets
            const snippetsList = modal.querySelector('.snippets-list');
            if (snippetsList.children.length === 0) {
              snippetsList.innerHTML = '<div class="no-snippets">No saved snippets found</div>';
            }
            
            // Show notification
            this.showNotification('Snippet deleted successfully!');
          }
        }
      });
    });
  },
  
  /**
   * Show the generate code modal
   */
  showGenerateModal: function() {
    // Check if Groq API key is set
    if (!GroqAPI.hasApiKey()) {
      GroqAPI.showApiKeyModal(() => {
        // After API key is set, show the generate modal
        this.showGenerateModal();
      });
      return;
    }
    
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'snippets-modal';
    
    // Create modal content
    modal.innerHTML = `
      <div class="snippets-content">
        <div class="snippets-header">
          <h2>Generate Code with Groq</h2>
          <button class="snippets-close">&times;</button>
        </div>
        <div class="snippets-list" style="padding: 20px;">
          <label style="display: block; margin-bottom: 8px; color: #fff;">
            Language:
            <select id="generate-language" style="width: 100%; padding: 8px; margin-top: 4px; background-color: #2a2f45; border: 1px solid #4d7bfe; border-radius: 4px; color: #fff;">
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="jsx">JSX/React</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="json">JSON</option>
            </select>
          </label>
          
          <label style="display: block; margin-bottom: 8px; margin-top: 16px; color: #fff;">
            Custom Prompt (optional):
            <textarea id="generate-prompt" style="width: 100%; height: 80px; padding: 8px; margin-top: 4px; background-color: #2a2f45; border: 1px solid #4d7bfe; border-radius: 4px; color: #fff; font-family: inherit; resize: vertical;" placeholder="E.g., Generate a function that calculates Fibonacci numbers"></textarea>
          </label>
          
          <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            <button id="generate-code-button" class="snippet-button" style="background-color: #4d7bfe; color: #fff; border: none; padding: 8px 16px;">
              Generate Code
            </button>
            <button id="change-api-key-button" class="snippet-button">
              Change API Key
            </button>
          </div>
          
          <div id="generation-status" style="margin-top: 16px; color: #9e9e9e; text-align: center; display: none;">
            <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #4d7bfe; border-radius: 50%; border-top-color: transparent; animation: spin 1s linear infinite;"></div>
            <p style="margin-top: 8px;">Generating code...</p>
          </div>
          
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </div>
      </div>
    `;
    
    // Add modal to the document
    document.body.appendChild(modal);
    
    // Close button event
    const closeButton = modal.querySelector('.snippets-close');
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Click outside to close
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
    
    // Change API key button
    const changeApiKeyButton = modal.querySelector('#change-api-key-button');
    changeApiKeyButton.addEventListener('click', () => {
      document.body.removeChild(modal);
      GroqAPI.showApiKeyModal(() => {
        this.showGenerateModal();
      });
    });
    
    // Generate code button
    const generateCodeButton = modal.querySelector('#generate-code-button');
    const generationStatus = modal.querySelector('#generation-status');
    
    generateCodeButton.addEventListener('click', async () => {
      const languageSelect = modal.querySelector('#generate-language');
      const promptTextarea = modal.querySelector('#generate-prompt');
      
      const language = languageSelect.value;
      const prompt = promptTextarea.value.trim();
      
      // Show loading indicator
      generationStatus.style.display = 'block';
      generateCodeButton.disabled = true;
      
      try {
        // Generate code using Groq API
        const generatedCode = await GroqAPI.generateCodeSnippet(language, prompt);
        
        // Update the editor with the generated code
        const textarea = document.getElementById('editor-textarea');
        const editorLanguageSelect = document.getElementById('language-select');
        const languageTab = document.getElementById('language-tab');
        
        // Set the language
        editorLanguageSelect.value = language;
        
        // Update language tab
        const shortNames = {
          javascript: 'js',
          typescript: 'ts',
          jsx: 'jsx',
          html: 'html',
          css: 'css',
          python: 'py',
          json: 'json'
        };
        languageTab.textContent = shortNames[language] || language.substring(0, 2);
        
        // Set the code
        textarea.value = generatedCode;
        
        // Update highlighting and line numbers
        const highlight = document.getElementById('editor-highlight');
        highlight.className = `language-${language}`;
        
        // Trigger input event to update highlighting and line numbers
        const event = new Event('input');
        textarea.dispatchEvent(event);
        
        // Close the modal
        document.body.removeChild(modal);
        
        // Show notification
        this.showNotification('Code generated successfully!');
      } catch (error) {
        // Hide loading indicator
        generationStatus.style.display = 'none';
        generateCodeButton.disabled = false;
        
        // Show error notification
        this.showNotification(`Error: ${error.message}`, 'error');
      }
    });
  }
};