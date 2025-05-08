// LinkedIn-style profile update page script

document.addEventListener('DOMContentLoaded', () => {
    console.log("LinkedIn profile update script loaded");
    
    // --- Photo Upload Management ---
    setupPhotoUploads();
    
    // --- Skills Management ---
    setupSkillsManagement();
    
    // --- Certificate Management ---
    setupCertificateManagement();
    
    // --- Form Submission ---
    setupFormSubmission();
    
    // --- Load User Data ---
    loadUserData();
    
    // --- Setup Cancel Button ---
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            window.location.href = 'dashboard.html';
        });
    }
});

// Photo Upload Setup
function setupPhotoUploads() {
    // Profile Photo
    setupPhotoUpload('profilePhotoBrowse', 'profilePhoto', 'profilePhotoPreview', 'profilePhotoFileName');
    
    // Company Logo
    setupPhotoUpload('companyLogoBrowse', 'companyLogo', 'companyLogoPreview', 'companyLogoFileName');
    
    // Dynamic certificate badge uploads
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('linkedin-upload-button') && event.target.getAttribute('data-input')) {
            const inputId = event.target.getAttribute('data-input');
            const input = document.getElementById(inputId);
            if (input) {
                input.click();
                
                // Setup preview for this certificate badge
                const previewId = inputId.replace('certBadge', 'certBadgePreview');
                const fileNameId = inputId.replace('certBadge', 'certBadgeFileName');
                
                input.addEventListener('change', () => {
                    handleFileSelect(input, previewId, fileNameId);
                });
            }
        }
    });
}

// Function to set up file upload
function setupPhotoUpload(browseButtonId, fileInputId, previewId, fileNameId) {
    const browseButton = document.getElementById(browseButtonId);
    const fileInput = document.getElementById(fileInputId);
    
    if (browseButton && fileInput) {
        browseButton.addEventListener('click', () => {
            fileInput.click();
        });
        
        fileInput.addEventListener('change', () => {
            handleFileSelect(fileInput, previewId, fileNameId);
        });
    }
}

// Function to handle file selection
function handleFileSelect(fileInput, previewId, fileNameId) {
    const preview = document.getElementById(previewId);
    const fileName = document.getElementById(fileNameId);
    
    if (preview && fileInput.files && fileInput.files[0]) {
        const file = fileInput.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            // Clear preview
            preview.innerHTML = '';
            
            // Create image and add to preview
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
            
            // Update file name display if element exists
            if (fileName) {
                fileName.textContent = file.name;
            }
        };
        
        reader.readAsDataURL(file);
    }
}

// Skills Management Setup
function setupSkillsManagement() {
    const skillInput = document.getElementById('skillInput');
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillsContainer = document.getElementById('skillsContainer');
    const skillsHiddenInput = document.getElementById('skills');
    
    let skillsList = [];
    
    // Add a skill when the "Add" button is clicked
    if (addSkillBtn) {
        addSkillBtn.addEventListener('click', () => {
            addSkill();
        });
    }
    
    // Add a skill when Enter key is pressed in the input field
    if (skillInput) {
        skillInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                addSkill();
            }
        });
    }
    
    // Function to add a skill
    function addSkill() {
        if (skillInput && skillInput.value.trim() !== '') {
            const skill = skillInput.value.trim();
            
            // Only add if not already in the list
            if (!skillsList.includes(skill)) {
                skillsList.push(skill);
                updateSkillsDisplay();
                updateSkillsHiddenInput();
            }
            
            skillInput.value = '';
            skillInput.focus();
        }
    }
    
    // Function to update skills display
    function updateSkillsDisplay() {
        if (skillsContainer) {
            skillsContainer.innerHTML = '';
            
            skillsList.forEach((skill, index) => {
                const skillTag = document.createElement('div');
                skillTag.className = 'linkedin-skill-tag';
                skillTag.innerHTML = `${skill} <span class="remove-skill" data-index="${index}">×</span>`;
                skillsContainer.appendChild(skillTag);
                
                // Add event listener for removing skill
                const removeBtn = skillTag.querySelector('.remove-skill');
                if (removeBtn) {
                    removeBtn.addEventListener('click', () => {
                        skillsList.splice(index, 1);
                        updateSkillsDisplay();
                        updateSkillsHiddenInput();
                    });
                }
            });
        }
    }
    
    // Function to update hidden input value
    function updateSkillsHiddenInput() {
        if (skillsHiddenInput) {
            skillsHiddenInput.value = JSON.stringify(skillsList);
        }
    }
    
    // Load existing skills from userData if available
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const userData = JSON.parse(localStorage.getItem(`user_${currentUser}`));
            if (userData && userData.skills) {
                skillsList = Array.isArray(userData.skills) ? userData.skills : [];
                updateSkillsDisplay();
                updateSkillsHiddenInput();
            }
        } catch (error) {
            console.error('Error loading user skills:', error);
        }
    }
}

