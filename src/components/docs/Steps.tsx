export function Steps({ children }: { children: React.ReactNode }) {
    return <div className="space-y-12">{children}</div>;
  }
  
  Steps.Step = function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
    return (
      <div className="border-l-2 border-purple-600 pl-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{number}</span>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
        </div>
        <div>{children}</div>
      </div>
    );
  };