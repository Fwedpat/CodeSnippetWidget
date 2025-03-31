/**
 * Daily Code Widget - Groq API Integration
 * Handles communication with Groq API to generate code snippets
 */

const GroqAPI = {
  /**
   * API key storage key
   */
  API_KEY_STORAGE_KEY: '',
  
  /**
   * Save the Groq API key to localStorage
   * @param {string} apiKey - The Groq API key
   * @returns {boolean} - Success status
   */
  saveApiKey: function(apiKey) {
    try {
      localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
      return true;
    } catch (error) {
      console.error('Error saving API key:', error);
      return false;
    }
  },
  
  /**
   * Get the stored Groq API key
   * @returns {string|null} - The API key or null if not found
   */
  getApiKey: function() {
    try {
      return localStorage.getItem(this.API_KEY_STORAGE_KEY);
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  },
  
  /**
   * Check if an API key is stored
   * @returns {boolean} - True if API key exists
   */
  hasApiKey: function() {
    return !!this.getApiKey();
  },
  
  /**
   * Generate a code snippet using Groq API
   * @param {string} language - The programming language
   * @param {string} prompt - Optional prompt to guide generation
   * @returns {Promise<string>} - The generated code
   */
  generateCodeSnippet: async function(language, prompt = '') {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('No API key found. Please set your Groq API key first.');
    }
    
    // Default prompt if none provided
    if (!prompt) {
      prompt = `Generate an interesting and educational code snippet in ${language} that demonstrates a useful concept or technique.`;
    }
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'qwen-2.5-coder-32b',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful coding assistant that generates high-quality, educational code snippets. Your response should follow this exact format: First, provide any explanatory comments in plain text (not in code blocks). Then, provide ONLY the code in a single markdown code block with the appropriate language tag. Do not wrap the entire response in quotes.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2048
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content.trim();
      
      // Extract code from markdown code block if present
      const codeBlockRegex = /```(?:\w+)?\n([\s\S]+?)\n```/;
      const match = content.match(codeBlockRegex);
      
      if (match && match[1]) {
        // Return just the code inside the code block
        return match[1].trim();
      }
      
      // If no code block found, return the content as is
      return content;
    } catch (error) {
      console.error('Error generating code snippet:', error);
      throw error;
    }
  },
  
  /**
   * Show the API key input modal
   * @param {Function} callback - Function to call after API key is set
   */
  showApiKeyModal: function(callback) {
    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'snippets-modal';
    
    // Create modal content
    const content = document.createElement('div');
    content.className = 'snippets-content';
    
    // Create header
    const header = document.createElement('div');
    header.className = 'snippets-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Groq API Key';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'snippets-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    // Create form
    const form = document.createElement('div');
    form.className = 'snippets-list';
    form.style.padding = '20px';
    
    const label = document.createElement('label');
    label.textContent = 'Enter your Groq API Key:';
    label.style.display = 'block';
    label.style.marginBottom = '8px';
    label.style.color = '#fff';
    
    const input = document.createElement('input');
    input.type = 'password';
    input.style.width = '100%';
    input.style.padding = '8px';
    input.style.marginBottom = '16px';
    input.style.backgroundColor = '#2a2f45';
    input.style.border = '1px solid #4d7bfe';
    input.style.borderRadius = '4px';
    input.style.color = '#fff';
    input.style.fontSize = '14px';
    
    // Pre-fill with existing API key if available
    const existingKey = this.getApiKey();
    if (existingKey) {
      input.value = existingKey;
    }
    
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save API Key';
    saveButton.className = 'snippet-button';
    saveButton.style.backgroundColor = '#4d7bfe';
    saveButton.style.color = '#fff';
    saveButton.style.border = 'none';
    saveButton.style.padding = '8px 16px';
    
    saveButton.addEventListener('click', () => {
      const apiKey = input.value.trim();
      
      if (apiKey) {
        this.saveApiKey(apiKey);
        document.body.removeChild(modal);
        
        if (typeof callback === 'function') {
          callback();
        }
      } else {
        alert('Please enter a valid API key');
      }
    });
    
    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(saveButton);
    
    // Assemble modal
    content.appendChild(header);
    content.appendChild(form);
    modal.appendChild(content);
    
    // Add to document
    document.body.appendChild(modal);
    
    // Focus the input
    setTimeout(() => input.focus(), 100);
  }
};
