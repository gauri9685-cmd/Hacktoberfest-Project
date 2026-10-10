/**
 * ============================================================================
 * SAFECAMPUS CONNECT V2 — GROQ AI INFERENCE ENGINE
 * Powered by Groq API + Llama 3.3 70B Versatile
 * Implements:
 *   1. Marketplace Natural Language Database Search (Tool / Function Calling)
 *   2. Frame 36 Health & Mental Wellness AI Assistant
 * ============================================================================
 */

function getGroqAPIKey() {
    if (typeof process !== 'undefined' && process.env && process.env.GROQ_API_KEY) {
        return process.env.GROQ_API_KEY;
    }
    if (typeof window !== 'undefined') {
        if (window.GROQ_API_KEY) return window.GROQ_API_KEY;
        if (localStorage.getItem('GROQ_API_KEY')) return localStorage.getItem('GROQ_API_KEY');
    }
    return "";
}

const GROQ_MODEL = "llama-3.3-70b-versatile";

async function callGroqAPI(payload) {
    const key = getGroqAPIKey();
    let endpoint = "https://api.groq.com/openai/v1/chat/completions";
    const headers = { "Content-Type": "application/json" };

    if (key) {
        headers["Authorization"] = `Bearer ${key}`;
    } else {
        endpoint = "/api/groq";
    }

    const response = await fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Groq API Error (${response.status}): ${response.statusText}`);
    }

    return await response.json();
}

// ----------------------------------------------------------------------------
// 1. MARKETPLACE AI TOOL DEFINITIONS
// ----------------------------------------------------------------------------
const MARKETPLACE_AI_TOOLS = [
    {
        type: "function",
        function: {
            name: "search_marketplace_inventory",
            description: "Search the campus marketplace database for academic items, textbooks, calculators, engineering tools, lab coats, cycles, and hostel supplies available to buy, borrow, or share.",
            parameters: {
                type: "object",
                properties: {
                    search_query: {
                        type: "string",
                        description: "Keywords to search for (e.g., 'calculator', 'drawing drafter', 'maths book', 'cycle', 'kettle')"
                    },
                    category: {
                        type: "string",
                        enum: ["All", "Books & Study Material", "Electronics & Gadgets", "Lab & Engineering", "Hostel Essentials", "Mobility", "Stationery & Tools"],
                        description: "Category filter if specified"
                    },
                    max_price: {
                        type: "number",
                        description: "Maximum budget in INR if specified by student"
                    },
                    only_free: {
                        type: "boolean",
                        description: "Set to true if user specifically asks for free or borrowable items"
                    }
                },
                required: ["search_query"]
            }
        }
    }
];

// ----------------------------------------------------------------------------
// 2. MARKETPLACE DATABASE SEARCH EXECUTOR (CONNECTS TO SUPABASE)
// ----------------------------------------------------------------------------
async function executeMarketplaceSearchTool(args) {
    console.log("🔍 [Marketplace AI Tool Call] Executing database search with args:", args);
    const { search_query, category, max_price, only_free } = args;

    let results = [];

    // 1. Query Supabase Database if available
    if (typeof DatabaseService !== 'undefined' && supabaseClient) {
        try {
            let query = supabaseClient
                .from('marketplace_items')
                .select('*')
                .eq('status', 'available');

            if (category && category !== "All") {
                query = query.ilike('category', `%${category}%`);
            }

            if (only_free) {
                query = query.or('price.ilike.%free%,price.ilike.%borrow%,price.eq.0');
            }

            if (search_query) {
                query = query.or(`title.ilike.%${search_query}%,description.ilike.%${search_query}%,category.ilike.%${search_query}%`);
            }

            const { data, error } = await query.limit(8);
            if (!error && data && data.length > 0) {
                results = data.map(item => ({
                    id: item.id,
                    title: item.title,
                    category: item.category,
                    price: item.price,
                    description: item.description,
                    seller: item.seller_name,
                    hostel: item.seller_hostel,
                    image_url: item.image_url || 'item_calculator.jpg'
                }));
            }
        } catch (e) {
            console.error("Supabase tool query error:", e);
        }
    }

    // 2. Fallback to Local Live Items if DB returns empty
    if (results.length === 0 && typeof liveMarketplaceItems !== 'undefined') {
        const queryLower = (search_query || '').toLowerCase();
        results = liveMarketplaceItems.filter(item => {
            const matchesQuery = !queryLower || 
                item.name.toLowerCase().includes(queryLower) ||
                item.shortDesc.toLowerCase().includes(queryLower) ||
                (item.tags && item.tags.some(t => t.toLowerCase().includes(queryLower)));
            
            const matchesFree = !only_free || item.availabilityPeriod.toLowerCase().includes('free');
            return matchesQuery && matchesFree;
        }).slice(0, 5).map(item => ({
            id: item.id,
            title: item.name,
            category: item.category,
            price: item.availabilityPeriod || 'Free to Borrow',
            description: item.shortDesc,
            seller: item.lenderName,
            hostel: item.lenderHostel,
            image_url: item.image
        }));
    }

    // Filter by max_price if given
    if (max_price && results.length > 0) {
        results = results.filter(item => {
            if (item.price.toLowerCase().includes('free') || item.price.toLowerCase().includes('borrow')) return true;
            const numeric = parseInt(item.price.replace(/[^0-9]/g, ''), 10);
            return isNaN(numeric) || numeric <= max_price;
        });
    }

    return results;
}

// ----------------------------------------------------------------------------
// 3. MARKETPLACE AI QUERY (NATURAL LANGUAGE -> DB TOOL -> RESPONSE)
// ----------------------------------------------------------------------------
async function queryMarketplaceAI(userMessage, chatHistory = []) {
    try {
        const systemPrompt = `You are the SafeCampus Marketplace AI Assistant at BIT Sindri.
You help students find textbooks, calculators, engineering graphics tools, lab coats, bicycles, and hostel room supplies.
When a student asks for any item, ALWAYS call the 'search_marketplace_inventory' tool to check the live campus database.
When items are found:
- Give a brief, enthusiastic 1-2 sentence recommendation.
- Mention prices and who is lending/selling it.
- Encourage them to click on the preview card below to view details or contact the seller.
If no items are found:
- Politely let them know that the item is currently out of stock on campus.
- Suggest checking back soon or uploading a 'Wanted' note in their profile.`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...chatHistory.slice(-6),
            { role: "user", content: userMessage }
        ];

        // Step 1: Initial call to Groq
        const initialData = await callGroqAPI({
            model: GROQ_MODEL,
            messages: messages,
            tools: MARKETPLACE_AI_TOOLS,
            tool_choice: "auto",
            temperature: 0.4,
            max_tokens: 450
        });

        const assistantMsg = initialData.choices[0].message;

        // Step 2: Handle Tool Calls
        if (assistantMsg.tool_calls && assistantMsg.tool_calls.length > 0) {
            const toolCall = assistantMsg.tool_calls[0];
            let toolArgs = {};
            try {
                toolArgs = JSON.parse(toolCall.function.arguments);
            } catch(e) {
                toolArgs = { search_query: userMessage };
            }

            // Execute Database Search
            const matchedItems = await executeMarketplaceSearchTool(toolArgs);

            // Step 3: Send DB results back to Groq for natural response synthesis
            messages.push(assistantMsg);
            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                name: toolCall.function.name,
                content: JSON.stringify(matchedItems)
            });

            const finalData = await callGroqAPI({
                model: GROQ_MODEL,
                messages: messages,
                temperature: 0.5,
                max_tokens: 350
            });

            return {
                text: finalData.choices[0].message.content,
                items: matchedItems
            };
        }

        // If no tool was needed
        return {
            text: assistantMsg.content,
            items: []
        };

    } catch (err) {
        console.error("Marketplace AI error:", err);
        // Fallback response with local search
        const fallbackItems = await executeMarketplaceSearchTool({ search_query: userMessage });
        return {
            text: fallbackItems.length > 0 
                ? `I found ${fallbackItems.length} item(s) matching your request in our campus directory:`
                : `I couldn't find any direct listings for "${userMessage}" right now. Try checking other categories or asking batchmates!`,
            items: fallbackItems
        };
    }
}

