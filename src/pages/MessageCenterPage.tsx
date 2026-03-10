import { useState, useEffect } from 'react';
import { apiRequest } from '../api/client';
import type { Message } from '../types/message';
import Spinner from '../components/ui/Spinner';

const CHANNEL_COLORS: Record<string, string> = {
  email: 'bg-blue-100 text-blue-800',
  sms: 'bg-green-100 text-green-800',
  chat: 'bg-purple-100 text-purple-800',
};

const DIRECTION_LABELS: Record<string, string> = {
  inbound: 'Received',
  outbound: 'Sent',
};

function getSenderDisplay(message: Message): string {
  if (message.sender_email) return message.sender_email;
  if (message.sender_phone) return message.sender_phone;
  return 'Unknown';
}

function getRecipientDisplay(message: Message): string {
  if (message.recipient_email) return message.recipient_email;
  if (message.recipient_phone) return message.recipient_phone;
  return 'Unknown';
}

function getSubjectPreview(body: string): string {
  const firstLine = body.split('\n')[0].trim();
  return firstLine.length > 80 ? firstLine.slice(0, 80) + '...' : firstLine;
}

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = diffMs / (1000 * 60 * 60);

  if (diffHrs < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (diffHrs < 168) {
    return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MessageCenterPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [channelFilter, setChannelFilter] = useState('');

  useEffect(() => {
    const params = channelFilter ? `?channel=${encodeURIComponent(channelFilter)}` : '';
    setLoading(true);
    apiRequest<Message[]>(`/messages${params}`)
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [channelFilter]);

  const filteredMessages = messages;

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-xl font-bold text-brand-dark">Messages</h2>

      {/* Channel Filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'All', value: '' },
          { label: 'Email', value: 'email' },
          { label: 'SMS', value: 'sms' },
          { label: 'Chat', value: 'chat' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setChannelFilter(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              channelFilter === f.value
                ? 'bg-teak-dark text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8 text-teak-dark" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <p className="py-8 text-center text-gray-500">No messages found.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Message List */}
          <div className="lg:col-span-1 overflow-hidden rounded-lg border border-gray-200">
            <div className="divide-y divide-gray-200 bg-white">
              {filteredMessages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                    selectedMessage?.id === message.id ? 'bg-teak/10' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {message.direction === 'inbound'
                        ? getSenderDisplay(message)
                        : getRecipientDisplay(message)}
                    </p>
                    <span className="ml-2 shrink-0 text-xs text-gray-400">
                      {formatTimestamp(message.created_at)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 truncate">
                    {getSubjectPreview(message.body)}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        CHANNEL_COLORS[message.channel] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {message.channel}
                    </span>
                    <span className="text-xs text-gray-400">
                      {DIRECTION_LABELS[message.direction] || message.direction}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6">
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedMessage.direction === 'inbound' ? 'From' : 'To'}:{' '}
                      {selectedMessage.direction === 'inbound'
                        ? getSenderDisplay(selectedMessage)
                        : getRecipientDisplay(selectedMessage)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedMessage.direction === 'inbound' ? 'To' : 'From'}:{' '}
                      {selectedMessage.direction === 'inbound'
                        ? getRecipientDisplay(selectedMessage)
                        : getSenderDisplay(selectedMessage)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        CHANNEL_COLORS[selectedMessage.channel] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {selectedMessage.channel}
                    </span>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {selectedMessage.order_id && (
                  <p className="text-xs text-gray-500">
                    Order:{' '}
                    <a
                      href={`/orders/${selectedMessage.order_id}`}
                      className="text-teak-dark hover:text-teak"
                    >
                      {selectedMessage.order_id}
                    </a>
                  </p>
                )}

                <div className="border-t pt-4">
                  <p className="whitespace-pre-wrap text-sm text-gray-700">
                    {selectedMessage.body}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-12 text-sm text-gray-400">
                Select a message to view details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
