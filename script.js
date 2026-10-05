document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       REVEAL ANIMATIONS
    ========================== */

    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });


    /* =========================
       NAVBAR SCROLL
    ========================== */

    const nav = document.getElementById("nav");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });


    /* =========================
       MOBILE MENU
    ========================== */

    const menu = document.getElementById("menu");

    if (menu) {
        menu.addEventListener("click", () => {
            nav.classList.toggle("open");
        });
    }


    /* =========================
       CONTACT FORM
    ========================== */

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
                submitButton.textContent = "Send Enquiry →";
            }

        }

    });

});
