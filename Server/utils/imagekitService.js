const IMAGEKIT_UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload';
const IMAGEKIT_API_URL = 'https://api.imagekit.io/v1/files';

const getBasicAuthHeader = () => {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

    if (!privateKey) {
        throw new Error('ImageKit private key is not configured');
    }

    const credentials = Buffer.from(`${privateKey}:`).toString('base64');
    return `Basic ${credentials}`;
};

const uploadFileToImageKit = async (file, folder = '/portfolio/resume') => {
    if (!file) {
        throw new Error('No file provided for ImageKit upload');
    }

    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });

    formData.append('file', blob, file.originalname);
    formData.append('fileName', file.originalname);
    formData.append('folder', folder);
    formData.append('useUniqueFileName', 'true');

    const response = await fetch(IMAGEKIT_UPLOAD_URL, {
        method: 'POST',
        headers: {
            Authorization: getBasicAuthHeader(),
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'ImageKit upload failed');
    }

    return {
        fileId: data.fileId,
        url: data.url,
        name: data.name,
    };
};

const deleteFileFromImageKit = async (fileId) => {
    if (!fileId) {
        return;
    }

    const response = await fetch(`${IMAGEKIT_API_URL}/${fileId}`, {
        method: 'DELETE',
        headers: {
            Authorization: getBasicAuthHeader(),
        },
    });

    if (!response.ok && response.status !== 404) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'ImageKit delete failed');
    }
};

module.exports = {
    uploadFileToImageKit,
    deleteFileFromImageKit,
};
