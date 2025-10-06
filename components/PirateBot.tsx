"use client";
import { useState, useRef, useEffect } from "react";

type Message = {
  sender: "ai" | "user";
  text: string;
};

export default function PirateBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [character, setCharacter] = useState("pirate");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onSubmit: React.FormEventHandler = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { text: input, sender: "user" },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, character }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, { text: data.reply, sender: "ai" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Something went wrong." },
      ]);
    }
  };

  return (
    <main className="flex flex-col h-full w-full bg-[#343541] text-white">
      {/* Header */}
      <header className="p-4 border-b border-gray-700 text-center">
        <h1 className="text-xl font-semibold capitalize">
          {character} Chat Bot
        </h1>
      </header>

      {/* Character Selector */}
      <div className="p-4 bg-[#40414F] text-sm flex justify-center gap-2 border-b border-gray-700">
        <label htmlFor="character" className="text-gray-300 p-2">
          Character:
        </label>
        <select
          id="character"
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
          className="rounded bg-[#343541] border p-2 border-gray-600 text-white focus:outline-none"
        >
          <option value="pirate">Pirate</option>
          <option value="robot">Robot</option>
          <option value="ninja">Ninja</option>
          <option value="wizard">Wizard</option>
          <option value="viking">Viking</option>
          <option value="alien">Alien</option>
          <option value="detective">Detective</option>
          <option value="chef">Chef</option>
          <option value="superhero">Superhero</option>
          <option value="fairy">Fairy</option>
          <option value="human frog">Human Frog</option>
        </select>
      </div>

      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                msg.sender === "user"
                  ? "bg-[#10A37F] text-white"
                  : "bg-[#444654] text-gray-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <form
        onSubmit={onSubmit}
        className="p-4 bg-[#40414F] flex gap-2 border-t border-gray-700"
      >
        <input
          type="text"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-[#343541] text-white border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#10A37F]"
        />
        <button
          type="submit"
          className="bg-[#10A37F] px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-all"
        >
          Send
        </button>
      </form>
    </main>
  );
}
