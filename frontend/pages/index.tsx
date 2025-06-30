import { useState, FormEvent } from "react";

interface Observation {
  id?: number;
  location: string;
  clarity: string;
}

export default function Home() {
  const [form, setForm] = useState<Observation>({ location: "", clarity: "" });
  const [message, setMessage] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitObservation = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/observations/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setMessage("✅ Observation submitted!");
        setForm({ location: "", clarity: "" });
      } else {
        const errText = await response.text();
        setMessage(`❌ Submission failed: ${errText}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("❌ Network error.");
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Lake Observation Form 🌊</h1>
      <form onSubmit={submitObservation} style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
        <input
          name="clarity"
          placeholder="Clarity Description"
          value={form.clarity}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}

