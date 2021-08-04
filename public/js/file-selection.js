const fileInput = document.querySelector('#img_upload input[type=file]');
  fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
      const fileName = document.querySelector('#img_upload .file-name');
      fileName.textContent = fileInput.files[0].name;
    }
  }

  const fileInput = document.querySelector('#img_upload input[type=file]');
  fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
      const fileName = document.querySelector('#img_upload .file-name');
      fileName.textContent = fileInput.files[0].name;
    }
  }