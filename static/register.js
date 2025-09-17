// register.js - Camera and registration logic for ExamGuard

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const registerForm = document.getElementById('registerForm');
    const faceImageInput = document.getElementById('face_image');
    const confirmationMsg = document.getElementById('confirmationMsg');
    const registerButton = document.getElementById('registerButton');
    const cameraError = document.getElementById('cameraError');
    const retryCamera = document.getElementById('retryCamera');

    let cameraStream = null;

    async function initCamera() {
        try {
            cameraStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 }, 
                    height: { ideal: 480 },
                    facingMode: 'user' 
                } 
            });
            video.srcObject = cameraStream;
            cameraError.style.display = 'none';
        } catch (err) {
            console.error('Camera access error:', err);
            cameraError.style.display = 'block';
        }
    }

    retryCamera.addEventListener('click', function() {
        initCamera();
    });

    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        registerButton.disabled = true;
        registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        faceImageInput.value = canvas.toDataURL('image/jpeg', 0.8);
        this.submit();
        setTimeout(() => {
            confirmationMsg.style.display = 'flex';
            registerButton.disabled = false;
            registerButton.innerHTML = '<i class="fas fa-user-plus"></i> Register Account';
        }, 500);
    });

    window.addEventListener('beforeunload', () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
    });

    initCamera();
});
