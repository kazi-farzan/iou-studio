export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[rgba(255,255,255,0.02)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-8 text-sm sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className="text-sm font-medium text-white">IOU Labs</p>
          <p className="mt-1 text-[var(--text-secondary)]">
            Precision systems for product, brand, design, and growth.
          </p>
        </div>

        <p className="text-[var(--text-muted)]">
          Built to feel fast, clear, and premium from the first interaction.
        </p>
      </div>
    </footer>
  );
}
