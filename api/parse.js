module.exports = async (req, res) => {
  // Set CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { link } = req.body || {};

  if (!link) {
    return res.status(400).json({ success: false, message: 'Link is required' });
  }

  try {
    // ১. vplayer API-তে POST Request পাঠানো
    const response = await fetch('https://vplayer.in/api/vplayer/android/file1.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        'Accept': 'application/json',
        'Host': 'vplayer.in'
      },
      body: JSON.stringify({ link: link })
    });

    const data = await response.json();

    // ২. লিঙ্ক রেসপন্স চেক করা
    if (data && data.link) {
      // https://f0518.backblazeb2.com/file/teraboxvideo/45639-2_480p_1788380508.mp4
      // লিঙ্ক থেকে শুধুমাত্র ফাইলের নাম এক্সট্র্যাক্ট করা (45639-2_480p_1788380508.mp4)
      const fileName = data.link.split('/').pop();

      // ৩. আপনার Cloudflare Worker এর ডোমেইনে কনভার্ট করা
      const workerDomain = "https://disk.alicebearman6.workers.dev";
      const finalStreamUrl = `${workerDomain}/video/${fileName}`;

      return res.status(200).json({
        success: true,
        stream_url: finalStreamUrl
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'vplayer API থেকে লিঙ্ক উদ্ধার করা যায়নি' 
      });
    }

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Server Error: ' + error.message 
    });
  }
};
      stream_url: finalStreamUrl
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

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
