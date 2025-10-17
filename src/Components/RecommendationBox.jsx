import { useState } from "react";
import { queryAI, simulateAI } from "../utils/aiClient";
import products from "../Data/Products";

export default function RecommendationBox({ onRecommend }) {
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const buildPrompt = (userInput) => {
        return `
Here is the product list in JSON:
${JSON.stringify(products, null, 2)}

User message:
"${userInput}"

Task:
Recommend up to 5 products from the list above, based on the user's message.
Respond ONLY as a JSON array of objects like:
[
  { "name": "Product name (must match list)", "reason": "short reason why recommended" }
]
If you cannot find an exact name, use the closest matching product name from the list.
`;
    };

    const extractJsonFromText = (text) => {
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");
        if (start !== -1 && end !== -1 && end > start) {
            const sub = text.substring(start, end + 1);
            try {
                const parsed = JSON.parse(sub);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
            }
        }
        try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) { }
        return null;
    };

    const mapToLocalProducts = (aiRecs) => {
        const local = products;
        const results = [];
        for (const r of aiRecs) {
            const name = (r.name || "").trim();
            if (!name) continue;
            let found = local.find(p => p.name.toLowerCase() === name.toLowerCase());
            if (!found) {
                found = local.find(p => p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase()));
            }
            if (!found) {
                const words = name.toLowerCase().split(/\s+/);
                found = local.find(p => words.some(w => p.category && p.category.toLowerCase().includes(w)));
            }
            if (!found && r.reason) {
                const m = r.reason.match(/\$?(\d{2,4})/);
                if (m) {
                    const limit = parseInt(m[1], 10);
                    found = local
                        .slice()
                        .sort((a, b) => Math.abs(a.price - limit) - Math.abs(b.price - limit))[0];
                }
            }
            if (found) {
                results.push({ ...found, reason: r.reason || "" });
            } else {
                results.push({ id: `ai-${name}`, name, reason: r.reason || "" });
            }
        }
        return results;
    };

    const handleRecommend = async () => {
        setLoading(true);
        setError("");
        try {
            const prompt = buildPrompt(input);

            let aiText;
            try {
                aiText = await queryAI(prompt);
            } catch (err) {
                if (err.message === "NO_API_KEY") {
                    aiText = simulateAI(prompt);
                } else {
                    aiText = simulateAI(prompt);
                }
            }

            let aiRecs = extractJsonFromText(aiText);
            if (!aiRecs) {
                const lines = aiText.split("\n").map(l => l.trim()).filter(Boolean);
                aiRecs = lines.slice(0, 5).map(l => {
                    const parts = l.split(" - ");
                    return { name: parts[0].replace(/^\d+\.\s*/, "").trim(), reason: parts.slice(1).join(" - ").trim() || "" };
                });
            }

            const mapped = mapToLocalProducts(aiRecs);
            onRecommend(mapped);
        } catch (e) {
            setError("Failed to get recommendations.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recommend-box p-6 bg-indigo-50 rounded-xl shadow-2xl h-full flex flex-col justify-start">
            <h2 className="text-2xl font-bold mb-4 text-indigo-900 border-b pb-2 border-indigo-200">
                AI Product Recommender
            </h2>
            <input
                type="text"
                placeholder='Ex: "I want a phone under 500"'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-3 mb-4 border-2 border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 shadow-inner"
            />
            <button
                onClick={handleRecommend}
                disabled={!input || loading}
                className={`
                w-full p-3 text-lg font-semibold rounded-lg shadow-md transition duration-300
                ${loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white active:bg-indigo-800"
                    }
                disabled:opacity-50
            `}
            >
                {loading ? "Thinking..." : "Get Recommendations"}
            </button>
            {error && (
                <p className="error mt-3 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg font-medium">
                    !Error: {error}
                </p>
            )}
        </div>
    );
}
