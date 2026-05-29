import type { LogEntry } from '@/types/domain';

const TONE_STYLES: Record<LogEntry['tone'], string> = {
  neutral: 'text-ink-soft',
  info: 'text-violet',
  success: 'text-sage',
  error: 'text-coral',
  ai: 'text-violet-soft',
};

interface ActivityFeedProps {
  entries: LogEntry[];
  maxHeight?: string;
}

export function ActivityFeed({ entries, maxHeight = 'max-h-20' }: ActivityFeedProps) {
  return (
    <div className={`font-mono text-ui-sm space-y-1.5 overflow-y-auto pr-1 ${maxHeight}`}>
      {entries.slice(-8).map((entry) => (
        <p key={entry.id} className={`leading-snug ${TONE_STYLES[entry.tone]}`}>
          <span className="text-ink-faint mr-1.5">›</span>
          {entry.message}
        </p>
      ))}
    </div>
  );
}
