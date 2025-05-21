import { useTransition } from "react";
import { Link, redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export async function loader() {
  try {
    const user = await authClient.getSession();
    if (user.data?.user.id) {
      return redirect("/");
    }
  } catch (error) {
    console.error("Error loading client session:", error);
  }
}

export default function SignIn() {
  const [loggingIn, startLogin] = useTransition();
  const loginWithGoogle = async () => {
    startLogin(async () => {
      await authClient.signIn.social({
        provider: "google",
      });
    });
  };

  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center p-6">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/">
              <img
                src="/assets/icons/logo.svg"
                alt="Logo"
                className="size-[30px]"
              />
            </Link>
            <h1 className="p-28-bold text-dark-100">Tourvisto</h1>
          </header>
          <article>
            <h2 className="p-28-semibold text-dark-100 text-center">
              Start you Travel Journey
            </h2>
            <p className="p-18-regular text-center text-gray-100 !leading-7">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease.
            </p>
          </article>
          <Button
            onClick={loginWithGoogle}
            disabled={loggingIn}
            variant="ghost"
            className="button-class h-11 w-full cursor-pointer"
          >
            <img
              src="/assets/icons/google.svg"
              alt="Google"
              className="e-search-icon size-5"
            />
            <span className="p-18-semibold text-white">
              {loggingIn ? "Signing in..." : "Sign in with Google"}
            </span>
          </Button>
        </div>
      </section>
    </main>
  );
}