// Certificate Management Setup
function setupCertificateManagement() {
    const addCertificateBtn = document.getElementById('addCertificateBtn');
    const certificatesContainer = document.getElementById('certificatesContainer');
    
    let certCount = 1; // Start with 1 (we already have the first certificate in the HTML)
    
    if (addCertificateBtn && certificatesContainer) {
        addCertificateBtn.addEventListener('click', () => {
            certCount++;
            
            const newCert = document.createElement('div');
            newCert.className = 'linkedin-certificate';
            newCert.innerHTML = `
                <div class="linkedin-form-row">
                    <div class="linkedin-form-col-6">
                        <div class="linkedin-form-group">
                            <label for="certName${certCount}">Certificate Name</label>
                            <input type="text" id="certName${certCount}" name="certName${certCount}" placeholder="e.g., AWS Certified Solutions Architect">
                        </div>
                    </div>
                    <div class="linkedin-form-col-6">
                        <div class="linkedin-form-group">
                            <label for="certIssuer${certCount}">Issuing Organization</label>
                            <input type="text" id="certIssuer${certCount}" name="certIssuer${certCount}" placeholder="e.g., Amazon Web Services">
                        </div>
                    </div>
                </div>
                
                <div class="linkedin-form-row">
                    <div class="linkedin-form-col-6">
                        <div class="linkedin-form-group">
                            <label for="certDate${certCount}">Issue Date</label>
                            <input type="date" id="certDate${certCount}" name="certDate${certCount}">
                        </div>
                    </div>
                    <div class="linkedin-form-col-6">
                        <div class="linkedin-form-group">
                            <label for="certLink${certCount}">Certificate Link</label>
                            <input type="url" id="certLink${certCount}" name="certLink${certCount}" placeholder="https://example.com/certificate">
                        </div>
                    </div>
                </div>
                
                <div class="linkedin-photo-container">
                    <div class="linkedin-photo certificate-badge" id="certBadgePreview${certCount}">
                        <i class="fas fa-certificate"></i>
                    </div>
                    <div class="linkedin-photo-actions">
                        <input type="file" id="certBadge${certCount}" name="certBadge${certCount}" accept="image/*" class="file-input" style="display: none;">
                        <button type="button" class="linkedin-upload-button" data-input="certBadge${certCount}">
                            <i class="fas fa-upload"></i> Upload badge
                        </button>
                        <span class="form-info" id="certBadgeFileName${certCount}">Optional: Upload credential badge image</span>
                    </div>
                </div>
            `;
            
            certificatesContainer.appendChild(newCert);
        });
    }
}

