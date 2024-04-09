const firebaseConfig = {
	apiKey: process.env.REACT_APP_FBAPIKEY,
	authDomain: process.env.REACT_APP_FBAUTHDOMAIN,
	databaseURL: process.env.REACT_APP_FBDATABASEURL,
	projectId: process.env.REACT_APP_FBPROJECTID,
	storageBucket: process.env.REACT_APP_FBSTORAGEBUCKET,
	messagingSenderId: process.env.REACT_APP_FBMESSAGINGSENDERID,
	appId: process.env.REACT_APP_FBAPPID,
	measurementId: process.env.REACT_APP_FBMEASUREMENTID,
};

export default firebaseConfig;
