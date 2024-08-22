const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
require('dotenv').config();

admin.initializeApp();

const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

exports.sendSignUpNotification = functions.firestore
  .document('signupRequests/{requestId}')
  .onCreate(async (snap, context) => {
    const newRequest = snap.data();

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: 'New Sign Up Request',
      html: `<p>A new user has requested to sign up:</p>
             <p>Email: ${newRequest.email}</p>
             <p>First Name: ${newRequest.firstName}</p>
             <p>Last Name: ${newRequest.lastName}</p>
             <p>Click <a href="https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/approveSignUp?requestId=${context.params.requestId}">here</a> to approve the request.</p>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent to:', process.env.ADMIN_EMAIL);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });

exports.approveSignUp = functions.https.onRequest(async (req, res) => {
  const requestId = req.query.requestId;
  const requestDoc = await db.collection('signupRequests').doc(requestId).get();

  if (!requestDoc.exists) {
    return res.status(404).send('Request not found');
  }

  const requestData = requestDoc.data();

  try {
    const userRecord = await admin.auth().createUser({
      email: requestData.email,
      password: requestData.password,
      displayName: `${requestData.firstName} ${requestData.lastName}`,
    });

    await db.collection('users').doc(userRecord.uid).set({
      firstName: requestData.firstName,
      lastName: requestData.lastName,
      email: requestData.email,
    });

    await db.collection('signupRequests').doc(requestId).update({ status: 'approved' });

    res.send('User approved and created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user: ' + error.message);
  }
});
