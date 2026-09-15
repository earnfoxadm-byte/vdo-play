export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { link } = req.body || {};

  if (!link) {
    return res.status(400).json({ success: false, message: 'Link missing' });
  }

  try {
    // ১. VDiskPro লিঙ্ক থেকে সরাসরি ID/Path বের করার লজিক
    // উদাহরণ: https://vdiskpro.com/yXKZWWBUkB3cs3KKpsNlR29cd -> ID বের করা
    const linkParts = link.trim().split('/');
    const videoId = linkParts[linkParts.length - 1] || linkParts[linkParts.length - 2];

    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Invalid Link Format' });
    }

    // ২. লিঙ্ক প্রসেস করে আপনার Cloudflare Worker-এ পাঠানো
    // (নোট: আপনার Cloudflare Worker URL এখানে সঠিকভাবে আপডেট করুন)
    const workerDomain = "https://disk.alicebearman6.workers.dev"; 
    
    // ফাইল ফরম্যাট তৈরি
    const finalStreamUrl = `${workerDomain}/video/${videoId}`;

    return res.status(200).json({
      success: true,
      stream_url: finalStreamUrl
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
}
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
