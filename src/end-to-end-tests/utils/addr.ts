const serverAddr =
    process.env.NODE_ENV === "development"
        ? `http://localhost:5000/graphql`
        : "https://api.softkave.com/graphql";

const rootAddr =
    process.env.NODE_ENV === "development"
        ? `http://localhost:5000`
        : "https://api.softkave.com";

export function getServerAddr() {
    return serverAddr;
}

export function getSockAddr() {
    return {
        url: rootAddr,
        path: "/socket",
    };
}
