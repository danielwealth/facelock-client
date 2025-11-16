const authenticate = async () => {
  const resp = await fetch('https://facelockserver.onrender.com/generate-authentication-options');
  const options = await resp.json();
  const authResp = await startAuthentication(options);

  const verifyResp = await fetch('https://facelockserver.onrender.com/verify-authentication', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(authResp),
  });

  const result = await verifyResp.json();
  if (result.success) {
    // Fetch and display unlocked images
    const imagesResp = await fetch('https://facelockserver.onrender.com/unlocked-images');
    const images = await imagesResp.json();
    console.log('Unlocked images:', images);
  } else {
    alert('Access denied');
  }
};
