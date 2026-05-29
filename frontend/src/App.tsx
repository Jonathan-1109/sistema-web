import { useState } from 'react';
import { useAssignmentSolver } from '@/hooks/useAssignmentSolver';
import { useTransportSolver } from '@/hooks/useTransportSolver';
import type { WorkspaceMode } from '@/types/domain';
import { AssignmentWorkspace } from '@/views/AssignmentWorkspace';
import { LandingView } from '@/views/LandingView';
import { TransportWorkspace } from '@/views/TransportWorkspace';

export default function App() {
  const [mode, setMode] = useState<WorkspaceMode>('landing');
  const transport = useTransportSolver();
  const assignment = useAssignmentSolver();

  return (
    <div className="min-h-dvh h-dvh bg-paper text-ink">
      {mode === 'transport' && (
        <TransportWorkspace solver={transport} onBack={() => setMode('landing')} />
      )}

      {mode === 'assignment' && (
        <AssignmentWorkspace solver={assignment} onBack={() => setMode('landing')} />
      )}

      {mode === 'landing' && <LandingView onSelect={setMode} />}
    </div>
  );
}
