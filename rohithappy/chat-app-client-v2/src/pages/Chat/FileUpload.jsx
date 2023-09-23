import React, { useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { AiFillFileAdd } from 'react-icons/ai';
import { FaShare } from 'react-icons/fa';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputMessage, setInputMessage] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    axios
      .post('http://localhost:5000/upload', formData)
      .then((response) => {
        setMessage(response.data);
      })
      .catch((error) => {
        console.error(error);
      });

    axios
        .get('http://localhost:5000/list')
        .then((response) => {
           window.open('http://localhost:5000/list/'+response)
        })

  };

  return (
    <>
      <RoomInputButton>
         <ButtonIconWrapperFile>
             <input style={{opacity: 0, position:'absolute'}} type="file" onChange={handleFileChange} enctype="multipart/form-data" />
             <AiFillFileAdd />
         </ButtonIconWrapperFile>
      </RoomInputButton>
      <RoomInputButton>
         <ButtonIconWrapperFile>
            <button style={{opacity: 0, position:'absolute'}} onClick={handleUpload}>ss</button>
            <FaShare />
         </ButtonIconWrapperFile>
      </RoomInputButton>
    </>
  );
}

const RoomInputButton = styled.button`
  margin-right: 0.5rem;
  width: 40px;
  height: 40px;
  border-radius: 15px;
  background-color: var(--primary);
  color: var(--bg-color-main);
  outline: none;
  border: none;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonIconWrapper = styled(IconWrapper)`
  font-size: 1.15rem;
  transform: rotate(-40deg);
  padding-left: 6px;
  cursor: pointer;
`;

const ButtonIconWrapperFile = styled(IconWrapper)`
  font-size: 1.25rem;
  cursor: pointer;
  overflow: hidden;
  position: relative;
`;

export default FileUpload;
