// src/hooks/useGithubAPI.js
// A custom React hook for interacting with the GitHub API to commit file changes.
// This is designed for content syncing (e.g., blogs, Linktree data) to a GitHub repository.
//
// !!! IMPORTANT SECURITY NOTE FOR PRODUCTION !!!
// Direct client-side interaction with GitHub API using a Personal Access Token (PAT)
// is highly insecure as it exposes your PAT. For a production application,
// you MUST use a secure backend proxy (e.g., a serverless function, an Express server)
// to handle GitHub API calls. The client-side application would then call *your* backend.
// This implementation is for demonstration purposes within a controlled, non-production environment.

import { useState, useCallback } from 'react';

const useGithubAPI = () => {
  const [status, setStatus] = useState('idle'); // 'idle', 'saving', 'success', 'error'
  const [error, setError] = useState(null); // Stores any error object

  // Retrieve GitHub credentials from environment variables.
  // In a real application, these would be backend-only secrets.
  const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN; // Example: REACT_APP_GITHUB_TOKEN="ghp_YOUR_TOKEN"
  const REPO_OWNER = process.env.REACT_APP_GITHUB_REPO_OWNER; // Example: REACT_APP_GITHUB_REPO_OWNER="your-username"
  const REPO_NAME = process.env.REACT_APP_GITHUB_REPO_NAME; // Example: REACT_APP_GITHUB_REPO_NAME="your-data-repo"
  const BRANCH_NAME = 'main'; // Default branch name for commits

  /**
   * Commits content to a specific file in a GitHub repository.
   * Supports both creating new files and updating existing ones.
   *
   * @param {string} filePath - The path to the file within the repository (e.g., 'data/blogs/post1.md').
   * @param {string} content - The string content to write to the file.
   * @param {string} commitMessage - The commit message for the GitHub commit.
   * @returns {Promise<boolean>} True if the commit was successful, false otherwise.
   */
  const saveToGithub = useCallback(
    async (filePath, content, commitMessage) => {
      // Pre-check for essential GitHub configuration.
      if (!GITHUB_TOKEN || !REPO_OWNER || !REPO_NAME) {
        const configError = new Error(
          'GitHub API credentials (token, owner, repo) are not configured in environment variables. Please set REACT_APP_GITHUB_TOKEN, REACT_APP_GITHUB_REPO_OWNER, and REACT_APP_GITHUB_REPO_NAME.',
        );
        setError(configError);
        setStatus('error');
        console.error(configError.message);
        return false;
      }

      setStatus('saving'); // Indicate that saving process has started
      setError(null); // Clear previous errors

      const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`;
      const headers = {
        Authorization: `token ${GITHUB_TOKEN}`, // Authorization header with PAT
        Accept: 'application/vnd.github.v3+json', // Accept GitHub API v3 JSON format
        'Content-Type': 'application/json', // Indicate JSON payload
      };

      try {
        let currentSha = null; // SHA of the file, required for updating existing files

        // 1. Attempt to get the current SHA of the file.
        // This is necessary because GitHub's API requires the current SHA for updates.
        // If the file doesn't exist (404), currentSha remains null, indicating a new file.
        try {
          const response = await fetch(url, { headers });
          if (response.status === 200) {
            const data = await response.json();
            currentSha = data.sha; // Extract the SHA of the existing file
          } else if (response.status !== 404) {
            // If it's not 200 (success) and not 404 (not found), it's an unexpected error.
            throw new Error(
              `Failed to fetch file SHA: ${response.status} ${response.statusText}`,
            );
          }
        } catch (fetchError) {
          console.warn(
            `Warning: Could not get SHA for ${filePath}. It might be a new file or there's a network issue. Error: ${fetchError.message}`,
          );
          // If it's not a clear 404, but some other fetch error, we might still want to fail
          if (
            !fetchError.message.includes('404') &&
            !fetchError.message.includes('Failed to fetch')
          ) {
            throw fetchError; // Re-throw if it's a critical error beyond just file not found
          }
        }

        // Encode the content to Base64. GitHub API expects file content to be Base64 encoded.
        // Using encodeURIComponent and unescape + btoa for handling Unicode characters correctly.
        const encodedContent = btoa(unescape(encodeURIComponent(content)));

        // Prepare the payload for the PUT request (create or update file)
        const payload = {
          message: commitMessage, // The commit message
          content: encodedContent, // Base64 encoded file content
          branch: BRANCH_NAME, // The branch to commit to
          sha: currentSha, // Include SHA if updating; omit for new files
        };

        // 2. Make the PUT request to GitHub API to create or update the file
        const putResponse = await fetch(url, {
          method: 'PUT',
          headers,
          body: JSON.stringify(payload), // Send payload as JSON string
        });

        // Check if the response indicates success
        if (!putResponse.ok) {
          const errorData = await putResponse.json(); // Parse error response from GitHub
          throw new Error(
            `GitHub API Error: ${putResponse.status} ${putResponse.statusText} - ${errorData.message || 'Unknown error during commit.'}`,
          );
        }

        setStatus('success'); // Set status to success
        return true; // Indicate successful operation
      } catch (err) {
        console.error('Error saving to GitHub:', err);
        setError(err); // Store the error object
        setStatus('error'); // Set status to error
        return false; // Indicate failed operation
      }
    },
    [GITHUB_TOKEN, REPO_OWNER, REPO_NAME],
  ); // Dependencies for useCallback

  return { saveToGithub, status, error }; // Return the function and status/error states
};

export default useGithubAPI;
