import axios from "axios";
const MODEL = "meta-llama/llama-3.1-70b-instruct";
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function queryAI(prompt) {
    const key = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!key) throw new Error("NO_API_KEY");
    const payload = {
        model: MODEL,
        messages: [
            { role: "system", content: "You are an assistant that recommends products from the provided JSON list. Respond in JSON array format: [{\"name\":\"...\",\"reason\":\"...\"}]" },
            { role: "user", content: prompt }
        ],
        max_tokens: 512,
        temperature: 0.0
    };
    const res = await axios.post(API_URL, payload, {
        headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
        },
    });
    return res.data?.choices?.[0]?.message?.content ?? "";
}

export function simulateAI(prompt) {
    const q = prompt.toLowerCase();
    const recs = [];
    if (q.includes("phone")) {
        if (q.match(/\bunder\s*\$?(\d+)\b/)) {
            const price = parseInt(q.match(/\bunder\s*\$?(\d+)\b/)[1], 10);
            recs.push({ name: "Samsung Galaxy A54", reason: `Affordable phone under $${price}` });
            if (price >= 300) recs.push({ name: "Redmi Note 12", reason: `Budget option under $${price}` });
        } else {
            recs.push({ name: "Samsung Galaxy A54", reason: "Popular mid-range phone" });
            recs.push({ name: "iPhone 14", reason: "Premium choice" });
        }
    } else if (q.includes("laptop")) {
        if (q.includes("budget") || q.includes("under")) {
            recs.push({ name: "Dell Inspiron", reason: "Good value laptop" });
        } else {
            recs.push({ name: "HP Pavilion", reason: "Performance laptop" });
        }
    } else if (q.includes("watch") || q.includes("smartwatch")) {
        recs.push({ name: "Apple Watch SE", reason: "Feature-rich smartwatch" });
        recs.push({ name: "NoiseFit Smartwatch", reason: "Budget smartwatch" });
    } else {
        recs.push({ name: "Samsung Galaxy A54", reason: "Versatile phone choice" });
        recs.push({ name: "Dell Inspiron", reason: "General-purpose laptop" });
    }
    return JSON.stringify(recs, null, 2);
}
