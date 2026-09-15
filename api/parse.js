export default async function handler(req, res) {
    // CORS Permission allow kora
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ status: 'error', message: 'Link paste korun!' });
    }

    try {
        // Step 1: URL theke short_code ber kora
        const cleanUrl = url.trim().replace(/\/$/, ""); 
        const shortCode = cleanUrl.substring(cleanUrl.lastIndexOf('/') + 1);

        if (!shortCode) {
            return res.status(400).json({ status: 'error', message: 'Invalid URL' });
        }

        // Step 2: VPlayer API Call
        const apiKey = "6f9a45a2901e0e83686415cd9365a3889c7a03a847546051aed4afc73f23af77";
        const apiUrl = `https://vplayer.in/api/track_api.php?action=track&short_code=${shortCode}&api_key=${apiKey}`;

        const apiResponse = await fetch(apiUrl);
        const data = await apiResponse.json();

        // Step 3: Response Process kora
        if (data.status === "success" && data.data && data.data.direct_video_url) {
            const directVideoUrl = data.data.direct_video_url;
            
            // File Name extract kora (e.g. zDtiZdEid_720p_1788192799.mp4)
            const fileName = directVideoUrl.substring(directVideoUrl.lastIndexOf('/') + 1);

            // Worker link toiri kora
            const finalVideoUrl = `https://disk.alicebearman6.workers.dev/video/${fileName}`;

            return res.status(200).json({
                status: 'success',
                title: data.data.title || fileName,
                videoUrl: finalVideoUrl
            });
        } else {
            return res.status(400).json({ 
                status: 'error', 
                message: data.message || 'Video direct link paowa jayni' 
            });
        }
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
}
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
