import { useState } from "react";

export default function SignInPage() {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("Authentication is a planned post-MVP feature. This screen is a prototype placeholder.");
  };

  return (
    <main className="page">
      <section className="panel panel-form">
        <h2>Sign In (Prototype)</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="name@example.com" required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="********" required />
          <button className="primary-btn" type="submit">
            Sign In
          </button>
        </form>
        {message ? <p className="panel-note">{message}</p> : null}
      </section>
    </main>
  );
}

