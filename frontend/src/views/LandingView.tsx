import type { WorkspaceMode } from '@/types/domain';
import { ThemeToggle } from '@/components/shared/ThemeToggle';

interface LandingViewProps {
  onSelect: (mode: WorkspaceMode) => void;
}

export function LandingView({ onSelect }: LandingViewProps) {
  return (
    <div className="h-dvh overflow-y-auto grain flex flex-col bg-paper text-ink min-h-dvh relative">
      <div className="absolute top-6 right-6 lg:top-10 lg:right-16 z-10">
        <ThemeToggle />
      </div>
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-8 lg:px-16 py-14 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-20 items-center min-h-[75vh]">
          <div className="animate-fade-up">
            <p className="font-mono text-ui-sm text-coral uppercase tracking-[0.2em] mb-8">
              Programación matemática
            </p>
            <h1 className="font-display text-[clamp(2.75rem,7vw,5rem)] font-semibold leading-[1.05] tracking-tight text-ink text-balance">
              Resuelve flujos.
              <br />
              <span className="text-ink-soft italic font-normal">Asigna con precisión.</span>
            </h1>
            <p className="mt-8 text-ui-lg text-ink-soft max-w-xl leading-relaxed text-balance">
              Un estudio interactivo para problemas de transporte y asignación.
              Sin plantillas: cada módulo es un espacio de trabajo dedicado con
              visualización paso a paso.
            </p>
            <div className="mt-12 flex flex-wrap items-center gap-8 text-ui-base text-ink">
              <span className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-coral" />
                3 heurísticas de transporte
              </span>
              <span className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-violet" />
                Método húngaro
              </span>
            </div>
          </div>

          <div className="relative flex flex-col gap-6 lg:pl-10">
            <button
              type="button"
              onClick={() => onSelect('transport')}
              className="group panel p-10 text-left transition-all duration-300
                hover:shadow-lift hover:-translate-y-1 lg:rotate-[-1.5deg] lg:origin-right
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
            >
              <span className="font-mono text-ui-sm text-coral uppercase tracking-widest">
                Módulo 01
              </span>
              <h2 className="font-display text-3xl font-semibold text-ink mt-3 group-hover:text-coral transition-colors">
                Problema de transporte
              </h2>
              <p className="text-ui-base text-ink-soft mt-3 leading-relaxed max-w-md">
                Matriz de costos con ofertas y demandas. Costo mínimo, esquina noroeste
                o Vogel — con timeline iterativo.
              </p>
              <span className="inline-flex mt-8 font-mono text-ui-sm text-coral group-hover:translate-x-1 transition-transform">
                Abrir espacio →
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelect('assignment')}
              className="group panel p-10 text-left transition-all duration-300
                hover:shadow-lift hover:-translate-y-1 lg:ml-14 lg:rotate-[1deg]
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet"
            >
              <span className="font-mono text-ui-sm text-violet uppercase tracking-widest">
                Módulo 02
              </span>
              <h2 className="font-display text-3xl font-semibold text-ink mt-3 group-hover:text-violet-soft transition-colors">
                Problema de asignación
              </h2>
              <p className="text-ui-base text-ink-soft mt-3 leading-relaxed max-w-md">
                Matriz cuadrada de costos. Algoritmo húngaro con cobertura de ceros
                y asignación óptima.
              </p>
              <span className="inline-flex mt-8 font-mono text-ui-sm text-violet group-hover:translate-x-1 transition-transform">
                Abrir espacio →
              </span>
            </button>
          </div>
        </div>
      </div>

      <footer className="border-t border-paper-muted/50 py-5 px-8 lg:px-16">
        <p className="font-mono text-ui-sm text-ink uppercase tracking-widest text-center">
          Fluxo — Optimización lineal interactiva
        </p>
      </footer>
    </div>
  );
}
