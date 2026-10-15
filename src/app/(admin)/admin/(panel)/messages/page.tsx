import { listMessages } from '@/lib/store';
import { MessagesList } from '@/components/admin/MessagesList';

export default async function Page() {
  const messages = await listMessages();
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-extrabold tracking-tight">Mesajlar</h1>
      <p className="mb-6 mt-1 text-sm text-ink-2">Əlaqə formundan gələn müraciətlər.</p>
      <MessagesList messages={messages} />
    </div>
  );
}
