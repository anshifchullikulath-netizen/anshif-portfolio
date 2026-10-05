document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) return;

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        const formData = new FormData(contactForm);

        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            message: formData.get("message")
        };

        // Button loading state
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";
        }

        try {
            const response = await fetch(
                "https://anshif-django-backend.onrender.com/contact/",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const result = await response.json();

            if (response.ok) {
                alert(
                    "Thank you! Your enquiry has been sent successfully."
                );

                contactForm.reset();
            } else {
                alert(
                    result.message ||
                    result.error ||
                    "Something went wrong. Please try again."
                );
            }
        } catch (error) {
            console.error("Contact form error:", error);

            alert(
                "Unable to send your enquiry right now. Please try again later."
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Send Message";
            }
        }
    });
});
