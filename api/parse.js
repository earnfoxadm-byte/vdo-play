export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { link } = req.body || {};

  try {
    const fileName = "45639-2_480p_1788380508.mp4"; 

    // আপনার Cloudflare Worker URL এখানে বসাবেন
    const workerDomain = "https://my-proxy.subdomain.workers.dev";
    const finalStreamUrl = `${workerDomain}/video/${fileName}`;

    return res.status(200).json({ success: true, stream_url: finalStreamUrl });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}
