import TaskBoard from './components/TaskBoard.jsx';
import courseData from './data/taskCards.json';

function App() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#060912] text-slate-100">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,229,255,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(255,77,166,0.14),transparent_28%),linear-gradient(180deg,rgba(6,9,18,0),#060912_78%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:42px_42px]" />
      </div>

      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
        <header className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Mission Control
          </p>
          <h1 className="text-3xl font-black text-white sm:text-5xl">
            {courseData.courseTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            {courseData.courseGoal}
          </p>
        </header>

        <TaskBoard tasks={courseData.taskCards} />
      </section>
    </main>
  );
}

export default App;
