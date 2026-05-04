import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AgentTaskDetailPage from '../AgentTaskDetailPage';
import type {
  AgentTask,
  AgentTaskState,
  DraftActionResponse,
} from '../../types/agent';
import type { Message } from '../../types/message';

vi.mock('../../api/agentTasks', () => ({
  getAgentTask: vi.fn(),
  getTaskMessages: vi.fn(),
  takeoverAgentTask: vi.fn(),
  resumeAgentTask: vi.fn(),
  completeAgentTask: vi.fn(),
  escalateAgentTask: vi.fn(),
  sendTaskMessage: vi.fn(),
  approveDraft: vi.fn(),
  rejectDraft: vi.fn(),
}));

import {
  getAgentTask,
  getTaskMessages,
  approveDraft,
  rejectDraft,
} from '../../api/agentTasks';

const TASK_ID = 'task-abc-123';
const DRAFT_TEXT = 'Hello, this is the draft response.';

function makeState(overrides: Partial<AgentTaskState> = {}): AgentTaskState {
  return {
    conversation_history: [],
    working_files: [],
    decisions_made: [],
    pending_actions: [],
    context_variables: {},
    channel_info: {},
    draft_response: DRAFT_TEXT,
    ...overrides,
  };
}

function makeTask(overrides: Partial<AgentTask> = {}): AgentTask {
  return {
    id: TASK_ID,
    agent_type: 'communications',
    status: 'awaiting_review',
    organization_id: 'org-1',
    portal_id: null,
    assigned_to: null,
    initiated_by: null,
    channel: 'sms',
    external_ref: null,
    state: makeState(),
    confidence_score: 0.85,
    escalation_reason: null,
    error_message: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: null,
    ...overrides,
  };
}

const APPROVE_RESPONSE: DraftActionResponse = {
  task_id: TASK_ID,
  status: 'completed',
  message: 'Draft approved.',
};

const REJECT_RESPONSE: DraftActionResponse = {
  task_id: TASK_ID,
  status: 'cancelled',
  message: 'Draft rejected.',
};

function renderPage() {
  return render(
    <MemoryRouter initialEntries={[`/agents/${TASK_ID}`]}>
      <Routes>
        <Route path="/agents/:taskId" element={<AgentTaskDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('AgentTaskDetailPage — draft review UI', () => {
  beforeEach(() => {
    vi.mocked(getAgentTask).mockReset();
    vi.mocked(getTaskMessages).mockReset();
    vi.mocked(approveDraft).mockReset();
    vi.mocked(rejectDraft).mockReset();
    vi.mocked(getTaskMessages).mockResolvedValue([] as Message[]);
    vi.mocked(approveDraft).mockResolvedValue(APPROVE_RESPONSE);
    vi.mocked(rejectDraft).mockResolvedValue(REJECT_RESPONSE);
  });

  it('shows Approve and Reject buttons when task.status is awaiting_review', async () => {
    vi.mocked(getAgentTask).mockResolvedValue(makeTask());
    renderPage();
    expect(
      await screen.findByRole('button', { name: 'Approve & Send' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Reject' }),
    ).toBeInTheDocument();
  });

  it('hides Approve and Reject buttons when task.status is not awaiting_review', async () => {
    vi.mocked(getAgentTask).mockResolvedValue(
      makeTask({ status: 'in_progress' }),
    );
    renderPage();
    await screen.findByRole('button', { name: 'Take Over' });
    expect(
      screen.queryByRole('button', { name: 'Approve & Send' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Reject' }),
    ).not.toBeInTheDocument();
  });

  it('calls approveDraft with no body when textarea content matches draft_response', async () => {
    vi.mocked(getAgentTask).mockResolvedValue(makeTask());
    renderPage();
    const approveBtn = await screen.findByRole('button', {
      name: 'Approve & Send',
    });
    await userEvent.click(approveBtn);
    await waitFor(() => {
      expect(approveDraft).toHaveBeenCalledWith(TASK_ID, undefined);
    });
  });

  it('calls approveDraft with edited body when textarea differs from draft_response', async () => {
    vi.mocked(getAgentTask).mockResolvedValue(makeTask());
    renderPage();
    const textarea = await screen.findByRole('textbox');
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'edited text');
    const approveBtn = screen.getByRole('button', {
      name: 'Approve & Send',
    });
    await userEvent.click(approveBtn);
    await waitFor(() => {
      expect(approveDraft).toHaveBeenCalledWith(TASK_ID, 'edited text');
    });
  });

  it('disables the Approve button when textarea is empty or whitespace-only', async () => {
    vi.mocked(getAgentTask).mockResolvedValue(makeTask());
    renderPage();
    const textarea = await screen.findByRole('textbox');
    const approveBtn = screen.getByRole('button', {
      name: 'Approve & Send',
    });
    expect(approveBtn).toBeEnabled();
    await userEvent.clear(textarea);
    expect(approveBtn).toBeDisabled();
    await userEvent.type(textarea, '   ');
    expect(approveBtn).toBeDisabled();
  });

  it('calls rejectDraft when the Reject button is clicked', async () => {
    vi.mocked(getAgentTask).mockResolvedValue(makeTask());
    renderPage();
    const rejectBtn = await screen.findByRole('button', { name: 'Reject' });
    await userEvent.click(rejectBtn);
    await waitFor(() => {
      expect(rejectDraft).toHaveBeenCalledWith(TASK_ID);
    });
  });
});
