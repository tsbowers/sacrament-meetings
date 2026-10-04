import { signOut } from "@/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/" });
      }}
    >
      <button
        type="submit"
        className="text-sm font-medium text-zinc-500 hover:text-black dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        Sign Out
      </button>
    </form>
  );
}
