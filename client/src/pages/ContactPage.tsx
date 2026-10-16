import { FormEvent, useState } from "react";
import { Mail, Send } from "lucide-react";
export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subject = encodeURIComponent(
      form.subject || `Website message from ${form.name}`,
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:hello@chichebe.dev?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };
  return (
    <section className="site-container py-14 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <p className="eyebrow">LET’S TALK</p>
          <h1 className="page-title">
            Have a good
            <br />
            <span className="text-primary">problem to solve?</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-8 text-base-content/65">
            For project collaborations, technical conversations, or
            opportunities to build something useful, send a message.
          </p>
          <a
            href="mailto:hello@chichebe.dev"
            className="mt-7 inline-flex items-center gap-3 font-semibold hover:text-primary"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Mail size={19} />
            </span>
            hello@chichebe.dev
          </a>
          <p className="mt-8 text-xs leading-6 text-base-content/45">
            Update the placeholder email address in this page before deploying
            your site.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-soft sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="form-control gap-2">
              <span className="label-text font-semibold">Your name</span>
              <input
                required
                minLength={2}
                maxLength={100}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Ada Lovelace"
              />
            </label>
            <label className="form-control gap-2">
              <span className="label-text font-semibold">Email address</span>
              <input
                required
                type="email"
                maxLength={254}
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="input input-bordered w-full"
                placeholder="ada@example.com"
              />
            </label>
          </div>
          <label className="form-control mt-5 gap-2">
            <span className="label-text font-semibold">Subject</span>
            <input
              maxLength={140}
              value={form.subject}
              onChange={(event) =>
                setForm({ ...form, subject: event.target.value })
              }
              className="input input-bordered w-full"
              placeholder="What would you like to discuss?"
            />
          </label>
          <label className="form-control mt-5 gap-2">
            <span className="label-text font-semibold">Message</span>
            <textarea
              required
              minLength={10}
              maxLength={5000}
              rows={6}
              value={form.message}
              onChange={(event) =>
                setForm({ ...form, message: event.target.value })
              }
              className="textarea textarea-bordered w-full resize-y"
              placeholder="Tell me a little about it..."
            />
          </label>
          <button
            className="btn btn-primary mt-6 w-full sm:w-auto"
            type="submit"
          >
            Open email draft <Send size={16} />
          </button>
          {submitted && (
            <p className="mt-3 text-sm text-success">
              Your email app should open with the message prepared. Send it from
              your email app to complete delivery.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
