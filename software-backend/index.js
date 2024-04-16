const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors')
// Initialize Firebase Admin with service account
const serviceAccount = require('./lifesaverengineersvitaltracker-firebase-adminsdk-5krn7-56e7fe7ae8.json');
const app = express();
const port = process.env.PORT || 3001;
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors({
  origin: 'http://localhost:3000' // Adjust the port to match your frontend
}));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'lifesaverengineersvitaltracker.appspot.com'
});


app.get('/profile-image/:userId', async (req, res) => {
  const bucket = admin.storage().bucket();
  const prefix = `profileImages/${req.params.userId}/`;
  try {
    const [files] = await bucket.getFiles({ prefix: prefix });
    if (files.length > 0) {
      const firstFile = files[0];
      const expiresAt = Date.now() + 300 * 1000; // URL expires in 5 minutes
      const signedUrl = await firstFile.getSignedUrl({
        action: 'read',
        expires: expiresAt
      });

      console.log(signedUrl);
      // Send the signed URL back to the client
      res.send({ url: signedUrl[0] });
    } else {
      res.status(404).send('No images found');
    }
  } catch (error) {
    console.error('Failed to retrieve images or generate signed URL', error);
    res.status(500).send('Failed to generate signed URL');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});