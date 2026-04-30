const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: true }));
app.use(cors());

const serviceAccount = require("./wercatalyst-panel/wercatelyst-6e4c14507f32.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://wercatelyst-default-rtdb.firebaseio.com"
});

app.post("/api/send-notif", async (req, res) => {
  const { title, body, image } = req.body;

  if (!title || !body) {
    return res.status(400).json({ success: false, error: "Title and Body are required" });
  }

  const message = {
    // 1. Common Notification Object
    notification: {
      title: title,
      body: body,
      ...(image && { image: image }) 
    },
    
    // 2. Android Specific (Missing link was here)
    android: {
      priority: "high", // Notification priority
      notification: {
        image: image || "", // Android ko image dikhane ke liye yahan bhi chahiye
        sound: "default",
        clickAction: "FLUTTER_NOTIFICATION_CLICK", // Case-sensitive check karein
        channelId: "high_importance_channel" // Ensure your app has this channel
      }
    },

    // 3. Data payload (Optional but good for background handling)
    data: {
      title: title,
      body: body,
      image: image || ""
    },

    // 4. Topic (Make sure App is subscribed to THIS exact string)
    topic: "all_riders", 
    
    apns: {
      payload: {
        aps: {
          sound: "default",
          badge: 1,
          'mutable-content': 1 // iOS image support ke liye zaroori
        }
      },
      fcm_options: {
        image: image || ""
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Successfully sent message:", response);
    res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    console.error("❌ Firebase Messaging Error:", error.code, error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Admin API is running on http://localhost:${PORT}`);
});