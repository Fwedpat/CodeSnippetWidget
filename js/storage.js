/**
 * Daily Code Widget - Local Storage Module
 * Handles saving and loading code snippets using browser's localStorage
 */

const CodeStorage = {
  /**
   * Save a code snippet to localStorage
   * @param {string} language - The programming language
   * @param {string} filename - The filename
   * @param {string} code - The code content
   */
  saveSnippet: function(language, filename, code) {
    // Create a unique key based on filename
    const key = `code_widget_${filename}`;
    
    const snippet = {
      language: language,
      filename: filename,
      code: code,
      lastModified: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(snippet));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },
  
  /**
   * Load a code snippet from localStorage
   * @param {string} filename - The filename to load
   * @returns {Object|null} - The loaded snippet or null if not found
   */
  loadSnippet: function(filename) {
    const key = `code_widget_${filename}`;
    
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  },
  
  /**
   * Get a list of all saved snippets
   * @returns {Array} - Array of snippet metadata
   */
  getSavedSnippets: function() {
    const snippets = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        if (key.startsWith('code_widget_')) {
          const data = JSON.parse(localStorage.getItem(key));
          snippets.push({
            filename: data.filename,
            language: data.language,
            lastModified: data.lastModified
          });
        }
      }
    } catch (error) {
      console.error('Error getting saved snippets:', error);
    }
    
    return snippets;
  },
  
  /**
   * Delete a saved snippet
   * @param {string} filename - The filename to delete
   * @returns {boolean} - Success status
   */
  deleteSnippet: function(filename) {
    const key = `code_widget_${filename}`;
    
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error deleting snippet:', error);
      return false;
    }
  }
};