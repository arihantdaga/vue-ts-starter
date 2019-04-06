const CONFIG = {
    API_HOST: process.env.API_HOST,
    API_URLS: {
        getNoteMeta: "/api/v1/meta/note",
        getUserMeta: "/api/v1/meta/user",
    }
}
module.exports = Object.freeze(CONFIG);