export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Missing image payload" });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server is not configured" });
    }

    const base64 = image.replace(/^data:image\/[^;]+;base64,/, "");

    const params = new URLSearchParams();
    params.append("image", base64);
    params.append("key", apiKey);

    const imgbbRes = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const data = await imgbbRes.json();
    if (!imgbbRes.ok || data.status !== 200) {
      return res
        .status(500)
        .json({ error: data?.error?.message || "Image upload failed" });
    }

    return res.status(200).json({ url: data.data.url });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Upload failed" });
  }
}
