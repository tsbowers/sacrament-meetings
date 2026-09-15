export default function Footer() {
  return (
    <footer className="mt-auto border-t border-black/10 py-6 dark:border-white/10">
      <div className="mx-auto max-w-3xl px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          &copy; {new Date().getFullYear()} TODO Ward. All talks and hymns
          subject to change.
        </p>
      </div>
    </footer>
  );
}
