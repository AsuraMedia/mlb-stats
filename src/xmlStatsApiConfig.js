export const config = {
    baseURL: 'https://erikberg.com',
    apiToken: '895aca12-fa39-4870-9c26-3fdfc3f8d6ba',
    timeout: 2000
}

export const endpoints = {
    eventsUrl: (date, sport) => {
        return `${config.baseURL}/events.json?date=${date}&sport=${sport}`
    },
    boxCoreUrl: (eventId) => {
        return `${config.baseURL}/mlb/boxscore/${eventId}.json`
    }
}