const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const API_KEY = "7f4ffc80-964a-4397-a7a6-02498761ccfa";

app.get("/api/:player", async (req, res) => {
  try {
    const { player } = req.params;
    const mojangUrl = `https://api.mojang.com/users/profiles/minecraft/${player}`;

    const mojangResponse = await axios.get(mojangUrl);
    const uuid = mojangResponse.data.id;

    const apiUrl = `https://api.hypixel.net/v2/player?uuid=${uuid}`;
    const hypixelResponse = await axios.get(apiUrl, { headers: { "API-Key": API_KEY } });

    const { success, player: hypixelPlayer } = hypixelResponse.data;
    const rank = success ? hypixelPlayer.newPackageRank || "DEFAULT" : "DEFAULT";
    const plusColor = success ? hypixelPlayer.rankPlusColor || "GRAY" : "GRAY";

    res.json({ rank, plusColor });
  } catch (error) {
    res.json({ rank: "DEFAULT", plusColor: "GRAY", error: "NOT EXISTING" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
