/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com", // Google profile images
            },
            {
                protocol: "https",
                hostname: "utfs.io", // UploadThing file URLs
            },
        ],
    },
};

export default nextConfig;
