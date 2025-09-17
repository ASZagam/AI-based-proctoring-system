// login.js - Camera and login logic for ExamGuard

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const loginForm = document.getElementById('loginForm');
    const faceImageInput = document.getElementById('face_image');
    const roleSelect = document.getElementById('roleSelect');
    const buttonText = document.getElementById('buttonText');
    const cameraPermission = document.getElementById('cameraPermission');
    const loginButton = document.getElementById('loginButton');
    const cameraError = document.getElementById('cameraError');
    const retryCamera = document.getElementById('retryCamera');

    let cameraStream = null;
    let cameraAccessGranted = false;

    function updateUIForRole() {
        if (roleSelect.value === 'admin') {
            video.style.display = 'none';
            canvas.style.display = 'none';
            cameraPermission.style.display = 'none';
            buttonText.textContent = 'Login as Admin';
            loginButton.innerHTML = '<i class="fas fa-user-shield"></i><span id="buttonText">Login as Admin</span>';
        } else {
            video.style.display = 'block';
            canvas.style.display = 'none';
            buttonText.textContent = 'Login with Face Verification';
            loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i><span id="buttonText">Login with Face Verification</span>';
            if (!cameraAccessGranted) {
                cameraPermission.style.display = 'flex';
            }
        }
    }

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
            cameraAccessGranted = true;
            cameraPermission.style.display = 'none';
            cameraError.style.display = 'none';
        } catch (err) {
            console.error('Camera access error:', err);
            cameraPermission.style.display = 'flex';
            cameraPermission.innerHTML = `
                <i class="fas fa-camera"></i>
                <span>Camera access is required for face verification. Please enable camera permissions.</span>
            `;
            cameraError.style.display = 'block';
        }
    }

    retryCamera.addEventListener('click', function() {
        initCamera();
    });

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (roleSelect.value === 'admin') {
            faceImageInput.value = '';
            loginForm.submit();
            return;
        }
        if (!cameraStream) {
            alert('Please allow camera access to continue with face verification.');
            return;
        }
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying Face...';
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        faceImageInput.value = canvas.toDataURL('image/jpeg', 0.8);
        loginForm.submit();
    });

    window.addEventListener('beforeunload', () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
    });

    roleSelect.addEventListener('change', updateUIForRole);
    updateUIForRole();
    initCamera();
});
