import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';
import './CreateNews.css';

const CreateNews = () => {
    const [newsData, setNewsData] = useState({
        title: '',
        link: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Preview the image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setImageFile(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (!imageFile) {
                throw new Error('Please select an image');
            }

            // Upload image to Firebase Storage
            const imageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            const imageUrl = await getDownloadURL(imageRef);

            // Add news item to Firestore
            await addDoc(collection(db, 'news'), {
                ...newsData,
                image: imageUrl,
                createdAt: new Date()
            });

            setSuccess(true);
            setNewsData({ title: '', link: '' });
            setImageFile(null);
            setImagePreview(null);
        } catch (err) {
            console.error('Error creating news:', err);
            setError(err.message || 'Failed to create news item');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewsData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="create-news">
            <h2>Add Update</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">News item created successfully!</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="News Title"
                    value={newsData.title}
                    onChange={handleChange}
                    required
                />
                <div className="image-upload">
                    <label htmlFor="image">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="image-preview" />
                        ) : (
                            <div className="upload-placeholder">
                                Click to upload image
                            </div>
                        )}
                    </label>
                    <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        required
                    />
                </div>
                <input
                    type="url"
                    name="link"
                    placeholder="News Link (optional)"
                    value={newsData.link}
                    onChange={handleChange}
                />
                <button type="submit" disabled={loading || !imageFile}>
                    {loading ? 'Adding...' : 'Add News Item'}
                </button>
            </form>
        </div>
    );
};

export default CreateNews;