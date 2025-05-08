document.addEventListener("DOMContentLoaded", () => {
    console.log("Script loaded");

    const currentUserEmail = localStorage.getItem("currentUser");
    let userData = {}; // Initialize userData

    // Function to safely parse user data
    function loadUserData() {
        if (currentUserEmail) {
            const savedUserData = localStorage.getItem(`user_${currentUserEmail}`);
            if (savedUserData) {
                try {
                    userData = JSON.parse(savedUserData);
                    console.log("User data loaded:", userData);
                } catch (error) {
                    console.error("Error parsing user data:", error);
                    userData = {}; // Reset if parsing fails
                }
            } else {
                console.log("No saved user data found for:", currentUserEmail);
                userData = {}; // Ensure userData is an empty object if none found
            }
        } else {
            console.log("No current user logged in.");
            userData = {}; // Ensure userData is an empty object if no user
        }
    }

    // Load user data initially
    loadUserData();


    // Function to save user data
    function saveUserData() {
        if (currentUserEmail) {
            try {
                localStorage.setItem(`user_${currentUserEmail}`, JSON.stringify(userData));
                console.log("User data saved:", userData);
            } catch (error) {
                console.error("Error saving user data:", error);
                // Handle potential storage errors (e.g., quota exceeded)
                alert("Could not save profile changes. Storage might be full.");
            }
        } else {
            console.error("Cannot save user data: No current user.");
        }
    }

    // --- General UI Helpers ---

    // Function to update image preview (used on update-profile page)
    function updateImagePreview(inputElement, previewElement) {
        if (inputElement.files && inputElement.files[0]) {
            const file = inputElement.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                const dataUrl = e.target.result;
                if (previewElement.classList.contains('banner-preview')) {
                    // Set background for banners
                    previewElement.style.backgroundImage = `url('${dataUrl}')`;
                    previewElement.style.backgroundSize = 'cover';
                    previewElement.style.backgroundPosition = 'center';
                    previewElement.innerHTML = ''; // Clear any placeholder icon/text
                } else {
                    // Set src for profile photo/logo
                    previewElement.innerHTML = ''; // Clear placeholder
                    const img = document.createElement('img');
                    img.src = dataUrl;
                    img.alt = "Preview";
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    previewElement.appendChild(img);
                }
                // Store the Data URL directly in the userData object, ready for saving
                const storageKey = inputElement.id + 'Src'; // e.g., profilePhotoSrc
                userData[storageKey] = dataUrl;
                console.log(`Updated ${storageKey} in userData object`);
            }
            reader.readAsDataURL(file);
        }
    }

    // --- Dashboard Page Logic ---
    if (window.location.pathname.endsWith("dashboard.html")) {
        console.log("Dashboard page detected");

        // Update sidebar elements
        const profileNameElement = document.querySelector(".profile-name");
        const profileTaglineElement = document.querySelector(".profile-tagline");
        const companyNameElement = document.querySelector(".company-name");
        const companyLogoElement = document.querySelector(".company-logo"); // Container div
        const profilePhotoElement = document.querySelector(".profile-photo-center img");
        const headerAvatarPlaceholder = document.querySelector(".avatar-placeholder");

        if (Object.keys(userData).length > 0) {
            console.log("Updating dashboard sidebar with user data...");

            // Update Name (Combine first and last, fallback to email if no name)
            const firstName = userData.firstName || '';
            const lastName = userData.lastName || '';
            let displayName = `${firstName} ${lastName}`.trim();
            if (!displayName && currentUserEmail) {
                displayName = currentUserEmail.split('@')[0]; // Use part of email as fallback
            }
            if (profileNameElement) {
                profileNameElement.textContent = displayName.toUpperCase();
                console.log("Profile name updated:", displayName.toUpperCase());
            }

            // Update Tagline
            if (profileTaglineElement && userData.tagline) {
                profileTaglineElement.textContent = userData.tagline;
                console.log("Profile tagline updated:", userData.tagline);
            } else if (profileTaglineElement) {
                 profileTaglineElement.textContent = "Your Tagline Here"; // Default if not set
            }

            // Update Company Name
            if (companyNameElement && userData.companyName) {
                companyNameElement.textContent = userData.companyName;
                console.log("Company name updated:", userData.companyName);
            } else if (companyNameElement) {
                companyNameElement.textContent = "Your Company"; // Default
            }

            // Update Company Logo (Replace span with img if logo exists)
            if (companyLogoElement && userData.companyLogoSrc) {
                companyLogoElement.innerHTML = ''; // Clear existing content (span)
                const logoImg = document.createElement('img');
                logoImg.src = userData.companyLogoSrc;
                logoImg.alt = userData.companyName ? `${userData.companyName} Logo` : "Company Logo";
                logoImg.style.width = '100%'; // Ensure it fits the container
                logoImg.style.height = '100%';
                logoImg.style.objectFit = 'contain'; // Or 'cover' depending on desired look
                companyLogoElement.appendChild(logoImg);
                console.log("Company logo updated with image.");
            } else if (companyLogoElement && userData.companyName) {
                 // Fallback to initials if no logo but company name exists
                 const initials = userData.companyName.charAt(0).toUpperCase();
                 companyLogoElement.innerHTML = `<span>${initials}</span>`;
                 console.log("Company logo updated with initials:", initials);
            } else if (companyLogoElement) {
                // Default if no logo or name
                companyLogoElement.innerHTML = `<span><i class="fas fa-building"></i></span>`;
            }


            // Update Profile Photo (Sidebar)
            if (profilePhotoElement && userData.profilePhotoSrc) {
                profilePhotoElement.src = userData.profilePhotoSrc;
                console.log("Sidebar profile photo updated.");
            }

            // Update Header Avatar
            if (headerAvatarPlaceholder) {
                const existingAvatarContent = headerAvatarPlaceholder.querySelector("i, img"); // Find icon or image
                if (userData.profilePhotoSrc) {
                    if (existingAvatarContent && existingAvatarContent.tagName === 'IMG') {
                        existingAvatarContent.src = userData.profilePhotoSrc; // Update existing image
                         console.log("Header avatar image updated.");
                    } else {
                        // Replace icon with image
                        const avatarImg = document.createElement("img");
                        avatarImg.src = userData.profilePhotoSrc;
                        avatarImg.alt = "User Avatar";
                        avatarImg.style.width = "100%"; // Use 100% of placeholder
                        avatarImg.style.height = "100%";
                        avatarImg.style.borderRadius = "50%";
                        avatarImg.style.objectFit = "cover";
                        headerAvatarPlaceholder.innerHTML = ''; // Clear existing icon
                        headerAvatarPlaceholder.appendChild(avatarImg);
                        console.log("Header avatar icon replaced with image.");
                    }
                } else {
                     // If no photo, ensure the default icon is shown
                     if (!existingAvatarContent || existingAvatarContent.tagName !== 'I') {
                         headerAvatarPlaceholder.innerHTML = '<i class="fas fa-user-circle"></i>';
                         console.log("Header avatar set to default icon.");
                     }
                }
            }

            // Update Profile Banner Background
            const sidebarBannerElement = document.querySelector('.sidebar-banner'); // Target the correct element
            if (sidebarBannerElement && userData.profileBannerSrc) {
                sidebarBannerElement.style.backgroundImage = `url('${userData.profileBannerSrc}')`;
                // Keep existing background-size, background-position from CSS
                console.log("Sidebar banner background updated.");
            } else if (sidebarBannerElement) {
                // Optional: Set default background if none saved (or rely on CSS default)
                // sidebarBannerElement.style.backgroundImage = 'none';
                // sidebarBannerElement.style.backgroundColor = '#111'; // Example default
                console.log("Using default sidebar banner background.");
            }

        } else {
            console.log("No user data to update dashboard.");
            // Optionally set default values if needed
             if (profileNameElement) profileNameElement.textContent = "USER NAME";
             if (profileTaglineElement) profileTaglineElement.textContent = "Your Tagline Here";
             if (companyNameElement) companyNameElement.textContent = "Your Company";
             if (companyLogoElement) companyLogoElement.innerHTML = `<span><i class="fas fa-building"></i></span>`;
        }

        // History manipulation (optional, keep if needed)
        // history.pushState(null, "", location.href);
        // window.addEventListener("popstate", function(event) {
        //     history.pushState(null, "", location.href);
        //     console.log("Back button pressed on dashboard, staying on page.");
        // });
    }

    // --- Update Profile Page Logic ---
    if (window.location.pathname.endsWith("update-profile.html")) {
        console.log("Update Profile page detected");

        // Get form elements
        const updateProfileForm = document.getElementById("updateProfileForm");
        const firstNameInput = document.getElementById("firstName");
        const lastNameInput = document.getElementById("lastName");
        const taglineInput = document.getElementById("tagline"); // Added tagline
        const emailInput = document.getElementById("email");
        const phoneInput = document.getElementById("phone");
        const companyNameInput = document.getElementById("companyName");
        // ... (add other text/select fields as needed)

        // Get image input and preview elements
        const profileBannerInput = document.getElementById("profileBanner");
        const profileBannerPreview = document.getElementById("profileBannerPreview");
        const profilePhotoInput = document.getElementById("profilePhoto");
        const profilePhotoPreview = document.getElementById("profilePhotoPreview");
        const companyBannerInput = document.getElementById("companyBanner");
        const companyBannerPreview = document.getElementById("companyBannerPreview");
        const companyLogoInput = document.getElementById("companyLogo");
        const companyLogoPreview = document.getElementById("companyLogoPreview");

        // Populate form with existing data
        if (Object.keys(userData).length > 0) {
            console.log("Populating update profile form...");
            firstNameInput.value = userData.firstName || '';
            lastNameInput.value = userData.lastName || '';
            taglineInput.value = userData.tagline || ''; // Populate tagline
            emailInput.value = userData.email || currentUserEmail || ''; // Use stored email or current user
            phoneInput.value = userData.phone || '';
            companyNameInput.value = userData.companyName || '';
            // ... (populate other fields)

            // Populate image previews
            if (userData.profileBannerSrc && profileBannerPreview) {
                profileBannerPreview.style.backgroundImage = `url('${userData.profileBannerSrc}')`;
                profileBannerPreview.style.backgroundSize = 'cover';
                profileBannerPreview.style.backgroundPosition = 'center';
                profileBannerPreview.innerHTML = '';
            }
            if (userData.profilePhotoSrc && profilePhotoPreview) {
                const img = profilePhotoPreview.querySelector('img');
                if (img) img.src = userData.profilePhotoSrc; else updateImagePreview({files: [null], id: 'profilePhoto'}, profilePhotoPreview); // Logic to create img if missing
            }
            if (userData.companyBannerSrc && companyBannerPreview) { // Example for company banner
                companyBannerPreview.style.backgroundImage = `url('${userData.companyBannerSrc}')`;
                companyBannerPreview.style.backgroundSize = 'cover';
                companyBannerPreview.style.backgroundPosition = 'center';
                companyBannerPreview.innerHTML = '';
            }
            if (userData.companyLogoSrc && companyLogoPreview) { // Example for company logo
                const img = companyLogoPreview.querySelector('img');
                if (img) img.src = userData.companyLogoSrc; else updateImagePreview({files: [null], id: 'companyLogo'}, companyLogoPreview); // Logic to create img if missing
            }
        } else {
             console.log("No existing user data to populate form.");
             // Set email field if user is logged in but has no data yet
             if (currentUserEmail) emailInput.value = currentUserEmail;
        }

        // Add event listeners for image inputs
        if (profileBannerInput && profileBannerPreview) {
            profileBannerInput.addEventListener('change', () => updateImagePreview(profileBannerInput, profileBannerPreview));
        }
        if (profilePhotoInput && profilePhotoPreview) {
            profilePhotoInput.addEventListener('change', () => updateImagePreview(profilePhotoInput, profilePhotoPreview));
        }
        if (companyBannerInput && companyBannerPreview) { // Add listener for company banner
            companyBannerInput.addEventListener('change', () => updateImagePreview(companyBannerInput, companyBannerPreview));
        }
        if (companyLogoInput && companyLogoPreview) { // Add listener for company logo
            companyLogoInput.addEventListener('change', () => updateImagePreview(companyLogoInput, companyLogoPreview));
        }

        // Handle form submission
        if (updateProfileForm) {
            updateProfileForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevent default page reload
                console.log("Update profile form submitted.");

                // Update userData object with values from text/select fields
                // Note: Images are already updated in userData by updateImagePreview via event listeners
                userData.firstName = firstNameInput?.value || '';
                userData.lastName = lastNameInput?.value || '';
                userData.tagline = taglineInput?.value || '';
                userData.email = emailInput?.value || '';
                userData.phone = phoneInput?.value || '';
                userData.companyName = companyNameInput?.value || '';
                userData.homeAddress = document.getElementById('homeAddress')?.value || '';
                userData.state = document.getElementById('state')?.value || '';
                userData.class12 = document.getElementById('class12')?.value || '';
                userData.grade12 = document.getElementById('grade12')?.value || '';
                userData.class10 = document.getElementById('class10')?.value || '';
                userData.grade10 = document.getElementById('grade10')?.value || '';
                // ... (get values from other fields like skills, certificates)
                // Example for skills (assuming updateSkillsHiddenInput function exists and updates #skills)
                // updateSkillsHiddenInput(); // Make sure skills data is ready
                // userData.skills = document.getElementById('skills')?.value || '';

                // Save the updated data
                saveUserData();

                // Optional: Give feedback and redirect
                alert("Profile updated successfully!");
                window.location.href = "dashboard.html"; // Redirect to dashboard
            });
        }
    }


    // --- Login Page Logic ---
    const loginForm = document.getElementById("login-form");
    loginForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const email = emailInput.value.trim();
        const password = passwordInput.value; // No trim for password

        // Simple demo login - replace with real auth later
        const demoEmail = "user@example.com";
        const demoPassword = "password123";

        if (email === demoEmail && password === demoPassword) {
            console.log("Demo login successful!");
            localStorage.setItem("currentUser", email); // Set the current user
            loadUserData(); // Load data for the logged-in user
            window.location.replace("dashboard.html"); // Use replace to avoid back button to login
        } else {
            console.log("Login failed: Invalid credentials");
            alert("Invalid email or password.");
            passwordInput.value = "";
            passwordInput.focus();
        }
    });

    // --- Avatar Dropdown Logic ---
    const avatarPlaceholder = document.querySelector(".avatar-placeholder");
    const avatarDropdown = document.getElementById("avatar-dropdown") || document.getElementById("avatarDropdown"); // Check both possible IDs

    avatarPlaceholder?.addEventListener("click", (event) => {
        event.stopPropagation();
        if (avatarDropdown) {
            avatarDropdown.classList.toggle("show");
            console.log("Toggled avatar dropdown");
        }
    });

    // Close dropdown on outside click
    window.addEventListener("click", (event) => {
        if (avatarDropdown && avatarDropdown.classList.contains("show")) {
            if (!avatarPlaceholder || !avatarPlaceholder.contains(event.target)) {
                avatarDropdown.classList.remove("show");
                console.log("Closed avatar dropdown (outside click)");
            }
        }
    });

    // --- Logout Logic ---
    const logoutLink = document.getElementById("logout-link") || document.getElementById("logoutLink"); // Check both possible IDs
    logoutLink?.addEventListener("click", (event) => {
        event.preventDefault();
        console.log("Logging out...");
        localStorage.removeItem("currentUser");
        localStorage.removeItem(`user_${currentUserEmail}`); // Clear specific user data too
        userData = {}; // Clear in-memory data
        alert("Logged out successfully.");
        window.location.replace("index.html"); // Use replace to avoid back button to dashboard
    });

    // --- Skills Management (Keep if still needed) ---
    let skillsList = []; // Initialize skills list

    // Function to update skills display
    function updateSkillsDisplay() {
        const skillsContainer = document.getElementById("skillsContainer");
        if (!skillsContainer) return;
        skillsContainer.innerHTML = "";
        skillsList.forEach((skill, index) => {
            const skillTag = document.createElement("span");
            skillTag.className = "skill-tag";
            skillTag.innerHTML = `${skill} <span class="remove-skill" data-index="${index}">×</span>`;
            skillsContainer.appendChild(skillTag);
        });
        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-skill").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.getAttribute("data-index"));
                skillsList.splice(index, 1);
                updateSkillsDisplay();
                updateSkillsHiddenInput(); // Update hidden input if used
                userData.skills = skillsList; // Update skills in main userData object
                console.log("Skill removed, updated userData.skills");
            });
        });
    }

    // Function to update hidden input value (if using a hidden input for form submission)
    function updateSkillsHiddenInput() {
        const skillsHiddenInput = document.getElementById("skills");
        if (skillsHiddenInput) {
            skillsHiddenInput.value = JSON.stringify(skillsList);
        }
    }

    // Load existing skills on update-profile page
     if (window.location.pathname.endsWith("update-profile.html")) {
         if (userData.skills && Array.isArray(userData.skills)) {
             skillsList = userData.skills;
             updateSkillsDisplay();
             updateSkillsHiddenInput(); // Ensure hidden input is also populated
             console.log("Loaded existing skills:", skillsList);
         }

         const skillInput = document.getElementById("skillInput");
         const addSkillBtn = document.getElementById("addSkillBtn");

         function addSkillAction() {
             const skill = skillInput.value.trim();
             if (skill && !skillsList.includes(skill)) {
                 skillsList.push(skill);
                 updateSkillsDisplay();
                 updateSkillsHiddenInput();
                 userData.skills = skillsList; // Update skills in main userData object
                 skillInput.value = ""; // Clear input
                 console.log("Skill added, updated userData.skills:", skill);
             } else if (skillsList.includes(skill)) {
                 alert("Skill already added.");
             }
             skillInput.focus();
         }

         addSkillBtn?.addEventListener("click", addSkillAction);
         skillInput?.addEventListener("keypress", (event) => {
             if (event.key === "Enter") {
                 event.preventDefault(); // Prevent form submission on Enter
                 addSkillAction();
             }
         });
     }

    // --- Certificate Management (Placeholder - Adapt as needed) ---
    // Add logic here if certificate adding/saving is required

    console.log("Event listeners added.");
}); // End DOMContentLoaded
