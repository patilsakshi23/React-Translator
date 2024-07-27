import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const Imgtotext = ({ onDetectText }) => {
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        detectText(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const detectText = (image) => {
    setLoading(true);
    onDetectText('Processing...'); // Show processing text in textarea
    Tesseract.recognize(
      image,
      'eng',
      {
        logger: (m) => console.log(m),
      }
    ).then(({ data: { text } }) => {
      onDetectText(text);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      onDetectText('Error processing image');
      setLoading(false);
    });
  };

  return (
    <div>
      <input
        type="file"
        id="image-input"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />
      <label htmlFor="image-input">
        <i
          id="img"
          className="fas fa-image"
          style={{ cursor: 'pointer' }}
        ></i>
      </label>
      {loading}
    </div>
  );
};

export default Imgtotext;
