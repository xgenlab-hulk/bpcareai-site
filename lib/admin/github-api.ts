/**
 * GitHub API Client Wrapper
 * Provides functions to update configuration files in the repository
 * Used by admin panel to modify configs (which are committed to git)
 */
import { Octokit } from '@octokit/rest';

// GitHub repository details
const OWNER = 'xgenlab-hulk';
const REPO = 'bpcareai-site';
const BRANCH = 'main';

/**
 * Initialize Octokit client
 */
function getOctokit() {
  if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN environment variable is not set');
  }

  return new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
}

/**
 * Get the SHA of a file (required for updating)
 */
async function getFileSha(
  filePath: string
): Promise<string> {
  const octokit = getOctokit();

  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      ref: BRANCH,
    });

    if (Array.isArray(data) || data.type !== 'file') {
      throw new Error(`Path ${filePath} is not a file`);
    }

    return data.sha;
  } catch (error) {
    throw new Error(`Failed to get file SHA for ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Update a single configuration file
 *
 * @param filePath - Path to file in repo (e.g., "data/automation-config.json")
 * @param content - New file content (will be stringified if object)
 * @param commitMessage - Commit message
 */
export async function updateConfigFile(
  filePath: string,
  content: string | object,
  commitMessage?: string
): Promise<void> {
  const octokit = getOctokit();

  try {
    // Get current file SHA
    const sha = await getFileSha(filePath);

    // Prepare content
    const contentString = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    const contentBase64 = Buffer.from(contentString, 'utf-8').toString('base64');

    // Update file
    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      message: commitMessage || `chore: update ${filePath} via admin panel`,
      content: contentBase64,
      sha,
      branch: BRANCH,
    });

    console.log(`✅ Updated ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to update ${filePath}:`, error);
    throw error;
  }
}

/**
 * Delete a file
 *
 * @param filePath - Path to file in repo
 * @param commitMessage - Commit message
 */
export async function deleteFile(
  filePath: string,
  commitMessage?: string
): Promise<void> {
  const octokit = getOctokit();

  try {
    // Get current file SHA
    const sha = await getFileSha(filePath);

    // Delete file
    await octokit.repos.deleteFile({
      owner: OWNER,
      repo: REPO,
      path: filePath,
      message: commitMessage || `chore: delete ${filePath} via admin panel`,
      sha,
      branch: BRANCH,
    });

    console.log(`✅ Deleted ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to delete ${filePath}:`, error);
    throw error;
  }
}

/**
 * Batch update multiple files in a single commit
 * More efficient than updating files one by one
 *
 * @param updates - Array of file updates
 * @param commitMessage - Commit message
 */
export async function batchUpdateFiles(
  updates: Array<{ path: string; content: string | object }>,
  commitMessage?: string
): Promise<void> {
  const octokit = getOctokit();

  try {
    // 1. Get latest commit SHA
    const { data: ref } = await octokit.git.getRef({
      owner: OWNER,
      repo: REPO,
      ref: `heads/${BRANCH}`,
    });

    const latestCommitSha = ref.object.sha;

    // 2. Get the commit's tree SHA
    const { data: commit } = await octokit.git.getCommit({
      owner: OWNER,
      repo: REPO,
      commit_sha: latestCommitSha,
    });

    const baseTreeSha = commit.tree.sha;

    // 3. Create blobs for each file
    const tree = await Promise.all(
      updates.map(async (update) => {
        const contentString = typeof update.content === 'string'
          ? update.content
          : JSON.stringify(update.content, null, 2);

        const { data: blob } = await octokit.git.createBlob({
          owner: OWNER,
          repo: REPO,
          content: Buffer.from(contentString, 'utf-8').toString('base64'),
          encoding: 'base64',
        });

        return {
          path: update.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.sha,
        };
      })
    );

    // 4. Create new tree
    const { data: newTree } = await octokit.git.createTree({
      owner: OWNER,
      repo: REPO,
      base_tree: baseTreeSha,
      tree,
    });

    // 5. Create new commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner: OWNER,
      repo: REPO,
      message: commitMessage || `chore: batch update ${updates.length} files via admin panel`,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    // 6. Update reference
    await octokit.git.updateRef({
      owner: OWNER,
      repo: REPO,
      ref: `heads/${BRANCH}`,
      sha: newCommit.sha,
    });

    console.log(`✅ Batch updated ${updates.length} files`);
  } catch (error) {
    console.error(`❌ Failed to batch update files:`, error);
    throw error;
  }
}

/**
 * Trigger a GitHub Actions workflow
 *
 * @param workflowId - Workflow file name (e.g., "daily-article-generation.yml")
 * @param inputs - Optional workflow inputs
 */
export async function triggerWorkflow(
  workflowId: string,
  inputs?: Record<string, string>
): Promise<void> {
  const octokit = getOctokit();

  try {
    await octokit.actions.createWorkflowDispatch({
      owner: OWNER,
      repo: REPO,
      workflow_id: workflowId,
      ref: BRANCH,
      inputs,
    });

    console.log(`✅ Triggered workflow: ${workflowId}`);
  } catch (error) {
    console.error(`❌ Failed to trigger workflow ${workflowId}:`, error);
    throw error;
  }
}
