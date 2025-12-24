// api/ping.js
export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    message: 'Backend for landing is alive ✨',
    time: new Date().toISOString()
  });
}
