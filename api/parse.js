module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { link } = req.body || {};

    if (!link) {
      return res.status(400).json({ success: false, message: 'Link missing' });
    }

    // লিঙ্ক থেকে ID বা ফাইলের নাম বের করা
    const cleanLink = link.trim().replace(/\/$/, "");
    const videoId = cleanLink.split('/').pop();

    if (!videoId) {
      return res.status(400).json({ success: false, message: 'Invalid Link' });
    }

    // আপনার Cloudflare Worker URL
    const workerDomain = "https://disk.alicebearman6.workers.dev";
    const finalStreamUrl = `${workerDomain}/video/${videoId}`;

    return res.status(200).json({
      success: true,
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
