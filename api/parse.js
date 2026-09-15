export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { link } = req.body || {};

  if (!link) {
    return res.status(400).json({ success: false, message: 'Link is required' });
  }

  try {
    // ১. অ্যাপটি যে API ব্যবহার করছে, সরাসরি সেখানে Request পাঠানো
    const response = await fetch('https://vplayer.in/api/vplayer/android/file1.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ link: link })
    });

    const data = await response.json();

    // ২. যদি Backblaze URL পাওয়া যায় (যেমন: https://f0518.backblazeb2.com/file/teraboxvideo/45639-2_480p_1788380508.mp4)
    if (data && data.link) {
      // লিঙ্ক থেকে ফাইল নেম বের করা
      const fileName = data.link.split('/').pop();

      // ৩. আপনার Cloudflare Worker দিয়ে বাইপাস স্ট্রিম লিঙ্ক তৈরি
      // (এখানে আপনার Worker URL সঠিক আছে কিনা দেখে নিন)
      const workerDomain = "https://disk.alicebearman6.workers.dev"; // আপনার তৈরি করা Worker URL বসাবেন
      const finalStreamUrl = `${workerDomain}/video/${fileName}`;

      return res.status(200).json({
        success: true,
        stream_url: finalStreamUrl
      });
    } else {
      return res.status(400).json({ success: false, message: 'Failed to extract video link from server' });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
