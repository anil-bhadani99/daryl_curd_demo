var sendJsonResponse = function (req, res, statusCode, data, error, flagMsg) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' })
  res.write(JSON.stringify({
    statusCode: statusCode,
    data: data,
    message: error,
    statusMessage: flagMsg
  }))
  res.end()
}
module.exports.sendJsonResponse = sendJsonResponse
