import React, { useState } from 'react';
import './UploadSong.css';
import { Modal, Button, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadSong = ({ onClose }) => {
  const [songFile, setSongFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    description: '',
  });

  const handleFileChange = (file, type) => {
    if (type === 'song') {
      setSongFile(file);
    } else if (type === 'cover') {
      setCoverFile(file);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async () => {
    if (!songFile || !coverFile) {
      message.error('Please select both a song file and a cover image.');
      return;
    }

    const data = new FormData();
    data.append('song', songFile);
    data.append('cover', coverFile);
    data.append('name', formData.name);
    data.append('genre', formData.genre);
    data.append('description', formData.description);

    try {
      const response = await fetch('/api/songs/upload', {
        method: 'POST',
        body: data,
      });
      const result = await response.json();

      if (response.ok) {
        message.success('Song uploaded successfully!');
        onClose();
      } else {
        message.error(`Upload failed: ${result.message}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Something went wrong while uploading the song.');
    }
  };

  return (
    <Modal
      title="Upload Song"
      visible={true}
      onCancel={onClose}
      footer={null}
    >
      <div className="upload-form">
        <Input
          placeholder="Song Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <Input
          placeholder="Genre"
          name="genre"
          value={formData.genre}
          onChange={handleInputChange}
        />
        <Input.TextArea
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <Upload
          beforeUpload={(file) => {
            handleFileChange(file, 'song');
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Select Song</Button>
        </Upload>
        <Upload
          beforeUpload={(file) => {
            handleFileChange(file, 'cover');
            return false;
          }}
        >
          <Button icon={<UploadOutlined />}>Select Cover Image</Button>
        </Upload>
        <div className="upload-actions">
          <Button type="primary" onClick={handleUpload}>
            Upload
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

export default UploadSong;