// ----------------------------------------------------------------------------
// 4. HEALTH & MENTAL WELLNESS AI (FRAME 36 ASSISTANT)
// ----------------------------------------------------------------------------
async function queryHealthAI(userMessage, chatHistory = []) {
    try {
        const systemPrompt = `You are the SafeCampus Health & Wellness AI Assistant for students at BIT Sindri.
You provide compassionate, supportive, and practical mental and physical wellness advice.
Cover topics like exam stress, headaches, fatigue, hydration, hostel sleep hygiene, anxiety, and mild illness.
Guidelines:
- Keep answers concise, warm, empathetic, and formatted in 2-3 short paragraphs or bullet points.
- Always include a reminder that you provide general wellness guidance.
- For severe symptoms or medical emergencies, explicitly recommend visiting the BIT Sindri Campus Health Center (near Central Gate) or contacting the on-call doctor (+91 9431102934) / Student Counseling Cell (+91 9835123490).`;

        const messages = [
            { role: "system", content: systemPrompt },
            ...chatHistory.slice(-6),
            { role: "user", content: userMessage }
        ];

        const data = await callGroqAPI({
            model: GROQ_MODEL,
            messages: messages,
            temperature: 0.6,
            max_tokens: 350
        });

        return data.choices[0].message.content;

    } catch (err) {
        console.error("Health AI error:", err);
        return "I'm having a brief connection delay, but remember your health is important. If you are feeling unwell or anxious, please stay hydrated, take deep breaths, and visit the BIT Sindri Health Center or contact our on-call doctor at +91 9431102934.";
    }
}
