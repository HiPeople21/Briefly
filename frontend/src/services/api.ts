<<<<<<< HEAD
import { BriefingData, BriefingTopic } from '../types';
=======
import { BriefingData, BriefingTopic, BriefingLocation } from '../types';

>>>>>>> 2aac3696aed8cad3e255b019c99fc226d658a207

export const generateScript = async (topic: string): Promise<BriefingData> => {
    try {
        const response = await fetch('http://localhost:8000/generate-script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
<<<<<<< HEAD
            body: JSON.stringify({ topic }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate script: ${response.statusText}`);
        }

        const data = await response.json();

        // Use a dummy structure for now as video script endpoint might return different data
        // For now constructing a minimal BriefingData to satisfy the type
=======
            sources: (parsed.sources || []).map((source: any) => ({
                account_handle: source.account_handle || `@user_${Math.random().toString(36).substr(2, 9)}`,
                display_name: source.display_name || "Source",
                excerpt: source.excerpt || "",
                time_ago: source.time_ago || "just now",
                post_url: source.post_url || "https://x.com",
                label: source.label || "official"
            })).slice(0, 5)
        };
    } catch (e) {
        // Fallback if JSON parsing fails
>>>>>>> 2aac3696aed8cad3e255b019c99fc226d658a207
        return {
            id: `script_${Date.now()}`,
            topic: 'global' as BriefingTopic,
            generated_at: new Date().toISOString(),
            headline: `Video Script: ${topic}`,
            summary: data.script,
            status: "developing",
            video_url: "",
            script: {
                headline: `Script: ${topic}`,
                confirmed_facts: [],
                unconfirmed_claims: [],
                recent_changes: [],
                watch_next: []
            },
            sources: [],
            audio_url: ""
        };
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

<<<<<<< HEAD
export const generateBriefing = async (topic: BriefingTopic): Promise<BriefingData> => {
    try {
        const response = await fetch('http://localhost:8000/generate-briefing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topic
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Parse the script JSON string that comes from the backend
        let parsedScript;
        try {
            // Handle case where script might be already parsed or string
            parsedScript = typeof data.script === 'string' ? JSON.parse(data.script) : data.script;
        } catch (e) {
            console.error("Failed to parse script JSON", e);
            // Fallback object to prevent crash
            parsedScript = {};
        }

        // Transform backend response to frontend BriefingData format
=======
const parseBriefing = (topic: BriefingTopic, content: string): BriefingData => {
    try {
        const parsed = JSON.parse(content);

>>>>>>> 2aac3696aed8cad3e255b019c99fc226d658a207
        return {
            id: `briefing_${Date.now()}`,
            topic,
            generated_at: new Date().toISOString(),
            headline: parsedScript.headline || "Briefing Generated",
            summary: parsedScript.summary || "",
            status: "confirmed",
            video_url: "",
            script: {
                headline: parsedScript.headline || topic,
                confirmed_facts: parsedScript.confirmed_facts || [],
                unconfirmed_claims: parsedScript.unconfirmed_claims || [],
                recent_changes: parsedScript.recent_changes || [],
                watch_next: parsedScript.watch_next || []
            },
<<<<<<< HEAD
            sources: parsedScript.sources || [],
            audio_url: data.audio_url || ""
=======
            sources: (parsed.sources || []).map((source: any, idx: number) => ({
                account_handle: source.account_handle || `@user_${Math.random().toString(36).substr(2, 9)}`,
                display_name: source.display_name || "Briefing Source",
                excerpt: source.excerpt || parsed.confirmed_facts?.[idx] || "",
                time_ago: source.time_ago || "just now",
                post_url: source.post_url || "https://x.com",
                profile_image_url: source.profile_image_url || undefined,
                label: source.label || "official"
            })).slice(0, 5),
            media: (parsed.media || []).map((item: any) => ({
                url: item.url || "",
                type: item.type || "image",
                caption: item.caption || "Related content",
                sourceUrl: item.sourceUrl || undefined
            })).slice(0, 6)
        };
    } catch (e) {
        return {
            id: `briefing_${Date.now()}`,
            topic,
            generated_at: new Date().toISOString(),
            headline: topic,
            summary: content || "Generated briefing from Grok AI",
            status: "confirmed",
            video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            script: {
                headline: topic,
                confirmed_facts: [content || "Content generated"],
                unconfirmed_claims: [],
                recent_changes: [],
                watch_next: []
            },
            sources: []
>>>>>>> 2aac3696aed8cad3e255b019c99fc226d658a207
        };
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const generateBriefing = async (topic: BriefingTopic): Promise<BriefingData> => {
    const response = await fetch('http://localhost:8000/generate-briefing', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
    });

    if (!response.ok) {
        throw new Error(`Failed to generate briefing: ${response.statusText}`);
    }

    const data = await response.json();
    return parseBriefing(topic, data.script);
};

export const streamBriefing = (
    topic: BriefingTopic,
    location: BriefingLocation,
    handlers: {
        onChunk?: (chunk: string) => void;
        onResult?: (data: BriefingData) => void;
        onError?: (message: string) => void;
    }
) => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const host = window.location.hostname || 'localhost';
    const ws = new WebSocket(`${protocol}://${host}:8000/ws/briefing`);

    ws.onopen = () => {
        handlers.onChunk?.('Connected. Warming up Grok...\n');
        ws.send(JSON.stringify({ topic, location }));
    };

    ws.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'chunk' && msg.content) {
                // Don't show raw JSON chunks in thinking - only show in final result
            } else if (msg.type === 'thinking' && msg.content) {
                handlers.onChunk?.(msg.content);
            } else if (msg.type === 'tool' && msg.content) {
                handlers.onChunk?.(msg.content);
            } else if (msg.type === 'status' && msg.content) {
                handlers.onChunk?.(msg.content);
            } else if (msg.type === 'result') {
                handlers.onResult?.(parseBriefing(topic, msg.content || ''));
            } else if (msg.type === 'error') {
                handlers.onError?.(msg.message || 'Unknown error');
            }
        } catch (e) {
            handlers.onError?.('Failed to parse streaming message');
        }
    };

    ws.onerror = () => {
        handlers.onError?.('WebSocket error');
    };

    ws.onclose = () => {
        // Notify only if nothing arrived
        handlers.onChunk?.('Connection closed.');
    };

    return () => ws.close();
};