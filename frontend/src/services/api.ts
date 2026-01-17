import { BriefingData, BriefingTopic } from '../types';

export const generateScript = async (topic: string): Promise<BriefingData> => {
    try {
        const response = await fetch('http://localhost:8000/generate-script', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate script: ${response.statusText}`);
        }

        const data = await response.json();

        // Use a dummy structure for now as video script endpoint might return different data
        // For now constructing a minimal BriefingData to satisfy the type
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
            sources: parsedScript.sources || [],
            audio_url: data.audio_url || ""
        };
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};