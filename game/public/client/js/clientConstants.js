/////////////////////////////////////////////////////////
// The constants the are applicable to the client
// i.e. rendering, sizing, graphics, framerate, etc...
/////////////////////////////////////////////////////////

// Debug vars
// ToDo: use these
// ToDo: make these variable so they can be changed in-game
const debug = {
    debgMode: true,
    consoleLogs: true
}

const fogDistance = 1000
const renderScale = 1

const chatMessageTime = 8000 // in milliseconds

// Local storage keys
const lsKeys = { 
    clientSettings: 'clientSettings',
}

export {
    debug,
    fogDistance,
    renderScale,
    chatMessageTime,
    lsKeys
}