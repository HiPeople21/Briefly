import { BriefingData, BriefingTopic, VideoScript } from '../types';

const MOCK_SOURCE_IMAGES = [
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&auto=format&fit=crop&q=60"
];

export const generateScript = async (topic: string): Promise<BriefingData> => {
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
    
    try {
        // Parse the JSON response from Grok
        const parsed = JSON.parse(data.script);
        
        // Transform into BriefingData structure
        return {
            id: `briefing_${Date.now()}`,
            topic: 'tech' as BriefingTopic,
            generated_at: new Date().toISOString(),
            headline: parsed.headline || topic,
            summary: parsed.summary || "Generated content from Grok AI",
            status: "confirmed",
            video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            script: {
                headline: parsed.headline || topic,
                confirmed_facts: parsed.confirmed_facts || [],
                unconfirmed_claims: parsed.unconfirmed_claims || [],
                recent_changes: parsed.recent_changes || [],
                watch_next: parsed.watch_next || []
            },
            sources: (parsed.sources || []).map((source: any) => ({
                account_handle: source.account_handle || `@user_${Math.random().toString(36).substr(2, 9)}`,
                display_name: source.display_name || "Source",
                excerpt: source.excerpt || "",
                time_ago: source.time_ago || "just now",
                post_url: source.post_url || "https://x.com",
                label: (source.label || "official") as const
            })).slice(0, 5)
        };
    } catch (e) {
        // Fallback if JSON parsing fails
        return {
            id: `briefing_${Date.now()}`,
            topic: 'tech' as BriefingTopic,
            generated_at: new Date().toISOString(),
            headline: topic,
            summary: data.script || "Generated content from Grok AI",
            status: "confirmed",
            video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            script: {
                headline: topic,
                confirmed_facts: [data.script || "Content generated"],
                unconfirmed_claims: [],
                recent_changes: [],
                watch_next: []
            },
            sources: []
        };
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
    
    try {
        // Parse the JSON response from Grok
        const parsed = JSON.parse(data.script);
        
        // Transform into BriefingData structure
        return {
            id: `briefing_${Date.now()}`,
            topic,
            generated_at: new Date().toISOString(),
            headline: parsed.headline || topic,
            summary: parsed.summary || "Generated briefing from Grok AI",
            status: "confirmed",
            video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            script: {
                headline: parsed.headline || topic,
                confirmed_facts: parsed.confirmed_facts || [],
                unconfirmed_claims: parsed.unconfirmed_claims || [],
                recent_changes: parsed.recent_changes || [],
                watch_next: parsed.watch_next || []
            },
            sources: (parsed.sources || []).map((source: any) => ({
                account_handle: source.account_handle || `@user_${Math.random().toString(36).substr(2, 9)}`,
                display_name: source.display_name || "Briefing Source",
                excerpt: source.excerpt || "",
                time_ago: source.time_ago || "just now",
                post_url: source.post_url || "https://x.com",
                label: (source.label || "official") as const
            })).slice(0, 5)
        };
    } catch (e) {
        // Fallback if JSON parsing fails
        return {
            id: `briefing_${Date.now()}`,
            topic,
            generated_at: new Date().toISOString(),
            headline: topic,
            summary: data.script || "Generated briefing from Grok AI",
            status: "confirmed",
            video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            script: {
                headline: topic,
                confirmed_facts: [data.script || "Content generated"],
                unconfirmed_claims: [],
                recent_changes: [],
                watch_next: []
            },
            sources: []
        };
    }
};