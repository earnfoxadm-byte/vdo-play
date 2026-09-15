export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // GET বা POST উভয় মাধ্যমেই লিঙ্ক গ্রহণ করার ব্যবস্থা
        let link = "";
        if (req.method === 'POST') {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            link = body?.link || body?.url || "";
        } else {
            link = req.query?.link || req.query?.url || "";
        }

        if (!link) {
            return res.status(400).json({ success: false, message: 'অনুগ্রহ করে লিঙ্ক দিন!' });
        }

        // Domain / এর শেষের short_code বের করা
        const cleanUrl = link.trim().replace(/\/$/, "");
        const shortCode = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);

        if (!shortCode) {
            return res.status(400).json({ success: false, message: 'Invalid URL or Short Code!' });
        }

        // vplayer API Call
        const apiKey = "6f9a45a2901e0e83686415cd9365a3889c7a03a847546051aed4afc73f23af77";
        const apiUrl = `https://vplayer.in/api/track_api.php?action=track&short_code=${encodeURIComponent(shortCode)}&api_key=${apiKey}`;

        const apiRes = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        if (!apiRes.ok) {
            return res.status(500).json({ success: false, message: `API Error: ${apiRes.status}` });
        }

        const data = await apiRes.json();

        if (data.status === "success" && data.data && data.data.direct_video_url) {
            const directVideoUrl = data.data.direct_video_url;
            
            // File Name extract kora (e.g. zDtiZdEid_720p_1788192799.mp4)
            const fileName = directVideoUrl.substring(directVideoUrl.lastIndexOf('/') + 1);

            // Cloudflare Workers Stream URL toiri
            const streamUrl = `https://disk.alicebearman6.workers.dev/video/${fileName}`;

            return res.status(200).json({
                success: true,
                title: data.data.title || fileName,
                stream_url: streamUrl
            });
        } else {
            return res.status(400).json({
                success: false,
                message: data.message || 'ভিডিও লিঙ্ক পার্স করা সম্ভব হয়নি'
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Server Error: ' + err.message
        });
    }
}
