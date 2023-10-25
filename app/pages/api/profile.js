export default function handler(req, res) {
    // Assuming user is logged in, return user's profile information
    const profileData = {
        username: "aariane", // Replace with actual username
        email: "arianeldv@gmail.com", // Replace with actual email
    };

    res.status(200).json(profileData);
}