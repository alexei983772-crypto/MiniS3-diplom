function splitBuffer(buffer, chunkSize = 1024 * 1024) {
  const chunks = [];
  let index = 0;

  while (index < buffer.length) {
    chunks.push(buffer.slice(index, index + chunkSize));
    index += chunkSize;
  }

  return chunks;
}

module.exports = { splitBuffer };