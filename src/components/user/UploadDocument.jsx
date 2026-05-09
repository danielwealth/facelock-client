const submit = async () => {
  if (!file || !selfie) {
    setStatus({ error: '❌ Both ID document and selfie are required' });
    return;
  }

  setLoading(true);
  try {
    // Step 1: Get presigned URLs
    const idUpload = await getUploadUrl({ filename: file.name, filetype: file.type, category: 'id' });
    const selfieUpload = await getUploadUrl({ filename: 'selfie.png', filetype: 'image/png', category: 'selfie' });

    // Step 2: Upload files to S3
    await uploadToS3(idUpload.uploadUrl, file);
    await uploadToS3(selfieUpload.uploadUrl, selfie);

    // Step 3: Start verification job
    const job = await postVerifyDocument({ idKey: idUpload.key, selfieKey: selfieUpload.key });
    setStatus({ success: true, data: job });

    // Step 4: Poll for job status
    const interval = setInterval(async () => {
      try {
        const result = await getVerificationStatus(job.jobId);
        setStatus({ success: true, data: result });

        if (result.status !== 'pending') {
          clearInterval(interval);
        }
      } catch (pollErr) {
        clearInterval(interval);
        setStatus({ error: pollErr.message || 'Failed to fetch status' });
      }
    }, 5000);

    if (onUploaded) onUploaded(job);

    // Reset form
    setFile(null);
    setSelfie(null);
    setPreviewUrl(null);
    setSelfiePreview(null);
  } catch (err) {
    console.error('Upload error:', err);
    setStatus({ error: err?.message || 'Verification failed' });
  } finally {
    setLoading(false);
  }
};
