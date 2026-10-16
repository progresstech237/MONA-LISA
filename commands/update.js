// In-place self-update is intentionally disabled.
// MONA LISA MD runs from an immutable, versioned build. Updating = redeploying a new version
// from the dashboard. Downloading and extracting a remote archive over the running code would let
// whoever controls that repository execute code on every deployment.
module.exports = {
    name: 'update',
    description: 'Disabled: redeploy a new version from the MONA LISA MD dashboard',
    async execute(message) {
        await message.reply('ℹ️ In-place updates are disabled for security. Redeploy the latest MONA LISA MD version from your dashboard.');
    }
};