// Form Submission Setup
function setupFormSubmission() {
    const updateProfileForm = document.getElementById('updateProfileForm');
    
    if (updateProfileForm) {
        updateProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get current user
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                console.error('No current user found');
                return;
            }
            
            // Get existing user data or create new object
            let userData;
            try {
                userData = JSON.parse(localStorage.getItem(`user_${currentUser}`)) || {};
            } catch (error) {
                console.error('Error parsing user data:', error);
                userData = {};
            }
            
            // Collect form data
            userData.firstName = document.getElementById('firstName').value;
            userData.lastName = document.getElementById('lastName').value;
            userData.email = document.getElementById('email').value;
            userData.phone = document.getElementById('phone').value;
            userData.homeAddress = document.getElementById('homeAddress').value;
            userData.state = document.getElementById('state').value;
            
            // Education data
            userData.education = {
                class12: document.getElementById('class12').value,
                grade12: document.getElementById('grade12').value,
                class10: document.getElementById('class10').value,
                grade10: document.getElementById('grade10').value
            };
            
            // Skills data
            const skillsHiddenInput = document.getElementById('skills');
            if (skillsHiddenInput && skillsHiddenInput.value) {
                try {
                    userData.skills = JSON.parse(skillsHiddenInput.value);
                } catch (error) {
                    console.error('Error parsing skills:', error);
                    userData.skills = [];
                }
            }
            
            // Company data
            userData.company = {
                name: document.getElementById('companyName').value,
                address: document.getElementById('companyAddress').value,
                phone: document.getElementById('companyPhone').value,
                website: document.getElementById('website').value,
                description: document.getElementById('companyDescription').value,
                industry: document.getElementById('industry').value,
                foundedYear: document.getElementById('foundedYear').value,
                teamSize: document.getElementById('teamSize').value,
                fundingStage: document.getElementById('fundingStage').value
            };
            
            // Social media data
            userData.socialMedia = {
                instagram: document.getElementById('instagram').value,
                linkedin: document.getElementById('linkedin').value
            };
            
            // Profile image data - get from preview if it exists
            const profilePreview = document.getElementById('profilePhotoPreview');
            const profileImg = profilePreview.querySelector('img');
            if (profileImg) {
                userData.profileImageSrc = profileImg.src;
            }
            
            // Company logo data
            const logoPreview = document.getElementById('companyLogoPreview');
            const logoImg = logoPreview.querySelector('img');
            if (logoImg) {
                userData.companyLogoSrc = logoImg.src;
            }
            
            // Save user data
            try {
                localStorage.setItem(`user_${currentUser}`, JSON.stringify(userData));
                console.log('Profile updated successfully');
                
                // Show success notification
                const savePopup = document.getElementById('savePopup');
                if (savePopup) {
                    savePopup.classList.add('show');
                    setTimeout(() => {
                        savePopup.classList.remove('show');
                    }, 3000);
                }
            } catch (error) {
                console.error('Error saving profile data:', error);
                alert('Error saving profile data. Please try again.');
            }
        });
    }
}

// Load User Data function
function loadUserData() {
    // Get current user
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        console.log('No current user found - showing empty form');
        return;
    }
    
    // Get user data
    try {
        const userData = JSON.parse(localStorage.getItem(`user_${currentUser}`));
        if (!userData) {
            console.log('No user data found - showing empty form');
            return;
        }
        
        console.log('Loading user data', userData);
        
        // Populate basic fields
        setValueIfExists('firstName', userData.firstName);
        setValueIfExists('lastName', userData.lastName);
        setValueIfExists('email', userData.email);
        setValueIfExists('phone', userData.phone);
        setValueIfExists('homeAddress', userData.homeAddress);
        setValueIfExists('state', userData.state);
        
        // Populate education fields
        if (userData.education) {
            setValueIfExists('class12', userData.education.class12);
            setValueIfExists('grade12', userData.education.grade12);
            setValueIfExists('class10', userData.education.class10);
            setValueIfExists('grade10', userData.education.grade10);
        }
        
        // Populate company fields
        if (userData.company) {
            setValueIfExists('companyName', userData.company.name);
            setValueIfExists('companyAddress', userData.company.address);
            setValueIfExists('companyPhone', userData.company.phone);
            setValueIfExists('website', userData.company.website);
            setValueIfExists('companyDescription', userData.company.description);
            setValueIfExists('industry', userData.company.industry);
            setValueIfExists('foundedYear', userData.company.foundedYear);
            setValueIfExists('teamSize', userData.company.teamSize);
            setValueIfExists('fundingStage', userData.company.fundingStage);
        }
        
        // Populate social media fields
        if (userData.socialMedia) {
            setValueIfExists('instagram', userData.socialMedia.instagram);
            setValueIfExists('linkedin', userData.socialMedia.linkedin);
        }
        
        // Set profile image if it exists
        if (userData.profileImageSrc) {
            const profilePreview = document.getElementById('profilePhotoPreview');
            if (profilePreview) {
                profilePreview.innerHTML = `<img src="${userData.profileImageSrc}" alt="Profile Photo">`;
            }
        }
        
        // Set company logo if it exists
        if (userData.companyLogoSrc) {
            const logoPreview = document.getElementById('companyLogoPreview');
            if (logoPreview) {
                logoPreview.innerHTML = `<img src="${userData.companyLogoSrc}" alt="Company Logo">`;
            }
        }
        
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Helper function to set form field values if they exist
function setValueIfExists(elementId, value) {
    if (value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.value = value;
        }
    }
}
