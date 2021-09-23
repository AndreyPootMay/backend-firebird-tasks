/**
 * Getting values for created_at, updated_at
 * @return {array}
 */
const getTimestamps = () => {
    return [
        new Date().toISOString().slice(0, 19),
        new Date().toISOString().slice(0, 19),
    ];
};

/**
 * Convert the buffer object into an array
 * @param {Uint8Array}
 * @var {array}
 */
const convertBufferArray = data => {
    return (data && data instanceof Uint8Array)
        ? String.fromCharCode.apply(null, new Uint8Array(data))
        : data;
};

module.exports = {
    getTimestamps,
    convertBufferArray
};
