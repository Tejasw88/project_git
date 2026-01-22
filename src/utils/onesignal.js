import OneSignal from 'react-onesignal';

export const initOneSignal = async () => {
    try {
        await OneSignal.init({
            appId: "5ea72ac8-5a9c-43ef-95e7-09d1417f2033",
            safari_web_id: "web.onesignal.auto.41aef4b6-51a4-4778-92bc-f3aa3e26acde",
            allowLocalhostAsSecureOrigin: true,
            notifyButton: {
                enable: true,
            },
        });
        console.log("OneSignal Initialized");
    } catch (err) {
        console.error("OneSignal Init Error:", err);
    }
};

export const sendNotification = async (title, message) => {
    // OneSignal usually handles push from backend, 
    // but we can log for testing or use external API if needed.
    console.log(`Push Notification: [${title}] ${message}`);
    // If we had a backend or used OneSignal REST API, we could trigger here.
};
